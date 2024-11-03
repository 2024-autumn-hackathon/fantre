# backend/app/init_schema.py
import os
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import asyncio
from app.database.db_connection import Database
from app.models import Item, User, CollectionList

# 初期設定
async def init_schema(database):
    db = Database()
    database = await db.connect()  # データベースに接続
    
    await init_beanie(database, document_models=[Item, User, CollectionList])

# 初期データを挿入
    # ユーザーを挿入
    # Test Userという名前のユーザーが存在しない場合アイテムを作成
    test_user = await User.find_one({"user_name": "Test User"}) 
    if not test_user:  # ユーザーが存在しない場合
        test_user = User(
            _id=ObjectId(),
            user_name="Test User",
            email="test@example.com",
            password="hashed_password",
            bg_image_id=ObjectId("60d5f484a2d21a1d4cf1b0e4")
        )
    await test_user.insert()  # データベースにユーザーを追加

    # グッズを挿入
    # Test Itemという名前のグッズが存在しない場合グッズを作成
    if not await Item.find_one({"item_name": "Test Item"}):        
        test_item = Item(
            _id=ObjectId(),
            item_name="Test Item",
            item_series=ObjectId("60d5f484a2d21a1d4cf1b0e6"),
            item_character=ObjectId("60d5f484a2d21a1d4cf1b0e7"),
            category=ObjectId("60d5f484a2d21a1d4cf1b0e8"),
            tags=["#test1", "#test2"],
            jan_code="4991567672501",
            retailers=["Test Shop"]
        )
        await test_item.insert()  # データベースにグッズを追加