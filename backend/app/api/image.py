# app/api/image.py
import os, io, boto3, hashlib

from datetime import datetime, timedelta
from typing import Annotated
from fastapi import APIRouter, UploadFile, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from PIL import Image
import urllib.parse as urlparse
from dotenv import load_dotenv
from minio import Minio

from app.models import Image as Img
from app.database.db_item import exists_item_id
from app.database.db_image import save_image, get_url_from_itemid, get_url


router = APIRouter()

USER=ObjectId("6741648c379d65123353859a")

# ----------変数--------------------------------------

# S3接続情報
s3 = boto3.client(
        "s3",
        endpoint_url="http://s3-minio:9000",
        aws_access_key_id=os.getenv("MINIO_ROOT_USER"),
        aws_secret_access_key = os.getenv("MINIO_ROOT_PASSWORD"),
        )

bucket = "image"


# 画像サイズ上限
MAX_WIDTH = 1080
MAX_HEIGHT = 1080



# ----------関数--------------------------------------

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
        image_url = urlparse.urljoin("http://127.0.0.1:9000", key)
    except Exception as e:
        print(f"S3 Upload Error: {e}")
        raise HTTPException(
            status_code=500, detail="Image Upload Error"
        )
    return image_url


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


# ----------API--------------------------------------

# 画像登録
@router.post('/api/image/{item_id}')
async def upload_item_image(item_id: str, item_image: UploadFile): # user_id: str = Depends(user.get_current_user)
    # item_id存在確認
    if await exists_item_id(ObjectId(item_id)):
        raise HTTPException(status_code=422, detail="The item does not exist.")
    
    # 名前と拡張子に分けて名前をハッシュ化
    filename = item_image.filename
    root, ext = os.path.splitext(filename)
    hash_root = hashlib.md5(root.encode()).hexdigest() # 日本語除去のため拡張子以外をハッシュ化
    hash_filename = hash_root + ext
    
    #拡張子チェック
    if ext.lower() not in (".png", ".jpg", ".jpeg"):
        raise HTTPException(status_code=422, detail="Extension is not allowed.")
    
    # ファイル名重複チェック 
    exists_url_list = await get_url_from_itemid(ObjectId(item_id))
    exists_key_list = []
    for url in exists_url_list:
        exists_key = os.path.basename(url)
        exists_key_list.append(exists_key)

    if hash_filename in exists_key_list:
        raise HTTPException(status_code=422, detail="The filename already exist.")

    # 画像加工して保存           
    cropped_image = await crop_image(item_image)
    image_url = save_image_to_S3(cropped_image, bucket, hash_filename)
    image_info = Img(user_id=USER, item_id=ObjectId(item_id), image_url = image_url, created_at=datetime.now(), is_background=False)

    await save_image(image_info)
    return image_info


# 画像取得
@router.get('/api/images/{item_id}')
async def get_item_image_url(item_id: str): # user_id: str = Depends(user.get_current_user)
    # item_id存在確認
    if await exists_item_id(ObjectId(item_id)):
        raise HTTPException(status_code=422, detail="The item does not exist.")
    
    # URL取得
    image_url = await get_url(USER, ObjectId(item_id))
    if image_url is None:
        raise HTTPException(status_code=206, detail="The item image does not exist.")
    
    # ダウンロード用署名付きURL生成
    key = os.path.basename(image_url)
    response_url = generate_presigned_url(s3, bucket, key, 10)
    response_url = response_url.replace("s3-minio","localhost") # コンテナ間通信でなければ要らないはず
    print(response_url) 
    return response_url



# テスト用item_id : 6736b102d2bffe77f23d75db
