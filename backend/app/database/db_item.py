# backend/app/database/db_item.py
from app.models import Item
from bson import ObjectId
from fastapi import HTTPException
from pydantic import BaseModel
from app.database.db_connection import Database


db = Database()

# 新しいアイテムを作成する
async def create_item(item: Item):
    await db.connect()
    print(item)  # 挿入するアイテムの内容を表示
    try:
        await item.insert()
        return item
    except Exception as e:
        print(f"Error occurred: {e}")  # エラーログを出力
    finally:
        await db.disconnect()  # 接続を切断

# すべてのアイテム（詳細含む）を取得する
async def get_items():
    await db.connect()
    try:
        items = await Item.find_all().to_list()
        return items
    except Exception as e:
        raise Exception(f"Error fetching items: {str(e)}")  # エラーログを出力
    finally:
        await db.disconnect()  # 接続を切断

# 指定したユーザーの独自データ（カスタムアイテム等すべての詳細を含む）を取得する
async def get_user_specific_data(user_id: str):
    try:
        user_specific_data = await UserSpecificData.find_one({"user_id": ObjectId(user_id)})
        return user_specific_data
    except Exception as e:
        raise Exception(f"Error fetching user specific data: {str(e)}")  # エラーログを出力