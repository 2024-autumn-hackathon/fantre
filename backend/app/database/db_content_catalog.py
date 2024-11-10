# backend/app/database/db_content_catalog.py
from app.models import Category, ContentCatalog
from app.database.db_connection import Database

db = Database()

# 新しいグッズジャンル（カテゴリー）を登録する
async def save_content_catalog(content_catalog: ContentCatalog):	
    await db.connect()
    print(content_catalog)  # 挿入する内容を表示
    try:
        await content_catalog.save()
    except Exception as e:
        raise Exception(f"Error saving content catalog: {str(e)}")
    finally:
        await db.disconnect()

# すべてのグッズジャンル（詳細を含む）を取得する
async def get_categories():
    await db.connect()
    try:
        content_catalog = await ContentCatalog.find_one()
        if content_catalog:
            return content_catalog.categories
        return []
    except Exception as e:
        raise Exception(f"Error fetching categories: {str(e)}") 
    finally:
        await db.disconnect()
