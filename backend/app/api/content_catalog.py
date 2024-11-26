# backend/app/api/content_catalog.py
from typing import Optional
from app.api.user import get_current_user
from app.database.db_content_catalog import create_character, create_series, create_series_character, get_all_categories, get_all_characters, get_all_series, create_category, get_series_characters
from app.database.db_user_specific import get_user_specific_data
from pydantic import BaseModel, field_validator,  model_validator
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status


router = APIRouter(dependencies=[Depends(get_current_user)])

# グッズジャンル（カテゴリー）登録
@router.post("/api/categories")
async def create_category_endpoint(category_name: str, user_id: str = Depends(get_current_user)):
    user_id=ObjectId(user_id)

    try:  
        # category_nameが空白でないことを確認
        if not category_name or len(category_name.strip()) == 0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Category name is required."
            )                                    
        new_category = await create_category(category_name)

        
        return {
            "category_id": str(new_category.id),
            "category_name": str(new_category.category_name)
        }    
    except HTTPException as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.detail
            )           
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred whil creating the category."
        )

# グッズジャンル（カテゴリー）一覧取得
@router.get("/api/category")
async def get_all_categories_endpoint(user_id: str = Depends(get_current_user)):
    user_id=ObjectId(user_id)
    
    try:
        categories = await get_all_categories()

        # 独自データを取得
        user_specific_data = await get_user_specific_data(user_id)
        custom_category_names = {}
        if user_specific_data and user_specific_data.custom_category_names:
            # 辞書形式に変換
            custom_category_names = {
                str(custom_category.category_id): custom_category.custom_category_name
                for custom_category in user_specific_data.custom_category_names
            }

        # 新しい順に並べ替え
        sorted_categories = sorted(categories, key=lambda x: x.id.generation_time, reverse=True)

        # リスト形式を辞書形式に変換する独自データがあればそちらの名前を設定
        category_dict = {
            str(category.id): custom_category_names.get(str(category.id), category.category_name)
            for category in sorted_categories
            }

        return category_dict
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching categories: {str(e)}"
        )


# 作品・キャラクター登録
class SeriesCharacterRequest(BaseModel):
    series_id: Optional[str] = None
    series_name: Optional[str] = None
    is_new_series: bool = False
    character_id: Optional[str] = None
    character_name: Optional[str] = None
    is_new_character: bool = False

    # カスタムバリデーションで文字列をObjectIdに変換      
    @field_validator("series_id", "character_id")
    def validate_object_id(cls, v):
        if v is None:
            return v
        if not ObjectId.is_valid(v):
            raise ValueError(f"Invalid ObjectId format for {v}")
        return ObjectId(v)  
    # is_new_series, is_new_characterに基づく必須条件バリデーション
    @model_validator(mode="before")
    def validate_series_character_fields(cls, values):    
        try:
            #series trueの時は_name必須、_id不要　falseの時は反対
            if values.get("is_new_series"):
                if not values.get("series_name"):
                    raise ValueError("series_name is required when is_new_series is True.")
                if values.get("series_id"):
                    raise ValueError("series_id should not be provided when is_new_series is True")
            else:
                if not values.get("series_id"):
                    raise ValueError("series_id is required when is_new_series is False.")
                if values.get("series_name"):
                    raise ValueError("series_name should not be provided when is_new_series is False.")
            #character trueの時は_name必須、_id不要　falseの時は反対
            if values.get("is_new_character"):
                if not values.get("character_name"):
                    raise ValueError("character_name is required when is_new_character is True.")
                if values.get("character_id"):
                    raise ValueError("character_id should not be provided when is_new_character is True")
            else:
                if not values.get("character_id"):
                    raise ValueError("character_id is required when is_new_character is False.")
                if values.get("character_name"):
                    raise ValueError("character_name should not be provided when is_new_character is False.")
                
            return values
        
        except ValueError as e:
            print(f"Validation error: {e}")
            raise e
            
@router.post("/api/series-characters")
async def create_series_character_endpoint(series_character_request: SeriesCharacterRequest, user_id: str = Depends(get_current_user)):
    user_id=ObjectId(user_id)
    
    try:
        series_id = series_character_request.series_id
        character_id = series_character_request.character_id
        # フラグがTrueの時だけ作品登録処理
        if series_character_request.is_new_series:
            new_series = await create_series(series_character_request.series_name)
            series_id_for_use = new_series.id
        else:
            series_id_for_use = series_id
        # フラグがTrueの時だけキャラクター登録処理
        if series_character_request.is_new_character:
            new_character = await create_character(series_character_request.character_name)
            character_id_for_use = new_character.id
        else:
            character_id_for_use = character_id

        result =await create_series_character(series_id_for_use, character_id_for_use)

        if isinstance(result, dict) and "message" in result:
            return {
                "message": result["message"],
                "series_id": result["series_id"],
                "character_id": result["character_id"]
            }
        
        return {
            "series_id": str(series_id_for_use),
            "character_id": str(character_id_for_use)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    
# 作品名一覧取得(検索用)   
@router.get("/api/series")
async def get_all_series_endpoint(user_id: str = Depends(get_current_user)):
    user_id=ObjectId(user_id)
    
    try:
        series = await get_all_series()

        # 独自データを取得
        user_specific_data = await get_user_specific_data(user_id)
        custom_series_names = {}
        if user_specific_data and user_specific_data.custom_series_names:
            # 辞書形式に変換
            custom_series_names = {
                str(custom_series.series_id): custom_series.custom_series_name
                for custom_series in user_specific_data.custom_series_names
            }
            print("custom_series_names", custom_series_names)

        # 新しい順に並べ替え
        sorted_series = sorted(series, key=lambda x: x.id.generation_time, reverse=True)

        # リスト形式を辞書形式に変換する独自データがあればそちらの名前を設定
        series_dict = {
            str(series.id): custom_series_names.get(str(series.id), series.series_name) 
            for series in sorted_series
            }
        
        return series_dict
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching series: {str(e)}"
        )

# 作品名一覧取得(一覧ページ用)
@router.get("/api/series/page/{current_page}")	
async def get_all_series_with_pagenation(current_page: int, user_id: str = Depends(get_current_user)):
    user_id=ObjectId(user_id)
    
    try:
        series = await get_all_series()

        # 独自データを取得
        user_specific_data = await get_user_specific_data(user_id)
        custom_series_names = {}
        if user_specific_data and user_specific_data.custom_series_names:
            # 辞書形式に変換
            custom_series_names = {
                str(custom_series.series_id): custom_series.custom_series_name
                for custom_series in user_specific_data.custom_series_names
            }
            print("custom_series_names", custom_series_names)

        # ページごとのアイテム数
        series_per_page = 2
        # 新しい順に並べ替え
        sorted_series = sorted(series, key=lambda x: x.id.generation_time, reverse=True)
        # 現在ページが1以下の場合、1ページ目を表示
        if current_page < 1:
            current_page = 1        
        # ページに分けるためにsiriesリストをスライス
        start_index = (current_page - 1) * series_per_page
        end_index = start_index + series_per_page
        pagenated_series = sorted_series[start_index:end_index]
        # 何ページできるか計算
        total_series_count = len(series)
        all_pages = (total_series_count + series_per_page - 1) // series_per_page # 切り上げ
        # レスポンスをリストから辞書形式に変換、整形独自名優先
        series_response = {
            "series": [
                {"id": str(series.id), 
                 "series_name": custom_series_names.get(str(series.id), series.series_name)
                 }
                for series in pagenated_series
            ],
            "all_pages": all_pages
        }
        return series_response
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching series with pagination: {str(e)}"
        )


# 作品名で絞ったキャラ一覧取得(検索用)
@router.get("/api/series/{series_id}/characters")
async def get_filtered_characters(series_id: str, user_id: str = Depends(get_current_user)):
    user_id=ObjectId(user_id)
    
    try:
        # DBから指定したシリーズIDのシリーズキャラクターを取得
        series_characters = await get_series_characters(series_id)

        if not series_characters:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Characters not found for this series"
            )

        # キャラクターIDをリスト化
        character_ids = [character.character_id for character in series_characters]
        # キャラクター詳細情報（キャラクター名）を取得
        characters = await get_all_characters()

        # 独自データを取得
        user_specific_data = await get_user_specific_data(user_id)
        custom_character_names = {}
        if user_specific_data and user_specific_data.custom_character_names:
            custom_character_names = {
                str(custom_character.character_id): custom_character.custom_character_name
                for custom_character in user_specific_data.custom_character_names
            }

        # キャラクター詳細情報をキャラクターIDでフィルタリングして独自名を追加
        filtered_characters = [
            {
                "id": str(character.id),
                "name": custom_character_names.get(str(character.id), character.character_name),
                "original_name": character.character_name
            }
            for character in characters
            if character.id in character_ids
        ]

        # 五十音順にソート
        sorted_characters = sorted(filtered_characters, key=lambda x: x["name"])
        # 辞書形式に変換
        characters_dict = {
            character["id"]: character["name"]
            for character in sorted_characters
        }
        return characters_dict

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching sorted characters by series_id: {str(e)}"
        )
    

# 作品名で絞ったキャラ一覧取得(一覧ページ用)
@router.get("/api/series/{series_id}/characters/page/{current_page}")
async def get_filterd_characters_with_pagenation(series_id: str, current_page: int, user_id: str = Depends(get_current_user)):
    user_id=ObjectId(user_id)
    
    try:
        # 既存の関数を利用
        characters_dict = await get_filtered_characters(series_id, user_id)
        print(characters_dict)
        # リストに変換
        characters_list = list(characters_dict.items())
        # 新しい順にソート
        sorted_characters_list = sorted(characters_list, key=lambda x: ObjectId(x[0]).generation_time, reverse=True)
        print("sorted_characters_list", sorted_characters_list)

        characters_per_page = 10
        # 現在ページが1以下の場合、1ページ目を表示
        if current_page < 1:
            current_page = 1        
        # ページに分けるためにsorted_characters_listをスライス
        start_index = (current_page - 1) * characters_per_page
        end_index = start_index + characters_per_page
        pagenated_characters = sorted_characters_list[start_index:end_index]
        # 何ページできるか計算
        total_characters_count = len(sorted_characters_list)
        all_pages = (total_characters_count + characters_per_page - 1) // characters_per_page # 切り上げ

        # レスポンスを整形
        characters_response = {
                "characters": [
                    {"id": str(character[0]), "character_name": character[1]}
                    for character in pagenated_characters
                ],
                "all_pages": all_pages
            }
        return characters_response

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching sorted characters by series_id: {str(e)}"
        )
