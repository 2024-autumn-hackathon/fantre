# backend/app/database/db_image.py
from fastapi import HTTPException
from pydantic import EmailStr, ValidationError
from bson import ObjectId

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
            return item_image.image_url
        return None

    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching item : {str(e)}")
    finally:
        await db.disconnect()