# backend/app/database/db_user.py
from fastapi import HTTPException
from pydantic import EmailStr, ValidationError

from app.database.db_connection import Database
from app.models import User


db = Database()


# user登録
async def create_user(user: User):
    try:
        await db.connect()
        await user.insert()
        return user
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail="User registration error")
    finally:
        await db.disconnect()


# user情報取得
async def get_user(email: EmailStr):
    try:
        await db.connect()
        user = await User.find_one({"email": email})
        return user
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail="User fetching error")
    finally:
        await db.disconnect()


# user_name重複確認
async def exists_username(user_name: str) -> bool:
    try:
        await db.connect()
        result = await User.find_one({"user_name": user_name})
        return result is not None
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail="User fetching error")
    finally:
        await db.disconnect()


# email重複確認
async def exists_email(email: EmailStr) -> bool:
    try:    
        await db.connect()
        result = await User.find_one({"email": email})
        return result is not None
    except ValidationError as ve:
            raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail="User fetching error")
    finally:
        await db.disconnect()

