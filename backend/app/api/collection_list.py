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
from app.database.db_item import create_item, existing_item_check, get_item, get_all_items
from app.database.db_content_catalog import character_name_partial_match, get_category_name, get_character_name, get_series_name, series_name_partial_match
from app.database.db_collection_list import exists_collection_list_name, add_collection_list


router = APIRouter(dependencies=[Depends(get_current_user)])


# コレクションリスト作成
@router.post("/api/lists")
async def create_collectionlist(list_name: Annotated[str, Form()], user_id: str = Depends(get_current_user)):
    # ユーザー確認
    if await exists_user(ObjectId(user_id)):
        raise HTTPException(status_code=400, detail="The user not exist.")
    
    # リスト名重複チェック
    if await exists_collection_list_name(list_name, ObjectId(user_id)):
        raise HTTPException(status_code=422, detail="The listname already exist.")
   
    # リスト追加
    new_list_id = ObjectId()
    new_list = CollectionList(_id=new_list_id, list_name=list_name, created_at=datetime.now(), list_items=[])
    await add_collection_list(new_list, user_id=ObjectId(user_id))
    return str(new_list_id)


#     collection_list = await get_collection_list(ObjectId(user_id))
#     if list_name in collection_list:
#         raise HTTPException(status_code=422, detail="The listname already exist.")
#     created_list = await add_collection_list(CollectionList(list_name=list_name), user_id=ObjectId(user_id))
#     return created_list.id



# コレクションリスト一覧取得
@router.get("/api/lists")
async def get_lists(user_id: str = Depends(get_current_user)):
    # ユーザー確認
    if await exists_user(ObjectId(user_id)):
        raise HTTPException(status_code=400, detail="The user not exist.")
    

    


# コレクションリスト詳細取得
@router.get("/api/lists/{list_id}")
async def get_list_detail(list_id: str):
    pass


# コレクションリストにグッズ追加
@router.post("/api/list-items")
async def create_item_endpoint(list_name: str):
    pass


# 所持/未所持変更
@router.patch("/api/list-items/{item_id}/own")
async def create_item_endpoint(list_name: str):
    pass


# コレクションリストからグッズ削除
@router.delete("/api/list-items")
async def cdelete_list_items(list_name: str):
    pass


# コレクションリスト削除
@router.delete("/api/lists/{list_id}")
async def cdelete_list_items(list_name: str):
    pass