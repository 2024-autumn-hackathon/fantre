# backend/app/database/db_item.py
from app.models import Item
from bson import ObjectId
from fastapi import HTTPException, status
from pydantic import BaseModel, ValidationError
from app.database.db_connection import Database


db = Database()

# 新しいアイテムを作成する
async def create_item(item: Item):
    await db.connect()
    print(item)  # 挿入するアイテムの内容を表示
    try:
        await item.insert()
        return item
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise Exception(f"Error fetching items: {str(e)}") # エラーログを出力
    finally:
        await db.disconnect()  # 接続を切断

# すべてのアイテム（詳細含む）を取得する
async def get_all_items():
    await db.connect()
    try:
        items = await Item.find_all().to_list()
        return items
    except Exception as e:
        raise Exception(f"Error fetching items: {str(e)}") 
    finally:
        await db.disconnect()  # 接続を切断

# 指定したアイテムの詳細を取得する
async def get_item(item_id: ObjectId):
    await db. connect()
    try:
        item = await Item.get(item_id)
        if item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Item not found.")
        return item
    
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        print(f"Error fetching item: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching item: {str(e)}" 
        )
    finally:
        await db.disconnect()

# アイテム登録時の重複チェック
async def existing_item_check(item_name: str, jan_code: str) -> bool:
    await db.connect()
    try:
        if await Item.find_one({"item_name": item_name}):
            return True  # 名前が重複している場合
        if jan_code and await Item.find_one({"jan_code": jan_code}):
            return True  # JANコードが重複している場合
        
        return False  # 重複がなければFalseを返す
    finally:
        await db.disconnect()