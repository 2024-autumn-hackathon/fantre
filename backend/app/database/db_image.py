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


# item_idに紐づいている画像URL取得
async def get_url_from_itemid(item_id: ObjectId):
    try:
        await db.connect()
        images = await Image.find({"item_id": item_id}).to_list()  # クエリ結果をリストとして取得

        image_url = []
        if images:
            image_url = [image.image_url for image in images]
            return image_url
        return image_url
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching item : {str(e)}")
    finally:
        await db.disconnect()