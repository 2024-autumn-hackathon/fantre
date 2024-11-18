# backend/app/database/db_image.py
from fastapi import HTTPException
from pydantic import EmailStr, ValidationError

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
