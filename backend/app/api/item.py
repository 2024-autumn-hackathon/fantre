# backend/app/api/item.py
from typing import List, Optional
from app.models import Item
from app.database.db_item import create_item, get_item, get_all_items
from app.database.db_content_catalog import get_category_name, get_character_name, get_series_name
from pydantic import BaseModel, field_validator, ValidationError, Field, StringConstraints
from datetime import date
from bson import ObjectId
from fastapi import APIRouter, HTTPException, status, Query
from beanie import Indexed
import re, calendar
from datetime import datetime

router = APIRouter()

class ItemRequest(BaseModel):    
    item_images: Optional[List[str]] = Field(default_factory=list) # image_idのリスト
    item_name: str
    item_series: str = None # series_id
    item_character: str = None # character_id
    category: Optional[str] = None # category_id
    tags: Optional[List[str]] = Field(default_factory=list)
    jan_code: Optional[str] = Field(None, description="JAN code (8 or 13 degits)") 
    release_date: Optional[str] = Field(None, description="Release date YYYY-MM-DD)") 
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
    
    # カスタムバリデーションで日付を検証
    @field_validator("release_date")
    def validate_release_date(cls, v):
        if v is not None and not re.match(r'^\d{4}-\d{2}-\d{2}$', v):
            raise ValueError("release_date must be in the format YYYY-MM-DD.")
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
            if item_data["jan_code"] and item.jan_code == item_data["jan_code"]:
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

        series_name = await get_series_name(ObjectId(item.item_series)) if item.item_series else None
        character_name = await get_character_name(ObjectId(item.item_character)) if item.item_character else None
        category_name = await get_category_name(ObjectId(item.category)) if item.category else None

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


# 発売日入力値を解析
async def parse_release_date(release_date: str):
    try:
        if len(release_date) == 4:  # YYYY
            return datetime(year=int(release_date), month=12, day=31).date()  # その年の最終日を返す
        elif len(release_date) == 7:  # YYYY-MM
            year = int(release_date[:4])
            month = int(release_date[5:7])
            last_day = calendar.monthrange(year, month)[1]  # 最終日を取得
            return datetime(year, month, last_day).date()  # その月の最終日の日付を返す
        elif len(release_date) == 10:  # YYYY-MM-DD
            return datetime.strptime(release_date, "%Y-%m-%d").date()            
        else:
            raise ValueError("Invalid date format. Please use YYYY, YYYY-MM, or YYYY-MM-DD.")
    
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))


# 検索・一覧画面用グッズ情報取得
@router.get("/api/items/page/{current_page}")
async def get_filtered_items(
    current_page: int,
    item_series: str = Query(None),
    item_character: str = Query(None),
    item_name: str = Query(None),
    tags: str = Query(None),
    jan_code: str = Query(None),
    release_date: str = Query(None),
    retailers: str = Query(None),
):	
    # クエリは１つ以上必須入力
    if not any([item_series, item_character, item_name, tags, jan_code, release_date, retailers]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one of the query parameters must be provided."
            )
       

    try:
        # クエリ用の辞書を作成
        query = {}
        # クエリを部分一致に対応させる
        if item_series:
            query["item_series"] = ObjectId(item_series)
        if item_character:
            query["item_character"] = ObjectId(item_character)   
        if item_name:
            query["item_name"] = {"$regex": item_name, "$options": "i"}
        if tags:
            query["tags"] = {"$elemMatch": {"$regex": tags, "$options": "i"}}
        if jan_code:
            query["jan_code"] = jan_code
        if release_date:
            parsed_release_date = await parse_release_date(release_date)
            query = {"$or": [
                {"release_date": {"$lt": parsed_release_date}},  # 指定された日付より前
                {"release_date": None}  # 空白も検索結果に含める
                ]}
        if retailers:
            query["retailers"] = {"$elemMatch": {"$regex": retailers, "$options": "i"}}
        # クエリを使ってアイテム取得
        filtered_items = await Item.find(query).to_list()

        if not filtered_items:
            return{
                "message": "No items found matching the queries."
            }        
        sorted_items =  sorted(filtered_items, key=lambda x: x.id.generation_time, reverse=True)
        # ページネーション
        items_per_page = 2
   
        start_index = (current_page - 1) * items_per_page
        end_index = start_index + items_per_page
        pagenated_items = sorted_items[start_index:end_index]

        total_items_count = len(sorted_items)
        all_pages = (total_items_count + items_per_page - 1) // items_per_page

        response = {
                "items": [
                        {
                            "id": str(sorted_item.id), 
                            "item_name": sorted_item.item_name
                        }
                        for sorted_item in pagenated_items
                        ],                    
                        "all_pages": all_pages
                    }        
        return response

    except ValidationError as e:
        raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail={"errors": e.errors()}
        )
    except Exception as e:
        print(f"Unexpected error when fetching the filtered_items: {str(e)}")  # 詳細なエラーをログに出力
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occured while fetching the filtered_items"
        )
