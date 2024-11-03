# backend/app/init_schema.py
import os
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import asyncio
from app.database.db_connection import Database
from app.models import User, CollectionList

# 初期設定
async def init_schema(database):
    db = Database()
    database = await db.connect()  # データベースに接続
    
    await init_beanie(database, document_models=[  CollectionList, User])

# 初期データを挿入
# ユーザーを取得
    test_user = await User.find_one({"user_name": "Test User"})  # ユーザーを探す
    if not test_user:  # ユーザーが存在しない場合
        test_user = User(
            _id=ObjectId(),
            user_name="Test User",
            email="test@example.com",
            password="hashed_password",
            bg_image_id=ObjectId("60d5f484a2d21a1d4cf1b0e4")
        )
    await test_user.insert()  # データベースにユーザーを追加

