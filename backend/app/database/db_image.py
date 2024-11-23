# backend/app/database/db_image.py
from fastapi import HTTPException
from pydantic import EmailStr, ValidationError
from bson import ObjectId
from datetime import datetime

from app.database.db_connection import Database
from app.models import Image


db = Database()


# 画像登録
async def save_image(image: Image):
    try:
        await db.connect()
        await image.insert()
        return image
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image registration error: {str(e)}")
    finally:
        await db.disconnect()


# image_name重複チェック
async def exists_image_name(image_name: str) -> bool:
    try:
        await db.connect()
        result = await Image.find_one({"image_name": image_name})
        return result is not None
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail="Image fetching error")
    finally:
        await db.disconnect()


# item_idに紐づいている画像URL全て取得
async def get_imagename_from_itemid(item_id: ObjectId):
    try:
        await db.connect()
        images = await Image.find({"item_id": item_id}).to_list()  # クエリ結果をリストとして取得

        image_names = []
        if images:
            image_names = [image.image_name for image in images]
            return image_names
        return image_names
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching item : {str(e)}")
    finally:
        await db.disconnect()


# 画像URL単体取得
async def get_image_name(user_id: ObjectId, item_id: ObjectId):
    try:
        await db.connect()
        user_image = await Image.find_one({"user_id": user_id, "item_id": item_id},sort=[("_id", -1)]) # 一番新しいの取得
        if user_image:
            return user_image.image_name
        item_image = await Image.find_one({"item_id": item_id}, sort=[("_id", -1)] ) # 一番新しいの取得
        if item_image:
            return item_image.image_name
        return None

    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching item : {str(e)}")
    finally:
        await db.disconnect()


# 背景画像登録・更新
async def save_bg_image(bg_image: Image):
    try:
        await db.connect()
        existed_bg_image = await Image.find_one({"user_id": bg_image.user_id, "is_background": True})
        if existed_bg_image:
            await existed_bg_image.set({"created_at": bg_image.created_at})
        else:
            await bg_image.insert()
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"bgImage registration error: {str(e)}")
    finally:
        await db.disconnect()


# 背景画像取得
async def get_bg_image_name(user_id: ObjectId):
    try:
        await db.connect()
        bg_image = await Image.find_one({"user_id": user_id, "is_background": True})
        if bg_image is None:
            return None
        return bg_image.image_name
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Background Image : {str(e)}")
    finally:
        await db.disconnect()
