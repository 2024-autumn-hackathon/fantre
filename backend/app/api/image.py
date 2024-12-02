# app/api/image.py
import os, io, boto3, hashlib

from datetime import datetime
from fastapi import APIRouter, Depends, UploadFile, HTTPException
from bson import ObjectId
from PIL import Image
from dotenv import load_dotenv

from app.api.user import get_current_user
from app.models import Image as Img
from app.database.db_item import exists_item_id
from app.database.db_image import save_image, get_image_name, save_bg_image, exists_image_name, get_bg_image_name


router = APIRouter(dependencies=[Depends(get_current_user)])

# -----------------------------------------------

load_dotenv()

# S3接続情報
s3 = boto3.client(
        "s3",
        endpoint_url="http://s3-minio:9000",
        aws_access_key_id=os.getenv("MINIO_ROOT_USER"),
        aws_secret_access_key = os.getenv("MINIO_ROOT_PASSWORD"),
        )

bucket = "image"

# 拡張子リスト
valid_extensions = (".png", ".jpg", ".jpeg")

# 画像サイズ上限
MAX_WIDTH = 1080
MAX_HEIGHT = 1080


# -----------------------------------------------

# 画像トリミング
async def crop_image(imagefile):
    image = Image.open(imagefile.file) # 画像ファイルを画像オブジェクトとして開く
    original_image_size = image.size # 画像サイズ(幅、高さ)のタプル

    # 縦横どちらかが規定値を超えていた場合、アスペクト比を保って両辺規定値以下に縮小
    if original_image_size[0] > MAX_WIDTH or original_image_size[1] > MAX_HEIGHT:
        image.thumbnail(size = (MAX_WIDTH, MAX_HEIGHT))
    
    resized_image_size = image.size

    # 短辺に合わせて中心基準で正方形にトリミング
    crop_size = min(resized_image_size)
    cropped_image = image.crop((
        (resized_image_size[0]-crop_size)//2,
        (resized_image_size[1]-crop_size)//2,
        crop_size+((resized_image_size[0]-crop_size)//2),
        crop_size+((resized_image_size[1]-crop_size)//2)
    ))
    return cropped_image # imageオブジェクト


#　minio(S3)に保存
def save_image_to_S3(image_object, bucket, key):
    image_byte = io.BytesIO()
    image_object.save(image_byte, format='png', quality=75)
    image_byte = image_byte.getvalue() # byte形式に変換

    try:
        s3.put_object(Body = image_byte, Bucket = bucket, Key = key)
    except Exception as e:
        print(f"S3 Upload Error: {e}")
        raise HTTPException(
            status_code=500, detail="Image Upload Error"
        )


# ダウンロード用署名付きURL生成
def generate_presigned_url(s3_client, bucketname, key, expires_in):
    try:
        presign_url = s3_client.generate_presigned_url(
            ClientMethod='get_object',
            Params={'Bucket': bucketname, 'Key': key},
            ExpiresIn=expires_in
        )
    except Exception as e:
        print(f"generate presigned url Error: {e}")
        raise HTTPException(
            status_code=500, detail="Image Download Error"
        )
    return presign_url


# -----------------------------------------------

# 画像登録
@router.post('/api/image/{item_id}')
async def upload_item_image(item_id: str, item_image: UploadFile, user_id: str = Depends(get_current_user)):

    # item_id存在確認
    if await exists_item_id(ObjectId(item_id)):
        raise HTTPException(status_code=422, detail="The item does not exist.")
    
    root, ext = os.path.splitext(item_image.filename)
    if ext.lower() not in valid_extensions: #拡張子チェック
        raise HTTPException(status_code=422, detail="Extension is not allowed.")
    hashed_root = hashlib.md5(root.encode()).hexdigest() # 日本語除去のため拡張子以外をハッシュ化
    hashed_image_name = hashed_root + ext

    if await exists_image_name(hashed_image_name): # ファイル名重複チェック 
        raise HTTPException(status_code=422, detail="The filename already exist.")
    
    # 画像加工して保存           
    cropped_image = await crop_image(item_image)
    save_image_to_S3(cropped_image, bucket, hashed_image_name)
    image_info = Img(user_id=ObjectId(user_id), item_id=ObjectId(item_id), image_name = hashed_image_name, created_at=datetime.now(), is_background=False)

    await save_image(image_info)
    return image_info


# 画像取得
@router.get('/api/images/{item_id}')
async def get_item_image_url(item_id: str, user_id: str = Depends(get_current_user)):

    # item_id存在確認
    if await exists_item_id(ObjectId(item_id)):
        raise HTTPException(status_code=422, detail="The item does not exist.")
    
    # key取得
    image_name = await get_image_name(user_id, ObjectId(item_id))
    if image_name is None:
        raise HTTPException(status_code=206, detail="The item image does not exist.")
    
    # ダウンロード用署名付きURL生成
    presigned_url = generate_presigned_url(s3, bucket, image_name, 30)
    presigned_url = presigned_url.replace("s3-minio","localhost") # コンテナ間通信でなければ要らないはず

    return presigned_url


# 背景画像登録・更新
@router.post('/api/user/bg-images')
async def upload_bg_image(bg_image: UploadFile, user_id: str = Depends(get_current_user)):

    ext = os.path.splitext(bg_image.filename)[1]
    if ext.lower() not in valid_extensions: #拡張子チェック
        raise HTTPException(status_code=422, detail="Extension is not allowed.")    
    str_user_id = str(user_id)
    hashed_root = hashlib.md5(str_user_id.encode()).hexdigest() # 日本語除去のため拡張子以外をハッシュ化
    hashed_bg_image_name = hashed_root + ".jpg"
  
    # 画像加工して保存           
    cropped_image = await crop_image(bg_image)
    save_image_to_S3(cropped_image, bucket, hashed_bg_image_name)

    bg_image_info = Img(user_id=ObjectId(user_id), image_name = hashed_bg_image_name, created_at=datetime.now(), is_background=True)
   
    await save_bg_image(bg_image_info)
    return bg_image_info


# 背景画像取得
@router.get('/api/user/bg-images')
async def get_bg_image_url(user_id: str = Depends(get_current_user)):
    # key取得
    bg_image_name = await get_bg_image_name(ObjectId(user_id))
    if bg_image_name is None:
        raise HTTPException(status_code=206, detail="The Background image does not exist.")
    
    # ダウンロード用署名付きURL生成
    presigned_url = generate_presigned_url(s3, bucket, bg_image_name, 30)
    presigned_url = presigned_url.replace("s3-minio","localhost") # コンテナ間通信でなければ要らないはず

    return presigned_url
