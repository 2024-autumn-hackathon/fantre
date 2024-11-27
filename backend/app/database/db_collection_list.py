# backend/app/database/db_list.py
from fastapi import HTTPException
from pydantic import BaseModel, EmailStr, ValidationError
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from beanie import WriteRules

from app.database.db_connection import Database
from app.models import User, Item, CollectionList


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
        user = await User.find_one({"_id": user_id})
        return user.collection_lists
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"get collection list error: {str(e)}")
    finally:
        await db.disconnect()


# コレクションリストにグッズ追加
async def add_item_to_list(list_id: ObjectId, item_id: ObjectId, user_id: ObjectId):
    try:
        await db.connect()
        user = await User.find_one({"_id": user_id})
        user_collection_lists = user.collection_lists
        for list in user_collection_lists:
            if list.id == list_id:
                list.list_items.append(item_id)
        await user.save()
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"get collection list error: {str(e)}")
    finally:
        await db.disconnect()


# コレクションリストからグッズ削除
async def delete_item_from_list(list_id: ObjectId, item_id: ObjectId, user_id: ObjectId):
    try:
        await db.connect()
        user = await User.find_one({"_id": user_id})
        user_collection_lists = user.collection_lists
        for list in user_collection_lists:
            if list.id == list_id:
                list.list_items.remove(item_id)
        await user.save()
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"get collection list error: {str(e)}")
    finally:
        await db.disconnect()


# コレクションリスト削除
async def delete_list(list_id: ObjectId, user_id: ObjectId):
    try:
        await db.connect()
        user = await User.find_one({"_id": user_id})
        update_list = []
        for list in user.collection_lists:
            if list.id != list_id:
                update_list.append(list)
        user.collection_lists = update_list
        await user.save()
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"get collection list error: {str(e)}")
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