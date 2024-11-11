# backend/app/api/content_catalog.py
from typing import List, Optional
from app.models import Category, Character, Series, SeriesCharacter
from app.database.db_content_catalog import get_categories, get_content_catalog, get_series,  save_content_catalog, search_series_character
from pydantic import BaseModel, field_validator, ValidationError, model_validator
from bson import ObjectId
from fastapi import APIRouter, HTTPException, status
# from beanie import Indexed
# import re

router = APIRouter()

class CategoryRequeset(BaseModel):
    category_name: str

# グッズジャンル（カテゴリー）登録
@router.post("/api/categories")
async def create_category_endpoint(category_request: CategoryRequeset):
    try:
        category_data = category_request.model_dump()
        # ContentCatalogを取得
        content_catalog = await get_content_catalog() 
        # 既存のcategory_nameと重複を確認
        for existing_category in content_catalog.categories:
            if existing_category.category_name == category_data["category_name"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Category with the same name already exists."
                )
                        
        # 新しいカテゴリを追加
        new_category = Category(_id=ObjectId(), **category_data)
        content_catalog.categories.append(new_category)
        await save_content_catalog(content_catalog)
        return {
            "category_id": str(new_category.id),
            "category_name": str(new_category.category_name)
        }
        
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

# グッズジャンル（カテゴリー）一覧取得
@router.get("/api/category")
async def get_all_categories_endpoint():
    try:
        categories = await get_categories()
        print(categories)
        # リスト形式を辞書形式に変換する （id:name形式）
        category_dict = {str(category.id): category.category_name for category in categories}
        return category_dict
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching categories: {str(e)}"
        )


# 作品を追加
async def add_series(series_name: str):
    try:
        # ContentCatalogを取得
        content_catalog = await get_content_catalog()
        # 既存のseries_nameと重複を確認
        for existing_series in content_catalog.series:
            if existing_series.series_name == series_name:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Series with the same name already exists."
                )            
        # 新しい作品を追加
        new_series = Series(_id=ObjectId(), series_name=series_name)
        content_catalog.series.append(new_series)
        await save_content_catalog(content_catalog)
        return new_series
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    
# キャラクターを追加
async def add_character(character_name: str):
    try:
        # ContentCatalogを取得
        content_catalog = await get_content_catalog()
        # 既存のseries_nameと重複を確認
        for existing_character in content_catalog.characters:
            if existing_character.character_name == character_name:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Character with the same name already exists."
                )
            
        # 新しいキャラクターを追加
        new_character = Character(_id=ObjectId(), character_name=character_name)
        content_catalog.characters.append(new_character)
        await save_content_catalog(content_catalog)
        return new_character
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# 作品キャラクターを追加
async def add_series_character(series_id: ObjectId, character_id: ObjectId):
    try:        # ContentCatalogを取得
        content_catalog = await get_content_catalog()
        print("Current series_characters:", content_catalog.series_characters)  # デバッグ用
        # 同じ作品とキャラクターのペアがすでに存在するか確認
        for pair in content_catalog.series_characters:
            if pair.series_id == series_id and pair.character_id == character_id:
                # 既存のペアがあればスキップ
                return{"Series and character pair already exists."}            
        # 新しいペアを作成
        new_pair = SeriesCharacter(series_id=series_id, character_id=character_id)
        content_catalog.series_characters.append(new_pair)
        await save_content_catalog(content_catalog)
        return new_pair
    
    except Exception as e:
        print(f"Error in add_series_character: {str(e)}")  # 詳細なエラーを出力
        raise Exception(f"Error adding series_character pair: {str(e)}")


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
async def create_series_character_endpoint(series_character_request: SeriesCharacterRequest):
    try:
        series_id = series_character_request.series_id
        character_id = series_character_request.character_id
        content_catalog = await get_content_catalog()
        # フラグがTrueの時だけ作品登録処理
        if series_character_request.is_new_series:
            new_series = await add_series(series_character_request.series_name)
            series_id_for_use = new_series.id
        else:
            series_id_for_use = series_id
        # フラグがTrueの時だけキャラクター登録処理
        if series_character_request.is_new_character:
            new_character = await add_character(series_character_request.character_name)
            character_id_for_use = new_character.id
        else:
            character_id_for_use = character_id
        # 既存の同じ組み合わせがあるか確認
        existing_pair = await search_series_character(series_id_for_use, character_id_for_use)
        if existing_pair:
            return{"Series&Character pair already exists."}
        # ContentCatalogのseries_charactersリストに追加
        await add_series_character(series_id_for_use, character_id_for_use)

        return {
            "series_id": str(series_id_for_use),
            "character_id": str(character_id_for_use)
        }
    except Exception as e:
        print(f"Error in create_series_character_endpoint: {str(e)}")  # 詳細なエラーを出力
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    
# 作品名一覧取得(検索用)   
@router.get("/api/series")
async def get_all_series_endpoint():
    try:
        series = await get_series()
        # リスト形式を辞書形式に変換
        series_dict = {str(series.id): series.series_name for series in series}
        return series_dict
    
    except Exception as e:
        print(f"Error in create_series_character_endpoint: {str(e)}")  # 詳細なエラーを出力
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


