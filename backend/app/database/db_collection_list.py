# backend/app/database/db_list.py
from fastapi import HTTPException
from pydantic import BaseModel, EmailStr, ValidationError
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from beanie import WriteRules

from app.database.db_connection import Database
from app.models import User, CollectionList


db = Database()


# class UserCollectionlists(BaseModel):
#     collection_lists: Optional[List["CollectionList"]]

# コレクションリスト登録
async def add_collection_list(new_list: CollectionList, user_id: ObjectId):
    try:
        await db.connect()
        await User.find_one({"_id": user_id}).update({"$push":{User.collection_lists:new_list}})
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"create collection list error: {str(e)}")
    finally:
        await db.disconnect()

# コレクションリスト取得
async def get_collection_list(user_id: ObjectId):
    try:
        await db.connect()
        lists = await User.find({"user_id": user_id}).project(UserCollectionlists)
        lists = await User.find({"user_id": user_id}).distinct("_id", "")
        print(lists)
        if lists:
            image_names = [image.image_name for image in images]
            return image_names
        return image_names
        return lists
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"create collection list error: {str(e)}")
    finally:
        await db.disconnect()

# list_name重複チェック
async def exists_collection_list_name(list_name: str, user_id: ObjectId)-> bool:
    try:
        await db.connect()
        user = await User.find_one({"_id": user_id})
        list_names = [col.list_name for col in user.collection_lists]
        return list_name in list_names
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"List fetching error: {str(e)}")
    finally:
        await db.disconnect()