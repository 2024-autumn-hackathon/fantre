# backend/app/api/item.py
from typing import List, Optional
from app.models import Item, UserSpecificData
from app.api.user import get_current_user
from app.database.db_item import create_item, existing_item_check, get_item, get_all_items
from app.database.db_content_catalog import character_name_partial_match, get_category_name, get_character_name, get_series_name, series_name_partial_match
from pydantic import BaseModel, field_validator, ValidationError, Field, StringConstraints
from datetime import date, timedelta
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status, Query
from beanie import Indexed
import re, calendar
from datetime import datetime

router = APIRouter(dependencies=[Depends(get_current_user)])

class ItemRequest(BaseModel):    
    item_images: Optional[List[str]] = Field(default_factory=list) # image_idのリスト
    item_name: str
    item_series: Optional[str] = None # series_id
    item_character: Optional[str] = None # character_id
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
        if not item_request.item_series:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Item series must be provided."
            )
        if not item_request.item_character:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Item character must be provided."
            )
        
        item_data = item_request.model_dump()
        
        existing_item = await existing_item_check(item_request.item_name, item_request.jan_code)
        if existing_item:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Item with the same name or JAN code already exists."
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
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unexpected error when creating item: {str(e)}")  # 詳細なエラーをログに出力
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occured while creating the item"
        )

# 作品IDから独自作品名を取得
async def get_custom_series_name(user_specific_data, series_id: ObjectId):
    if series_id is None:
        return None
    try:
        custom_series = next((ser for ser in user_specific_data.custom_series_names if ser.series_id == series_id), None)
        return custom_series.custom_series_name if custom_series else None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching custom series name by series_id: {str(e)}"
        )
    

# キャラクターIDから独自キャラクター名を取得
async def get_custom_character_name(user_specific_data, character_id: ObjectId):
    if character_id is None:
        return None
    try:
        custom_character = next((char for char in user_specific_data.custom_character_names if char.character_id == character_id), None)
        return custom_character.custom_character_name if custom_character else None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching custom series name by series_id: {str(e)}"
        )


# カテゴリーIDから独自カテゴリー名を取得
async def get_custom_category_name(user_specific_data, category_id: ObjectId):
    if category_id is None:
        return None
    try:
        custom_category = next((cat for cat in user_specific_data.custom_category_names if cat.category_id == category_id), None)
        return custom_category.custom_category_name if custom_category else None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching custom series name by series_id: {str(e)}"
        )   

# グッズ詳細取得
@router.get("/api/items/{item_id}")
async def get_item_details(item_id: str):

    user_id = ObjectId("507f1f77bcf86cd799439011") # JWTから取得に変更予定
    
    try:
        item = await get_item(ObjectId(item_id))

        user_specific_data = await UserSpecificData.find_one({"user_id": user_id})
        print(user_specific_data)

        # item_idが一致するcustom_itemを持っているかチェック
        custom_item = None
        if user_specific_data:
            custom_item = next((ci for ci in user_specific_data.custom_items if ci.item_id == ObjectId(item_id)), None)
            print(custom_item)

        # 独自名を取得
        custom_series_name = await get_custom_series_name(user_specific_data, item.item_series) if user_specific_data else None
        custom_character_name = await get_custom_character_name(user_specific_data, item.item_character) if user_specific_data else None
        custom_category_name = await get_custom_category_name(user_specific_data, item.category) if user_specific_data else None
        print(custom_series_name, custom_character_name, custom_category_name)

        if custom_item:
            response = {
                "item_name": custom_item.custom_item_name,
                "series_name": custom_series_name,
                "character_name": custom_character_name,
                "category_name": custom_category_name,
                "tags": custom_item.custom_item_tags,
                "jan_code": item.jan_code,
                "release_date": item.release_date,
                "retailer": custom_item.custom_item_retailer,
                "own_status": custom_item.own_status
            }
        else:
            # 共有の名前を取得
            series_name = await get_series_name(ObjectId(item.item_series)) if item.item_series else None
            character_name = await get_character_name(ObjectId(item.item_character)) if item.item_character else None
            category_name = await get_category_name(ObjectId(item.category)) if item.category else None
            print(series_name, character_name, category_name)

            response = {
                "item_name": item.item_name,
                "series_name": custom_series_name if custom_series_name else series_name,
                "character_name": custom_character_name if custom_character_name else character_name,
                "category_name": custom_category_name if custom_category_name else category_name,
                "tags": item.tags,
                "jan_code": item.jan_code,
                "release_date": item.release_date,
                "retailers": item.retailers,
                "own_status": "false"
            }
        return response
    
    except ValidationError as e:
        print(f"Validation error: {e.errors()}")  # エラーの詳細を出力
        raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail={"errors": e.errors()}
        )
    except HTTPException as e:
        print(f"HTTP Exception: {str(e.detail)}")
        raise e
    except Exception as e:
        print(f"Unexpected error when fetching the item: {str(e)}")
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
    series_name: str = Query(None),
    character_name: str = Query(None),
    item_name: str = Query(None),
    category_id: str = Query(None),
    tags: str = Query(None),
    jan_code: str = Query(None),
    release_date: str = Query(None),
    retailers: str = Query(None),
):	
    # 空白はNoneに変換
    params = [param.strip() if param else None for param in [series_name, character_name, item_name, tags, jan_code, release_date, retailers, category_id]]

    if params[3]:
        tags_list = [tag.strip() for tag in params[3].split(",")]
    else:
        tags_list = []
    
    if params[6]:
        retailers_list = [retailer.strip() for retailer in params[6].split(",")]
    else:
        retailers_list = []

    # クエリは１つ以上必須入力
    if not any(param for param in params if param):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one of the query parameters must be provided."
            )      

    try:
        # and検索のためのクエリ用のリストを作成
        query_conditions = []

        if series_name:
            # 別関数で部分検索
            series_ids = await series_name_partial_match(series_name)
            # 返ってきたseries_idを使い対応するitemを取得
            if series_ids:
                items_with_series = await Item.find({"item_series": {"$in": series_ids}}).to_list()
                # item_idを条件に追加
                query_conditions.append({"_id": {"$in": [ObjectId(item.id) for item in items_with_series]}})                
        if character_name:
            character_ids = await character_name_partial_match(character_name)
            if character_ids:
                items_with_character = await Item.find({"item_character": {"$in": character_ids}}).to_list()
                query_conditions.append({"_id": {"$in": [ObjectId(item.id) for item in items_with_character]}})
        if item_name:
            query_conditions.append({"item_name":  {"$regex": item_name, "$options": "i"}})
        if category_id:
            query_conditions.append({"category": ObjectId(category_id)})                
        if tags_list:
            # ユーザーが1つだけタグを入力した場合
            if len(tags_list) == 1:
                # 入力値で部分一致検索
                tag = tags_list[0].strip()
                query_conditions.append({"tags": {"$regex": tag, "$options": "i"}})
            else:
                # 2つ以上のタグが入力された場合
                # 各タグ単位では部分一致
                regex_conditions = [{"tags": {"$regex": tag.strip(), "$options": "i"}} for tag in tags_list]        
                # すべてのタグが部分一致する場合のみをマッチ
                query_conditions.append({"$and": regex_conditions})
        if jan_code:
            query_conditions.append({"jan_code": jan_code})
        if release_date:
            parsed_release_date = await parse_release_date(release_date)
            query_conditions.append({ 
                "$or": [
                    {"release_date": {"$lte": parsed_release_date}},  # 指定された日付以前
                    {"release_date": None}  # 空白も検索結果に含める
                ]
            })
        if retailers:
            # query_conditions.append({"retailers":  {"$elemMatch": {"$regex": retailers, "$options": "i"}}})
            regex_conditions_retailers = [{"retailers": {"$regex": retailer.strip(), "$options": "i"}} for retailer in retailers_list]
            query_conditions.append({"$or": regex_conditions_retailers})
        if not query_conditions:
            return {
                "message": "No items found matching the queries."
            } 
        # 条件をANDで結合
        query = {"$and": query_conditions}    
        # 条件にマッチするアイテム取得
        matched_items = await Item.find(query).to_list()
  
        if not matched_items:
            return{
                "message": "No items found matching the queries."
            } 
        
        sorted_items =  sorted(matched_items, key=lambda x: x.id.generation_time, reverse=True)
        # ページネーション
        items_per_page = 10
   
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
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unexpected error when fetching the filtered_items: {str(e)}")  # 詳細なエラーをログに出力
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occured while fetching the filtered_items"
        )
