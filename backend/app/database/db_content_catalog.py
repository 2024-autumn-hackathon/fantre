# backend/app/database/db_content_catalog.py
from bson import ObjectId
from app.models import Category, Character, ContentCatalog, Series, SeriesCharacter
from app.database.db_connection import Database
from fastapi import HTTPException, status

db = Database()

# ContentCatalogにかかわるすべてのデータ保存
async def save_content_catalog(content_catalog: ContentCatalog):	
    await db.connect()
    try:
        await content_catalog.save()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving content catalog: {str(e)}"
            )
    finally:
        await db.disconnect()

# ContentCatalogを取得する
async def get_content_catalog():
    await db.connect()
    try:
        content_catalog = await ContentCatalog.find_one()
        if not content_catalog:
            content_catalog = ContentCatalog()
        return content_catalog
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching content catalog: {str(e)}"
            )
    finally:
        await db.disconnect()

# 新しいグッズジャンル(カテゴリー)を作成する 
async def create_category(category_name: str):
    try:
        content_catalog = await get_content_catalog()
        # 既存のcategory_nameとの重複を確認
        if content_catalog:
            for existing_category in content_catalog.categories:
                if existing_category.category_name == category_name:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Category with the same name already exists."
                    )
        new_category = Category(_id=ObjectId(), category_name=category_name)
        content_catalog.categories.append(new_category)

        await save_content_catalog(content_catalog)
        return new_category
    
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurd while creating the category."
        )

# すべてのグッズジャンル（詳細を含む）を取得する
async def get_categories():
    try:
        content_catalog = await get_content_catalog()
        if content_catalog:
            return content_catalog.categories
        return []
    except Exception as e:
        raise Exception(f"Error fetching categories: {str(e)}") 

# 新しい作品を作成する
async def create_series(series_name: str):
    try:
        content_catalog = await get_content_catalog()
        # 既存のseries_nameと重複を確認
        if content_catalog:
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
    
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurd while creating the series."
        )
    
# すべての作品（詳細を含む）を取得する
async def get_series():
    try:
        content_catalog = await get_content_catalog()
        if content_catalog:
            return content_catalog.series
        return []
    except Exception as e:
        raise Exception(f"Error fetching series: {str(e)}") 

# 新しいキャラクターを作成する
async def create_character(character_name: str):
    try:
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
    
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurd while creating the character."
        )
    
# すべてのキャラクター（詳細含む）を取得する
async def get_characters():
    try:
        content_catalog = await get_content_catalog()
        if content_catalog:
            return content_catalog.characters
        return []
    except Exception as e:
        raise Exception(f"Error fetching characters: {str(e)}") 

# すべての作品＆キャラクターの組み合わせを取得する
async def get_series_characters():
    try:
        content_catalog = await get_content_catalog()
        if content_catalog:
            return content_catalog.series_characters
        return None
    except Exception as e:
        raise Exception(f"Error fetching series_characters: {str(e)}") 

# 新しい作品＆キャラクターの組み合わせを作成する
async def create_series_character(series_id: ObjectId, character_id: ObjectId):
    try:        # ContentCatalogを取得
        content_catalog = await get_content_catalog()

        # 同じ作品とキャラクターのペアがすでに存在するか確認
        for pair in content_catalog.series_characters:
            if pair.series_id == series_id and pair.character_id == character_id:
                # 既存のペアがあればスキップ
                return{
                    "message":"Series and character pair already exists.",
                    "series_id": str(series_id),
                    "character_id": str(character_id)                    
                    }            
        # 新しいペアを作成
        new_pair = SeriesCharacter(_id=ObjectId(),series_id=series_id, character_id=character_id)
        content_catalog.series_characters.append(new_pair)
        await save_content_catalog(content_catalog)
        return new_pair  
    
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurd while creating the series_character."
        )