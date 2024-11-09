# backend/app/api/item.py
from typing import List
from app.models import Item
from app.database.db_item import create_item
from pydantic import BaseModel, field_validator
from datetime import date
from bson import ObjectId
from fastapi import APIRouter

# PydanticがObjectId型を受け入れるようにする
class BaseModelWithConfig(BaseModel):
    class Config:
        arbitrary_types_allowed = True # 任意の型を許可
        json_encoders = {
            ObjectId: str # ObjectIdを文字列に変換する設定
        }

router = APIRouter()

class ItemRequest(BaseModelWithConfig):    
    item_name: str
    item_images: List[str] # image_id
    category: str #category_id
    item_series: str # series_id
    item_character: str #character_id
    tags: List[str]
    jan_code: str
    release_date: date
    retailers: List[str]
    user_data: List[str] #user_id UserSpecificDataでこのアイテムを持っているユーザー

    # カスタムバリデーションで文字列をObjectIdに変換
    @field_validator("item_images", "user_data")
    def validate_item_images(cls, v):
        return [ObjectId(i) if isinstance(i, str) else i for i in v]

    @field_validator("item_series", "item_character", "category")
    def validate_object_id(cls, v):
        return ObjectId(v) if isinstance(v, str) else v

# グッズ（アイテム）登録
@router.post("/api/items")
async def create_item_endpoint(item_request: ItemRequest):
    item = Item(**item_request.model_dump())
    created_item = await create_item(item)
    return created_item