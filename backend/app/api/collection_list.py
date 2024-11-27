# backend/app/api/list.py
from typing import List, Optional, Annotated
from pydantic import BaseModel, field_validator, ValidationError, Field, StringConstraints
from datetime import date, timedelta
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status, Query, Form
from beanie import Indexed
import re, calendar
from datetime import datetime

from app.models import User, Item, UserSpecificData, CollectionList
from app.api.user import get_current_user
from app.database.db_user import exists_user
from app.database.db_item import create_item, existing_item_check, get_item, get_all_items, get_item_names, exists_item_id
from app.database.db_content_catalog import character_name_partial_match, get_category_name, get_character_name, get_series_name, series_name_partial_match
from app.database.db_collection_list import exists_collection_list_name, get_collection_list, add_collection_list, add_item_to_list, delete_item_from_list, delete_list


router = APIRouter(dependencies=[Depends(get_current_user)])


# コレクションリスト作成
@router.post("/api/lists")
async def create_collectionlist(list_name: Annotated[str, Form()], user_id: str = Depends(get_current_user)):
    # ユーザー確認
    if await exists_user(ObjectId(user_id)) is None:
        raise HTTPException(status_code=400, detail="The user not exist.")
    
    # リスト名重複チェック
    if await exists_collection_list_name(list_name, ObjectId(user_id)):
        raise HTTPException(status_code=422, detail="The listname already exist.")
   
    # リスト追加
    new_list_id = ObjectId()
    new_list = CollectionList(_id=new_list_id, list_name=list_name, created_at=datetime.now(), list_items=[])
    await add_collection_list(new_list, user_id=ObjectId(user_id))
    return str(new_list_id)



# コレクションリスト一覧取得
@router.get("/api/lists")
async def get_collection_lists(user_id: str = Depends(get_current_user)):
    # ユーザー確認
    if await exists_user(ObjectId(user_id)) is None:
        raise HTTPException(status_code=400, detail="The user not exist.")
    
    # ユーザー固有のコレクションリスト取得して整形
    collection_lists = await get_collection_list(ObjectId(user_id))
    collection_lists_response = []
    for list in collection_lists:
        collection_lists_response.append({str(list.id): list.list_name})

    return collection_lists_response
        

# コレクションリスト詳細取得
@router.get("/api/lists/{list_id}")
async def get_list_detail(list_id: str, user_id: str = Depends(get_current_user)):
    # ユーザー確認
    if await exists_user(ObjectId(user_id)) is None:
        raise HTTPException(status_code=400, detail="The user not exist.")

    # ユーザー固有のコレクションリスト取得して指定のリストからitem_id取得
    collection_lists = await get_collection_list(ObjectId(user_id))
    print("collection_lists:", collection_lists)
    collection_item_ids = []
    for list in collection_lists:
        print(list.id, ObjectId(list_id))
        if list.id == ObjectId(list_id):
            collection_item_ids.extend(list.list_items)
    print("ここ")
    # item_idからitem_name取得して整形
    collection_item_response = await get_item_names(collection_item_ids)
    print("collection_item_response:", collection_item_response)
    print(type(collection_item_response))
    return collection_item_response


# コレクションリストにグッズ追加
@router.post("/api/list-items")
async def add_list_items(list_id: str, item_id: str, user_id: str = Depends(get_current_user)):
    # ユーザー確認
    if await exists_user(ObjectId(user_id)) is None:
        raise HTTPException(status_code=400, detail="The user not exist.")
    
    # item_id存在確認
    if await exists_item_id(ObjectId(item_id)):
        raise HTTPException(status_code=422, detail="The item does not exist.")
    
    await add_item_to_list(ObjectId(list_id), ObjectId(item_id), ObjectId(user_id))
        


# コレクションリストからグッズ削除
@router.delete("/api/list-items")
async def delete_list_items(list_id: str, item_id: str, user_id: str = Depends(get_current_user)):
    # ユーザー確認
    if await exists_user(ObjectId(user_id)) is None:
        raise HTTPException(status_code=400, detail="The user not exist.")
    
    # item_id存在確認
    if await exists_item_id(ObjectId(item_id)):
        raise HTTPException(status_code=422, detail="The item does not exist.")
    
    await delete_item_from_list(ObjectId(list_id), ObjectId(item_id), ObjectId(user_id))


# コレクションリスト削除
@router.delete("/api/lists/{list_id}")
async def cdelete_list_items(list_id: str, user_id: str = Depends(get_current_user)):
    # ユーザー確認
    if await exists_user(ObjectId(user_id)) is None:
        raise HTTPException(status_code=400, detail="The user not exist.")
    
    await delete_list(ObjectId(list_id), ObjectId(user_id))