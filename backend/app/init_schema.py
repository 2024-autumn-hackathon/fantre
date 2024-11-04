# backend/app/init_schema.py
import os
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import asyncio
from app.database.db_connection import Database
from app.models import CustomCategoryName, CustomCharacterName, CustomItem, CustomSeriesName, Item, User, CollectionList, UserSpecificData

# 初期設定
async def init_schema(database):
    db = Database()
    database = await db.connect()  # データベースに接続
    
    await init_beanie(database, document_models=[CustomCategoryName, CustomCharacterName, CustomItem, CustomSeriesName, Item, User, CollectionList, UserSpecificData])

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

    # ユーザー独自データを作成
    user_specific_data = UserSpecificData(
        _id=ObjectId(),
        user_id=test_user.id,
        custom_items=[
            CustomItem(
                _id=ObjectId(),
                item_id=ObjectId("61f5f484a2d21a1d4cf1b0e6"),
                custom_images=[ObjectId("60d61015a2d21a1d4cf1b0eb")],
                custom_item_name="My Test Custom Item",
                custom_series_names=["My Test Series"],
                custom_character_names=["My Test Character"],
                custom_tags=["Mytag1", "Mytag2"],
                custom_retailer="My Test Local Store",
                notes="This is a personal note.",
                created_at=datetime.now(),
                exchange_status=False,
                own_status=True
            )
        ],
        custom_category_names=[
            CustomCategoryName(
                _id=ObjectId(),
                category_id=ObjectId("60d5f484a2d21a1d4cf1b0e3"),
                custom_category_name="My Custom Category"
            )
        ],
        custom_series_names=[
            CustomSeriesName(
                _id=ObjectId(),
                series_id=ObjectId("60d5f484a2d21a1d4cf1b0e4"),
                custom_series_name="My Custom Series"
            )
        ],
        custom_character_names=[
            CustomCharacterName(
                _id=ObjectId(),
                character_id=ObjectId("60d5f484a2d21a1d4cf1b0e5"),
                custom_character_name="My Custom Character"
            )
        ]
    )
    # ユーザー独自データをデータベースに追加
    await user_specific_data.insert() 

    # Test Collection Listという名前のコレクションリストが存在しない場合コレクションリストを作成
    if not await User.find_one({"collection_lists": {"$elemMatch": {"list_name": "Test Collection"}}}): 

        collection_list = CollectionList(
            _id=ObjectId(), # リストIDを自動生成
            list_name="Test Collection",
            created_at=datetime.now(),
            list_items=[ObjectId("67179fe7e405ba2805aebca2")]         
        )
    await collection_list.insert() # コレクションリストをデータベースに追加
    # 作成したコレクションリストをユーザーのリストに追加
    test_user.collection_lists.append(collection_list) # コレクションリストを追加
    await test_user.save() # 更新されたユーザーを再度保存

    # グッズを挿入
    # Test Itemという名前のグッズが存在しない場合グッズを作成
    test_item = await Item.find_one({"item_name": "Test Item"}) 
    if not test_item:   
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