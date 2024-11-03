# backend/app/models.py
from datetime import date, datetime
from typing import List, Optional
from beanie import Document, Indexed
from bson import ObjectId

# PydanticがObjectId型を受け入れるようにする
class DocumentWithConfig(Document):
    class Config:
        arbitrary_types_allowed = True # 任意の型を許可
        json_encoders = {
            ObjectId: str # ObjectIdを文字列に変換する設定
        }

# usersコレクション
class User(DocumentWithConfig):
    _id: ObjectId
    user_name: str = Indexed(unique=True) # unique
    email: str = Indexed(unique=True)
    password: str
    bg_image_id: Optional[ObjectId] = None
    lists: Optional[List["CollectionList"]] = []

    class Config:
        collection = "users"  # MongoDBのコレクション名

class CollectionList(DocumentWithConfig):
    _id: ObjectId
    list_name: str = Indexed(unique=True, fields=["user_id"]) # user_idと組み合わせてユニークに
    created_at: Optional[datetime] = None
    list_items: Optional[List[ObjectId]] = []  # item_idのリスト

    class Config:
        collection = "users"  

# itemsコレクション
class Item(DocumentWithConfig):
    _id: ObjectId
    item_images: Optional[List[ObjectId]] = [] # image_idのリスト
    item_name: str = Indexed(unique=True)
    item_series: Optional[ObjectId] = None # series_id
    item_character: Optional[ObjectId] = None # character_id
    category: Optional[ObjectId] = None # category_id
    tags: Optional[list[str]] = []
    jan_code: Optional[str] = None
    release_date: Optional[date] = None
    retailers: Optional[List[str]] = []

    class Config:
        collection = "items" 

# categoriesコレクション
class Category(DocumentWithConfig):
    _id: ObjectId
    category_name: str = Indexed(unique=True) # 共有グッズジャンル名

    class Config:
        collection = "categories"

# seriesコレクション
class Series(DocumentWithConfig):
    _id: ObjectId
    series_name: str = Indexed(unique=True) # 共有作品名

    class Config:
        collection = "series" 
    
# charactersコレクション
class Character(DocumentWithConfig):
    _id: ObjectId
    character_name: str = Indexed(unique=True) # 共有キャラクター名

    class Config:
        collection = "characters"

# series_charactersコレクション
class SeriesCharacters(DocumentWithConfig):
    _id: ObjectId
    series_id: ObjectId
    character_id: ObjectId

    class Config:
        collection = "series_characters"