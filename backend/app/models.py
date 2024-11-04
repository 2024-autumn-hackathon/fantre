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
    collection_lists: Optional[List["CollectionList"]] = []

    class Settings:
        name = "users"  # MongoDBのコレクション名

class CollectionList(DocumentWithConfig):
    _id: ObjectId
    list_name: str = Indexed(unique=True, fields=["user_id"]) # user_idと組み合わせてユニークに
    created_at: Optional[datetime] = None
    list_items: Optional[List[ObjectId]] = []  # item_idのリス

    class Settings:
        name = "collection_lists"

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

    class Settings:
        name = "items" 

# categoriesコレクション
class Category(DocumentWithConfig):
    _id: ObjectId
    category_name: str = Indexed(unique=True) # 共有グッズジャンル名

    class Settings:
        name = "categories"

# seriesコレクション
class Series(DocumentWithConfig):
    _id: ObjectId
    series_name: str = Indexed(unique=True) # 共有作品名

    class Settings:
        name = "series" 
    
# charactersコレクション
class Character(DocumentWithConfig):
    _id: ObjectId
    character_name: str = Indexed(unique=True) # 共有キャラクター名

    class Settings:
        name = "characters"

# series_charactersコレクション
class SeriesCharacters(DocumentWithConfig):
    _id: ObjectId
    series_id: ObjectId
    character_id: ObjectId

    class Settings:
        name = "series_characters"

# imagesコレクション
class Image(DocumentWithConfig):
    _id: ObjectId
    user_id: ObjectId
    item_id: Optional[ObjectId] = None
    image_url: str
    created_at: Optional[datetime]
    is_background: bool = False
   
    class Settings:
        name = "images"

# users_itemsコレクション(中間テーブル)
class UserItem(DocumentWithConfig):
    _id: ObjectId
    user_id: ObjectId
    item_id: ObjectId

    class Settings:
        name = "users_items"

# user_specific_dataコレクション
class UserSpecificData(DocumentWithConfig):
    _id: ObjectId
    user_id: ObjectId
    custom_items: Optional[List["CustomItem"]] = []
    custom_category_names: Optional[List["CustomCategoryName"]] = []
    custom_series_names: Optional[List["CustomSeriesName"]] = []
    custom_character_names: Optional[List["CustomCharacterName"]] = [] 

    class Settings:
        name = "user_specific_data"

class CustomItem(DocumentWithConfig):
    _id: ObjectId
    item_id: ObjectId
    custom_images: Optional[List[ObjectId]] = [] # image_id
    custom_item_name: Optional[str] = None
    custom_series_name: Optional[ObjectId] = None # CustomSeriesName_id
    custom_character_name: Optional[ObjectId] = None # CustomCategoryName_id
    custom_category_name: Optional[ObjectId] = None # CustomCharacterName_id
    custom_tags: Optional[List[str]] = [] #tag
    custom_retailer: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    exchange_status: Optional[bool] = None
    own_status: Optional[bool] = None

    class Settings:
        name = "custom_items"

class CustomCategoryName(DocumentWithConfig):
    _id: ObjectId
    category_id: ObjectId
    custom_category_name: str

    class Settings:
        name = "custom_categories"

class CustomSeriesName(DocumentWithConfig):
    _id: ObjectId
    series_id: ObjectId
    custom_series_name: str

    class Settings:
        name = "custom_series"

class CustomCharacterName(DocumentWithConfig):
    _id: ObjectId
    character_id: ObjectId
    custom_character_name: str

    class Settings:
        name = "custom_characters"

############### MVPここまで ########################

# users_chatsコレクション
class UserItem(DocumentWithConfig):
    _id: ObjectId
    user_id: ObjectId
    item_id: ObjectId

    class Settings:
        name = "users_items"

# chatコレクション
class Chat(DocumentWithConfig):
    _id: ObjectId
    chat_name: str = Indexed(unique=True)
    participants: List[ObjectId] # user_idのリスト
    created_at: datetime
    updated_at: Optional[datetime] = None
    messages: Optional[List["Message"]] = []

    class Settings:
        name = "chats"

# messagesコレクション
class Message(DocumentWithConfig):
    _id: ObjectId
    sender_id: ObjectId # user_id
    content: str
    timestamp: datetime    

    class Settings:
        name = "messages"

# users_chatsコレクション
class UserChat(DocumentWithConfig):
    _id: ObjectId
    user_id: ObjectId
    chat_id: ObjectId

    class Settings:
        name = "users_chats"

# calender_eventsコレクション
class Event(DocumentWithConfig):
    _id: ObjectId
    event_name: str
    event_details: Optional[str] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    created_by: ObjectId # user_id
    created_at: datetime
    updated_at: Optional[datetime] = None
    related_series: Optional[List[ObjectId]] = [] # series_id
    related_characters: Optional[List[ObjectId]] = [] # character_id

    class Settings:
        name = "events"