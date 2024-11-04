# backend/app/init_schema.py
import os
from datetime import datetime
from bson import ObjectId
from pymongo.errors import DuplicateKeyError
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import asyncio
from app.database.db_connection import Database
from app.models import Category, Character, CustomCategoryName, CustomCharacterName, CustomItem, CustomSeriesName, Image, Item, Series, SeriesCharacters, User, CollectionList, UserItem, UserSpecificData

# 初期設定
async def init_schema(database):
    db = Database()
    database = await db.connect()  # データベースに接続
    
    await init_beanie(database, document_models=[Category, Character, CustomCategoryName, CustomCharacterName, CustomItem, CustomSeriesName, Image, Item, Series, SeriesCharacters, User, CollectionList, UserItem, UserSpecificData])

# 初期データを挿入
    # ユーザーを挿入
    # Test Userという名前のユーザーが存在しない場合アイテムを作成
    test_user = await User.find_one({"user_name": "Test User"}) 
    if not test_user:  # ユーザーが存在しない場合
        try:            
            test_user = User(
                user_name="Test User",
                email="test@example.com",
                password="hashed_password",
                bg_image_id=ObjectId("61f5f484a2d21a1d4cf1b0e6")
            )
            await test_user.insert()  # データベースにユーザーを追加
        except DuplicateKeyError:
            print("User with specified _id or user_name already exists, skipping insertion.")
    else:
        print("User 'Test User' already exists, skipping insertion.")

    # ユーザー独自データを作成
    user_specific_data = UserSpecificData(
        user_id=test_user.id,
        custom_items=[
            CustomItem(
                item_id=ObjectId("6728433b3bdeccb81751047a"),
                custom_item_images=[ObjectId("61f5f484a2d21a1d4cf1b0e6")],
                custom_item_name="My Test Custom Item",
                custom_item_series_name=ObjectId("672840afd9dc1d815343faa6"),
                custom_item_character_name=ObjectId("672840afd9dc1d815343faa7"),
                custom_item_category_name=ObjectId("67283c42caab231ed09c55a4"),
                custom_item_tags=["Mytag1", "Mytag2"],
                custom_item_retailer="My Test Local Store",
                custom_item_notes="This is a personal note.",
                created_at=datetime.now(),
                exchange_status=False,
                own_status=True
            )
        ],
        custom_category_names=[
            CustomCategoryName(
                category_id=ObjectId("6728433b3bdeccb81751047b"),
                custom_category_name="My Custom Category"
            )
        ],
        custom_series_names=[
            CustomSeriesName(
                series_id=ObjectId("6728433b3bdeccb81751047c"),
                custom_series_name="My Custom Series"
            )
        ],
        custom_character_names=[
            CustomCharacterName(
                character_id=ObjectId("6728433b3bdeccb81751047d"),
                custom_character_name="My Custom Character"
            )
        ]
    )
    # ユーザー独自データをデータベースに追加
    await user_specific_data.insert() 

    # Test Collection Listという名前のコレクションリストが存在しない場合コレクションリストを作成
    if not await User.find_one({"collection_lists": {"$elemMatch": {"list_name": "Test Collection"}}}): 

        collection_list = CollectionList(
            list_name="Test Collection",
            created_at=datetime.now(),
            list_items=[ObjectId("6728433b3bdeccb81751047a")]         
        )
    # 作成したコレクションリストをユーザーのリストに追加
    test_user.collection_lists.append(collection_list) # コレクションリストを追加
    await test_user.save() # 更新されたユーザーを再度保存

    # グッズを挿入
    # Test Itemという名前のグッズが存在しない場合グッズを作成
    test_item = await Item.find_one({"item_name": "Test Item"}) 
    if not test_item:   
        test_item = Item(
            item_name="Test Item",
            item_images=[ObjectId("61f5f484a2d21a1d4cf1b0e6")],
            item_series=ObjectId("6728433b3bdeccb81751047c"),
            item_character=ObjectId("6728433b3bdeccb81751047d"),
            category=ObjectId("6728433b3bdeccb81751047b"),
            tags=["#test1", "#test2"],
            jan_code="4991567672501",
            retailers=["Test Shop"]
        )
        await test_item.insert()  # データベースにグッズを追加

    #  Test Categoryという名前のグッズジャンルが存在しない場合グッズジャンルを作成
    if not await Category.find_one({"category_name": "Test Category"}): 
        test_category = Category(
            category_name="Test Category"
        )
        await test_category.insert()

    # Test Seriesという名前の作品名が存在しない場合作品を作成
    if not await Series.find_one({"series_name": "Test Series"}):
        test_series = Series(
            series_name="Test Series"
        )
        await test_series.insert()

    # Test Characterという名前のキャラクターが存在しない場合キャラクターを作成
    if not await Character.find_one({"character_name": "Test Character"}): 
        test_character = Character(
            character_name="Test Character"
        )
        await test_character.insert()  # データベースにキャラクターを追加

    # Ttestseriescharacter1という名前の作品キャラクターが存在しない場合作品キャラクターを作成
    if not await SeriesCharacters.find_one({"series_id": ObjectId("60d5f484a2d21a1d4cf1b0e6")}):
        test_series_characters = SeriesCharacters(
            series_id=ObjectId("6728433b3bdeccb81751047c"),
            character_id=ObjectId("6728433b3bdeccb81751047d")
        )
        await test_series_characters.insert()

    # UserItem中間テーブルを挿入
    if not await UserItem.find_one({"item_id": ObjectId("61f5f484a2d21a1d4cf1b0e6")}): 

        test_users_items = UserItem(
            user_id=ObjectId("6728433a3bdeccb817510476"),
            item_id=ObjectId("61f5f484a2d21a1d4cf1b0e6") 
        )
        await test_users_items.insert() 

    # 画像を挿入
    test_image = await Image.find_one({"item_id": "61f5f484a2d21a1d4cf1b0e6"}) 

    if not await Image.find_one({"image_url": str("https://example.com/images/image1.jpg")}):  
    
    # test_image: 
        test_image = Image(
            user_id=ObjectId("6728433a3bdeccb817510476"), 
            item_id=ObjectId("61f5f484a2d21a1d4cf1b0e6"), 
            image_url="https://example.com/images/image1.jpg", 
            created_at=datetime.now(), 
            is_background=False 
        )
    await test_image.insert()  # 画像をデータベースに挿入

if __name__ == "__main__":
    asyncio.run(init_schema())
