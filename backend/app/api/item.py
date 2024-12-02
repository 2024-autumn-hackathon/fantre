# backend/app/api/item.py
from typing import List, Optional
from app.models import CustomCategoryName, CustomCharacterName, CustomItem, CustomSeriesName, Item, UserSpecificData
from app.api.user import get_current_user
from app.database.db_item import create_item, existing_item_check, exists_item_id, get_item, get_all_items
from app.database.db_content_catalog import character_name_partial_match, create_new_category, get_category_name, get_character_name, get_series_name, series_name_partial_match
from app.database.db_user_specific import create_custom_item, create_user_specific_data, get_user_specific_data
from pydantic import BaseModel, field_validator, ValidationError, Field, validator
from datetime import date, timedelta
from bson import ObjectId
from fastapi import APIRouter, HTTPException, status, Query, Depends
from beanie import Indexed
import re, calendar
from datetime import datetime

router = APIRouter(dependencies=[Depends(get_current_user)])

class ItemRequest(BaseModel):    
    item_name: str = None
    item_series: str = None # series_id
    item_character: str = None # character_id
    category: str = None # category_id
    tags: Optional[List[str]] = Field(default_factory=list)
    jan_code: Optional[str] = Field(None, description="JAN code (8 or 13 degits)") 
    release_date: Optional[str] = Field(None, description="Release date YYYY-MM-DD)") 
    retailers: Optional[List[str]] = Field(default_factory=list)
        
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
async def create_item_endpoint(item_request: ItemRequest, user_id: str = Depends(get_current_user)):
    user_id=ObjectId(user_id)

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
        if not item_request.item_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Item name must be provided."
            )
        if not item_request.category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category must be provided."
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
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"errors": e.errors()}
        )
    except HTTPException as e:
        raise e
    except Exception as e:
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
async def get_item_details(item_id: str, user_id: str = Depends(get_current_user)):
    user_id=ObjectId(user_id)
    try:
        item = await get_item(ObjectId(item_id))
        user_specific_data = await UserSpecificData.find_one({"user_id": user_id})

        # item_idが一致するcustom_itemを持っているかチェック
        custom_item = None
        if user_specific_data:
            custom_item = next((ci for ci in user_specific_data.custom_items if ci.item_id == ObjectId(item_id)), None)

        # 独自名を取得
        custom_series_name = await get_custom_series_name(user_specific_data, item.item_series) if user_specific_data else None
        if not custom_series_name and item.item_series:
            custom_series_name = await get_series_name(item.item_series)

        custom_character_name = await get_custom_character_name(user_specific_data, item.item_character) if user_specific_data else None
        if not custom_character_name and item.item_character:
            custom_character_name = await get_character_name(item.item_character)

        custom_category_name = await get_custom_category_name(user_specific_data, item.category) if user_specific_data else None
        if not custom_category_name and item.category:
            custom_category_name = await get_category_name(item.category)

        if custom_item:
            response = {
                "item_name": custom_item.custom_item_name,
                "series_name": custom_series_name,
                "character_name": custom_character_name,
                "category_name": custom_category_name,
                "tags": custom_item.custom_item_tags,
                "jan_code": item.jan_code,
                "release_date": item.release_date,
                "retailers": custom_item.custom_item_retailers,
                "own_status": custom_item.own_status
            }
        else:
            # 共有の名前を取得
            series_name = await get_series_name(ObjectId(item.item_series)) if item.item_series else None
            character_name = await get_character_name(ObjectId(item.item_character)) if item.item_character else None
            category_name = await get_category_name(ObjectId(item.category)) if item.category else None
            
            response = {
                "item_name": item.item_name,
                "series_name": custom_series_name if custom_series_name else series_name,
                "character_name": custom_character_name if custom_character_name else character_name,
                "category_name": custom_category_name if custom_category_name else category_name,
                "tags": item.tags,
                "jan_code": item.jan_code,
                "release_date": item.release_date,
                "retailers": item.retailers,
                 "own_status": None
            }
        return response
    
    except ValidationError as e:
        print(f"Validation error: {e.errors()}") 
        raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail={"errors": e.errors()}
        )
    except HTTPException as e:
        print(f"HTTP Exception: {str(e.detail)}")
        raise e
    except Exception as e:
        print(f"Unexpected error when fetching the item details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occured while fetching the item details"
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
    user_id: str = Depends(get_current_user)
):	
    user_id=ObjectId(user_id)    
    user_specific_data = await get_user_specific_data(user_id)

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
            print("series_ids", series_ids)
            original_series_item_ids = []
            custom_series_item_ids = []
            
            # 返ってきたseries_idを含んでいるitemを取得
            if series_ids:
                matching_items = await Item.find({"item_series": {"$in": series_ids}}).to_list()
                original_series_item_ids = [item.id for item in matching_items]

            # 既存のuser_specific_dataから独自データのマッチングも行う
            if user_specific_data and user_specific_data.custom_series_names:

                matching_custom_series = [
                    cs for cs in user_specific_data.custom_series_names
                    if series_name.lower() in cs.custom_series_name.lower()
                ]

                # 見つかった独自シリーズから series_id を収集
                matching_series_ids = [cs.series_id for cs in matching_custom_series]
                
                # そのseries_idを持つ独自アイテムを検索
                if matching_series_ids:
                    matching_custom_items = [
                        ci for ci in user_specific_data.custom_items
                        if ci.custom_item_series_name in [cs.id for cs in matching_custom_series]
                    ]

                    # その独自アイテムの中のitem_idを収集
                    custom_series_item_ids = [ci.item_id for ci in matching_custom_items]                                   

            all_item_ids = set(original_series_item_ids + custom_series_item_ids)

            if not all_item_ids:
                return {"message": "No items found matching the queries."}

            query_conditions.append({"_id": {"$in": list(all_item_ids)}})


        if character_name:
            character_ids = await character_name_partial_match(character_name)
            print("character_ids", character_ids)  # デバッグ: character_ids の内容を確認
            original_character_item_ids = []
            custom_character_item_ids = []

            if character_ids:
                matching_items = await Item.find({"item_character": {"$in": character_ids}}).to_list()
                print("matching_items", matching_items)  # デバッグ: Item.find() の結果を確認
                original_character_item_ids = [item.id for item in matching_items]
                print("original_character_item_ids",original_character_item_ids)

            # 既存のuser_specific_dataから独自データのマッチングも行う
            if user_specific_data and user_specific_data.custom_character_names:

                matching_custom_character = [
                    cha for cha in user_specific_data.custom_character_names
                    if character_name.lower() in cha.custom_character_name.lower()
                ]
                print("matching_custom_character",matching_custom_character)

                # 見つかった独自シリーズから series_id を収集
                matching_character_ids = [cha.character_id for cha in matching_custom_character]
                print("matching_character_ids",matching_character_ids)

                # そのcharacter_idを持つ独自アイテムを検索
                if matching_character_ids:
                    matching_character_items = [
                        ci for ci in user_specific_data.custom_items
                        if ci.custom_item_character_name in [cha.id for cha in matching_custom_character]
                    ]
                    print("matching_character_items",matching_character_items)

                    # その独自アイテムの中のitem_idを収集
                    custom_character_item_ids = [ci.item_id for ci in matching_character_items]  
                    print("custom_character_item_ids",custom_character_item_ids)   

            # 結果を統合
            all_item_ids = set(original_character_item_ids + custom_character_item_ids)

            if not all_item_ids:
                return {"message": "No items found matching the queries."}

            query_conditions.append({"_id": {"$in": list(all_item_ids)}})
                

        if item_name:

            original_item_ids = []
            custom_item_ids = []

            # item_nameが部分一致するものを探す
            matching_items = await Item.find({"item_name": {"$regex": item_name, "$options": "i"}}).to_list()
            
            # 一致したもののitem_idを取得
            original_item_ids = [item.id for item in matching_items]

            # 既存のuser_specific_dataから独自データのマッチングも行う
            if user_specific_data is not None:       
                # custom_itemsの中に一致するものを探す
                matching_custom_items = [
                    ci for ci in user_specific_data.custom_items
                    if item_name.lower() in ci.custom_item_name.lower()
                ]
                # 部分マッチしたitem_nameを持つアイテムのitem_idを取得
                custom_item_ids = [ci.item_id for ci in matching_custom_items]
                
            # 両方の結果を条件に追加
            all_item_ids = set(original_item_ids + custom_item_ids)

            if not all_item_ids:
                return {"message": "No items found matching the queries."}

            query_conditions.append({"_id": {"$in": list(all_item_ids)}})                

        if category_id:
            category_id = ObjectId(category_id)
            
            # 元のアイテムに指定された category_id があるか検索
            original_category_item_ids = []
            matching_items = await Item.find({"category": category_id}).to_list()
             
            if matching_items:
                original_category_item_ids = [item.id for item in matching_items]
                
            # CustomCategoryName内からcategory_idに一致する_idを収集
            matching_custom_category_ids = []

            if user_specific_data and user_specific_data.custom_category_names:
                matching_custom_category_ids = [
                    custom_category.id for custom_category in user_specific_data.custom_category_names
                    if custom_category.category_id == category_id
                ]
            else:
                matching_custom_category_ids = []                

                # カスタムアイテム内でcustom_item_category_name が一致するアイテムIDを収集
            custom_category_item_ids = []
            if user_specific_data and user_specific_data.custom_category_names:
                custom_category_item_ids = [
                custom_item.item_id for custom_item in user_specific_data.custom_items
                if custom_item.custom_item_category_name in matching_custom_category_ids
            ]                      
               
            all_item_ids = set(original_category_item_ids + custom_category_item_ids)

            if not all_item_ids:
                return {"message": "No items found matching the queries."}

            query_conditions.append({"_id": {"$in": list(all_item_ids)}})
                
        if tags_list:
            original_tag_conditions = []

            # ユーザーが1つだけタグを入力した場合
            if len(tags_list) == 1:
                # 入力値で部分一致検索
                tag = tags_list[0].strip()
                original_tag_conditions.append({"tags": {"$regex": tag, "$options": "i"}})
                # アイテムID取得
                matching_items = await Item.find({"tags": {"$regex": tag, "$options": "i"}}).to_list()
                original_item_ids = [item.id for item in matching_items]
            else:
                # 2つ以上のタグが入力された場合
                # 各タグ単位では部分一致
                regex_conditions = [{"tags": {"$regex": tag.strip(), "$options": "i"}} for tag in tags_list] 
                # すべてのタグが部分一致する場合のみをマッチ
                original_tag_conditions.append({"$and": regex_conditions})
                # アイテムID取得
                matching_items = await Item.find({"$and": regex_conditions}).to_list()
                original_item_ids = [item.id for item in matching_items]

            # 既存のuser_specific_dataから独自データのマッチングも行う            
            custom_item_ids = []

            if user_specific_data is not None:
                if len(tags_list) == 1:
                    tag = tags_list[0].strip()
                    # custom_items内のタグに一致するものを探す
                    for custom_item in user_specific_data.custom_items:
                        if any(tag.lower() in custom_tag.lower() for custom_tag in custom_item.custom_item_tags):
                            custom_item_ids.append(custom_item.item_id)
                else:
                    regex_conditions = [{"custom_item_tags": {"$regex": tag.strip(), "$options": "i"}} for tag in tags_list]
                    matching_custom_items = [
                        ci.item_id for ci in user_specific_data.custom_items
                        if all(any(tag.lower() in custom_tag.lower() for custom_tag in ci.custom_item_tags) for tag in tags_list)
                    ]
                    custom_item_ids.extend(matching_custom_items)

            all_item_ids = set(original_item_ids + custom_item_ids)
            if not all_item_ids:
                return {"message": "No items found matching the queries."}

            query_conditions.append({"_id": {"$in": list(all_item_ids)}})

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
            retailers_list = [
                retailer.strip() for retailer in retailers_list if isinstance(retailer, str)
            ]
            
            regex_conditions_retailers = [{"retailers": {"$regex": retailer.strip(), "$options": "i"}} for retailer in retailers_list]
                   
            # アイテムIDのリストを取得
            original_item_ids = await Item.find({"$or": regex_conditions_retailers}).to_list()
            original_item_ids_list = [item.id  for item in original_item_ids]
                
            # カスタムアイテムの検索
            custom_item_ids = []

            if user_specific_data and user_specific_data.custom_items:
                for custom_item in user_specific_data.custom_items:
                    # カスタムリテイラーが存在し、検索条件に一致するかチェック
                    if custom_item.custom_item_retailers:
                        matching_retailers = [
                            retailer_value
                            for retailer_value in custom_item.custom_item_retailers
                            if any(re.search(retailer, retailer_value, re.IGNORECASE) for retailer in retailers_list)
                        ]
                        if matching_retailers and custom_item.item_id:
                            custom_item_ids.append(custom_item.item_id)

            # 結果を統合
            all_item_ids = set(original_item_ids_list + custom_item_ids)

            if not all_item_ids:
                return {"message": "No items found matching the queries."}

            query_conditions.append({"_id": {"$in": list(all_item_ids)}})

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

        try:
            response = {        
                    "items": [
                    {
                        "id": str(sorted_item.id),
                        "item_name": next(
                            (
                                ci.custom_item_name
                                for ci in (user_specific_data.custom_items if user_specific_data and user_specific_data.custom_items else [])
                                if ci.item_id == sorted_item.id
                            ),
                            sorted_item.item_name  # カスタムアイテムがない場合は元の名前を使用
                        ),
                    }
                    for sorted_item in pagenated_items

                    ],
                    "all_pages": all_pages,
                    }  
        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            print(f"Error trace during response generation: {error_trace}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred during response generation: {str(e)}"
            )
     
        print(f"Response: {response}")

        return response

    except ValidationError as e:
        raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail={"errors": e.errors()}
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occured while fetching the filtered_items"
        )

     
# グッズ情報編集
class CustomItemUpdate(BaseModel):
    custom_item_name: Optional[str] = None
    custom_series_name: Optional[str] = None
    custom_character_name: Optional[str] = None
    custom_category_name: Optional[str] = None
    custom_item_tags: Optional[List[str]] = None  
    custom_item_retailers: Optional[List[str]] = None
    
    @validator('custom_item_name', 'custom_series_name', 'custom_character_name', 'custom_category_name' , pre=True)
    def check_not_empty_or_whitespace(cls, value):
        if not isinstance(value, str):
            raise ValueError("Input must be a string.")
        if value is None or value.strip() == "": 
            raise ValueError("Field cannot be empty or just whitespace.")
        return value

@router.patch("/api/items/{item_id}")
async def update_custom_item(
    item_id: str, 
    updated_data: CustomItemUpdate,
    user_id: str = Depends(get_current_user)
    ):
    user_id = ObjectId(user_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid user ID")
    
    try:
        # item_idを使ってアイテムを取得
        item = await Item.find_one({"_id": ObjectId(item_id)})
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        
        # ユーザーの独自データを取得
        user_specific_data = await get_user_specific_data(user_id)
        # 独自データがない場合新規作成
        if not user_specific_data:
            user_specific_data = UserSpecificData(
                user_id=user_id,
                custom_items=[],
                custom_category_names=[],
                custom_series_names=[],
                custom_character_names=[]
            )
            user_specific_data = await create_user_specific_data(user_id, user_specific_data)

        # ユーザーの custom_series_names 内に 該当するseries_id が存在するか確認
        existing_series_names = next((s for s in user_specific_data.custom_series_names if s.series_id == item.item_series), None)

        new_series = None
        if existing_series_names is None:
            # series_idからseries_nameを取得する
            series_id = item.item_series
            series_name = await get_series_name(series_id)
            # custom_series_names に追加する
            new_series = CustomSeriesName(
                    _id=ObjectId(),
                    series_id=series_id, 
                    custom_series_name=series_name
                )
            user_specific_data.custom_series_names.append(new_series)

        custom_item_series_name = new_series.id if new_series else existing_series_names.id

        # ユーザーがシリーズ名を入力しているならデータ更新
        if updated_data.custom_series_name:
            # 再確認
            existing_series_names = next((s for s in user_specific_data.custom_series_names if s.series_id == item.item_series), None)
            # 名前更新
            if existing_series_names:
                existing_series_names.custom_series_name = updated_data.custom_series_name
        
        # ユーザーの custom_character_names 内に 該当するcharacter_id が存在するか確認
        existing_character_names = next((c for c in user_specific_data.custom_character_names if c.character_id == item.item_character), None)

        new_character = None
        if not existing_character_names:
            # character_idからcharacter_nameを取得する
            character_id = item.item_character
            character_name = await get_character_name(character_id)
            # custom_series_names に追加する
            new_character = CustomCharacterName(
                    _id=ObjectId(),
                    character_id=character_id, 
                    custom_character_name=character_name
                )
            user_specific_data.custom_character_names.append(new_character)

        custom_item_character_name = new_character.id if new_character else existing_character_names.id

        # ユーザーがキャラクター名を入力しているならデータ更新
        if updated_data.custom_character_name:
            # 再確認
            existing_character_names = next((c for c in user_specific_data.custom_character_names if c.character_id == item.item_character), None)
            # 名前更新
            existing_character_names.custom_character_name = updated_data.custom_character_name 
            
        # ユーザーの custom_category_names 内に 該当する category_id が存在するか確認
        existing_category_names = next(
            (cat for cat in user_specific_data.custom_category_names if cat.category_id == item.category),
            None
        )

        new_category = None
        if existing_category_names is None:
            # category_idからcategory_nameを取得する
            category_id = item.category
            category_name = await get_category_name(category_id)

            # custom_category_names に追加する
            new_category = CustomCategoryName(
                    _id=ObjectId(),
                    category_id=category_id, 
                    custom_category_name=category_name
                )
            user_specific_data.custom_category_names.append(new_category)
        
        custom_item_category_name = new_category.id if new_category else existing_category_names.id
        if not custom_item_category_name:
            raise HTTPException(
                status_code=400,
                detail="Invalid custom item category name."
            )

        # ユーザーがカテゴリー名を入力しているならデータ更新
        if updated_data.custom_category_name:
            print(f"Updated custom category name: {updated_data.custom_category_name}")

            # 再確認
            existing_category_names = next((cat for cat in user_specific_data.custom_category_names if cat.category_id == item.category), None)
            # 名前更新
            existing_category_names.custom_category_name = updated_data.custom_category_name

        # カスタムアイテムがあるか確認
        custom_item = next((ci for ci in user_specific_data.custom_items if ci.item_id == ObjectId(item_id)), None)
                
        # カスタムアイテムの更新
        if custom_item:
            if updated_data.custom_item_name is not None:
                custom_item.custom_item_name = updated_data.custom_item_name
            if updated_data.custom_item_tags is not None:
                custom_item.custom_item_tags = updated_data.custom_item_tags
            if updated_data.custom_item_retailers is not None:
                custom_item.custom_item_retailers = updated_data.custom_item_retailers

        # カスタムアイテム新規作成
        else:
            custom_item = CustomItem(
                _id=ObjectId(),
                item_id=ObjectId(item_id),
                custom_item_images=item.item_images,
                custom_item_name=updated_data.custom_item_name if updated_data.custom_item_name is not None else item.item_name,
                custom_item_series_name=custom_item_series_name, 
                custom_item_character_name=custom_item_character_name, 
                custom_item_category_name=custom_item_category_name,       
                custom_item_tags = updated_data.custom_item_tags if updated_data.custom_item_tags is not None else item.tags or [],
                custom_item_retailers = updated_data.custom_item_retailers if updated_data.custom_item_retailers is not None else item.retailers or [],
                own_status=None         
            )            

            custom_item = await create_custom_item(user_specific_data, custom_item)
            await user_specific_data.save()
            if not custom_item:
                raise HTTPException(status_code=500, detail="Failed to create custom item") 
           
        await user_specific_data.save()
        return custom_item

    except ValidationError as e:
        raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail={"errors": e.errors()}
        )
    except HTTPException as e:
        raise e
    except Exception as e:  
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating the custom item details: {str(e)}"
        )


# 欲しい/譲れるフラグ変更
@router.patch("/api/items/{item_id}/exchange-status")
async def change_exchange_status(item_id: str, exchange_status: bool, user_id: str = Depends(get_current_user)):
    user_id=ObjectId(user_id)
    
    try:
        if await exists_item_id(ObjectId(item_id)):
            raise HTTPException(status_code=404, detail=f"Item with id {item_id} not found")
        # 独自データがあるか？
        user_specific_data = await get_user_specific_data(user_id)
        # なければ作成
        if not user_specific_data:
            user_specific_data = UserSpecificData(
                user_id=user_id,
                custom_items=[],
                custom_category_names=[],
                custom_series_names=[],
                custom_character_names=[]
            )
            user_specific_data = await create_user_specific_data(user_id, user_specific_data)

        # 該当item_idのカスタムアイテムがあるか？
        custom_item = next((item for item in user_specific_data.custom_items if str(item.item_id) == item_id), None)
        # なければ作成
        if not custom_item:
            # item情報を取得
            item = await Item.find_one({"_id": ObjectId(item_id)})

            # 情報を元にカスタムアイテム作成
            custom_item = CustomItem(
                _id=ObjectId(),
                item_id=ObjectId(item_id),
                custom_item_images=[],
                custom_item_name=item.item_name,
                custom_item_series_name=item.item_series, 
                custom_item_character_name=item.item_character, 
                custom_item_category_name=item.category,       
                custom_item_tags = item.tags,
                custom_item_retailers = item.retailers,
                custom_item_notes = None,
                exchange_status = exchange_status,
                own_status = None       
            )
            custom_item = await create_custom_item(user_specific_data, custom_item)


        # 欲しい/譲れるフラグ変更
        if status is not None:
            custom_item.exchange_status = exchange_status

        await user_specific_data.save()
        return {"message": "Exchange status updated successfully", "exchange_status": custom_item.exchange_status}
    
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occured while updating the exchange_status"
        )
 

# 所持/未所持フラグ変更
@router.patch("/api/items/{item_id}/own-status")
async def change_own_status(item_id: str, own_status: bool, user_id: str = Depends(get_current_user)):
    user_id=ObjectId(user_id)
    
    try:
        if await exists_item_id(ObjectId(item_id)):
            raise HTTPException(status_code=404, detail=f"Item with id {item_id} not found")
        # 独自データがあるか？
        user_specific_data = await get_user_specific_data(user_id)
        # なければ作成
        if not user_specific_data:
            user_specific_data = UserSpecificData(
                user_id=user_id,
                custom_items=[]
            )
            user_specific_data = await create_user_specific_data(user_id, user_specific_data)

        # 該当item_idのカスタムアイテムがあるか？
        custom_item = next((item for item in user_specific_data.custom_items if str(item.item_id) == item_id), None)
        # なければ作成
        if not custom_item:
            # item情報を取得
            item = await Item.find_one({"_id": ObjectId(item_id)})

            # 情報を元にカスタムアイテム作成
            custom_item = CustomItem(
                _id=ObjectId(),
                item_id=ObjectId(item_id),
                custom_item_images=[],
                custom_item_name=item.item_name,
                custom_item_series_name=item.item_series, 
                custom_item_character_name=item.item_character, 
                custom_item_category_name=item.category,       
                custom_item_tags = item.tags,
                custom_item_retailers = item.retailers,
                custom_item_notes = None,
                exchange_status = None,
                own_status = own_status       
            )
            custom_item = await create_custom_item(user_specific_data, custom_item)

        # 所持/未所持フラグ変更
        if status is not None:
            custom_item.own_status = own_status

        await user_specific_data.save()
        return {"message": "Own status updated successfully", "own_status": custom_item.own_status}
    
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occured while updating the own_status"
        )