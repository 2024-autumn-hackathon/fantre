# backend/app/api/item.py
from typing import List, Optional
from app.models import Item
from app.database.db_item import create_item, get_item, get_all_items
from app.database.db_content_catalog import get_category_name, get_character_name, get_series_name
from pydantic import BaseModel, field_validator, ValidationError, Field, StringConstraints
from datetime import date
from bson import ObjectId
from fastapi import APIRouter, HTTPException, status
from beanie import Indexed
import re

router = APIRouter()

class ItemRequest(BaseModel):    
    item_images: Optional[List[str]] = Field(default_factory=list) # image_idのリスト
    item_name: str
    item_series: Optional[str] = None # series_id
    item_character: Optional[str] = None # character_id
    category: Optional[str] = None # category_id
    tags: Optional[List[str]] = Field(default_factory=list)
    jan_code: Optional[str] = Field(None, description="JAN code (8 or 13 degits)") 
    retailers: Optional[List[str]] = Field(default_factory=list)
    user_data: Optional[List[str]] = Field(default_factory=list) # user_specific_data_id

    # カスタムバリデーションで文字列をObjectIdに変換
    @field_validator('item_images', 'user_data')
    def validate_item_images(cls, v):
        return [ObjectId(i) if isinstance(i, str) else i for i in v]
        
    @field_validator('item_series', 'item_character', 'category')
    def validate_object_id(cls, v):
        return ObjectId(v) if isinstance(v, str) else v
    
    # カスタムバリデーションでJANコードの形式を検証
    @field_validator("jan_code")
    def validate_jan_code(cls, v):
        if v is not None and not re.match(r'^\d{8}$|^\d{13}$', v):
            raise ValueError("jan_code must be 8 or 13 digits")
        return v
    
# グッズ（アイテム）登録
@router.post("/api/items")
async def create_item_endpoint(item_request: ItemRequest):
    try:
        item_data = item_request.model_dump()

        # 既存のアイテムとitem_nameとjan_codeの重複を確認
        existing_items = await get_all_items()
        for item in existing_items:
            if item.item_name == item_data["item_name"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Item with the same name already exists."
                )
            if item.jan_code == item_data["jan_code"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Item with the same JAN code already exists."
                )


        item = Item(**item_data)
        created_item = await create_item(item)
        return created_item
    
    except ValidationError as e:
        print(f"Validation error: {e.errors()}")  # エラーの詳細を出力
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"errors": e.errors()}
        )
    except Exception as e:
        print(f"Unexpected error when creating item: {str(e)}")  # 詳細なエラーをログに出力
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occured while creating the item"
        )
    
# グッズ詳細取得
@router.get("/api/items/{item_id}")
async def get_item_details(item_id: str):
    try:
        item = await get_item(ObjectId(item_id))

        # この部分あとから実装
        # ログインしたユーザーの独自データIDがitem.user_dataにあったら独自データのcustom_itemをとりにいく
        # なくても、ログインしたユーザーの独自データでcustom_seriesなどを確認にいく
        # 独自データがあった場合はそのcustom_nameをとってくる


        # 独自データがまったく設定されていない場合それぞれのidから共有名を取ってくる
        series_name = await get_series_name(ObjectId(item.item_series))
        character_name = await get_character_name(ObjectId(item.item_character))
        category_name = await get_category_name(ObjectId(item.category))

        response = {
            "item_name": item.item_name,
            "series_name": series_name,
            "character_name": character_name,
            "category_name": category_name,
            "tags": item.tags,
            "jan_code": item.jan_code,
            "release_date": item.release_date,
            "retailers": item.retailers
        }
        return response
    
    except ValidationError as e:
        print(f"Validation error: {e.errors()}")  # エラーの詳細を出力
        raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail={"errors": e.errors()}
        )
    except Exception as e:
        print(f"Unexpected error when fetching the item: {str(e)}")  # 詳細なエラーをログに出力
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occured while fetching the item"
        )

#         item_name: str
# series_name: str catalogから持ってこないといけない
# character_name: str catalogから持ってこないといけない
# category_name: str catalogから持ってこないといけない
# tags: [str]
# JAN_code: int
# release_date: datetime
# retailers: [str]
# own_status: bool
