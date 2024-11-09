# backend/app/api/item.py
from typing import List, Optional
from app.models import Item
from app.database.db_item import create_item, get_items
from pydantic import BaseModel, field_validator, ValidationError, Field, StringConstraints
from datetime import date
from bson import ObjectId
from fastapi import APIRouter, HTTPException, status
from beanie import Indexed
import re

# # PydanticがObjectId型を受け入れるようにする
# class BaseModelWithConfig(BaseModel):
#     class Config:
#         arbitrary_types_allowed = True # 任意の型を許可
#         json_encoders = {
#             ObjectId: str # ObjectIdを文字列に変換する設定
#         }

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
    @field_validator("item_images", "user_data", mode="before", check_fields=False) 
    def validate_object_id_lists(cls, v): 
        if v is None: 
            return [] 
        return [ObjectId(i) if ObjectId.is_valid(i) else i for i in v]
        
    @field_validator("item_series", "item_character", "category", mode="before", check_fields=False)
    def validate_object_id(cls, v):
        if v is None or not ObjectId.is_valid(v): 
            return v 
        return ObjectId(v)

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
        existing_items = await get_items()
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
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=e.errors()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )