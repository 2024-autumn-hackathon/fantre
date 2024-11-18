# app/api/image.py
import os
from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, UploadFile, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from PIL import Image
import urllib.parse as urlparse

from app.models import Image as Img
from app.database.db_item import exists_item_id
from app.database.db_image import save_image


router = APIRouter()

# 画像サイズ上限
MAX_WIDTH = 1080
MAX_HEIGHT = 1080


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


#　任意のディレクトリに保存
async def save_image_at_dir(image_object, dir_path, filename):
    os.makedirs(dir_path, exist_ok=True) # ディレクトリ作成
    path = os.path.join(dir_path, filename)
    image_object.save(path, quality=75)


# 画像登録
@router.post('/api/images')
async def upload_item_image(item_id: str, item_image: UploadFile): # user_id: str = Depends(user.get_current_user)
    # item_id存在確認
    if await exists_item_id(ObjectId(item_id)):
        raise HTTPException(status_code=422, detail="The item_id does not exist.")
    #拡張子チェック
    filename = item_image.filename
    ext = os.path.splitext(filename)
    print(ext)
    if ext[1].lower() not in (".png", ".jpg", ".jpeg"):
        raise HTTPException(status_code=422, detail="Extension is not allowed.")
    
    cropped_image = await crop_image(item_image)
    localserver_url = "http://localhost:7000/"
    image_url = urlparse.urljoin(localserver_url, filename)
    image_info = Img(user_id=ObjectId("6728433a3bdeccb817510476"), item_id=ObjectId(item_id), image_url = image_url, created_at=datetime.now(), is_background=False)
    
    # 任意の場所に保存
    await save_image_at_dir(cropped_image, "/app/virtualS3/", filename)
    await save_image(image_info)
    return image_info

# テスト用item_id : 673887f61263913ccdd3f391
    