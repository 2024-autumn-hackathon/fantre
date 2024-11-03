# models.py
from datetime import date, datetime
from typing import List, Optional
# import uuid
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
    