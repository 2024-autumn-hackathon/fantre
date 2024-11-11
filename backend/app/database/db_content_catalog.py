# backend/app/database/db_content_catalog.py
from app.models import ContentCatalog
from app.database.db_connection import Database

db = Database()

# ContentCatalogにかかわるすべてのデータ保存
async def save_content_catalog(content_catalog: ContentCatalog):	
    await db.connect()
    try:
        await content_catalog.save()
    except Exception as e:
        raise Exception(f"Error saving content catalog: {str(e)}")
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
        raise Exception(f"Error saving content catalog: {str(e)}")
    finally:
        await db.disconnect()

# すべてのグッズジャンル（詳細を含む）を取得する
async def get_categories():
    try:
        content_catalog = await get_content_catalog()
        if content_catalog:
            return content_catalog.categories
        return []
    except Exception as e:
        raise Exception(f"Error fetching categories: {str(e)}") 

# すべての作品（詳細を含む）を取得する
async def get_series():
    try:
        content_catalog = await get_content_catalog()
        if content_catalog:
            return content_catalog.series
        return []
    except Exception as e:
        raise Exception(f"Error fetching series: {str(e)}") 

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

# 指定した作品またはキャラクターの組み合わせがあるか確認
async def search_series_character(series_id: str, character_id: str):
    try:
        content_catalog = await get_content_catalog()
        for pair in content_catalog.series_characters:
            if pair.series_id == series_id and pair.character_id == character_id:
                return pair
        return None
    except Exception as e:
        raise Exception(f"Error serching series_characters: {str(e)}") 