# backend/app/models.py
from pydantic import Field
from datetime import date, datetime
from typing import List, Optional
from beanie import Document, Indexed
from bson import ObjectId
from pymongo import IndexModel

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
    collection_lists: Optional[List["CollectionList"]] = Field(default_factory=list)

    class Settings:
        name = "users"  # MongoDBのコレクション名

class CollectionList(DocumentWithConfig):
    _id: ObjectId
    list_name: str = Indexed(unique=True, fields=["user_id"]) # user_idと組み合わせてユニークに
    created_at: Optional[datetime] = None
    list_items: Optional[List[ObjectId]] = Field(default_factory=list)  # item_idのリス

# itemsコレクション
class Item(DocumentWithConfig):
    _id: ObjectId
    item_images: Optional[List[ObjectId]] = Field(default_factory=list) # image_idのリスト
    item_name: str = Indexed(unique=True)
    item_series: ObjectId = None # series_id
    item_character: ObjectId = None # character_id
    category: Optional[ObjectId] = None # category_id
    tags: Optional[List[str]] = Field(default_factory=list)
    jan_code: Optional[str] = Indexed(unique=True), None
    release_date: Optional[date] = None
    retailers: Optional[List[str]] = Field(default_factory=list)
    user_data: Optional[List[ObjectId]] = Field(default_factory=list) # user_specific_data_id

    class Settings:
        name = "items" 

# content_catalogsコレクション
class ContentCatalog(DocumentWithConfig):
    _id: ObjectId
    categories: Optional[List["Category"]] = Field(default_factory=list)
    series: Optional[List["Series"]] = Field(default_factory=list)
    characters: Optional[List["Character"]] = Field(default_factory=list)
    series_characters: Optional[List["SeriesCharacter"]] = Field(default_factory=list)

    class Settings:
        name = "content_catalogs" 

# categories
class Category(DocumentWithConfig):
    _id: ObjectId
    category_name: str = Indexed(unique=True) # 共有グッズジャンル名
 
# series
class Series(DocumentWithConfig):
    _id: ObjectId
    series_name: str = Indexed(unique=True) # 共有作品名
    
# characters
class Character(DocumentWithConfig):
    _id: ObjectId
    character_name: str = Indexed(unique=True)  # キャラクター名

# series_characters
class SeriesCharacter(DocumentWithConfig):
    _id: ObjectId
    series_id: ObjectId
    character_id: ObjectId

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

# user_specific_dataコレクション
class UserSpecificData(DocumentWithConfig):
    _id: ObjectId
    user_id: ObjectId = Indexed(unique=True)
    custom_items: Optional[List["CustomItem"]] = Field(default_factory=list)
    custom_category_names: Optional[List["CustomCategoryName"]] = Field(default_factory=list)
    custom_series_names: Optional[List["CustomSeriesName"]] = Field(default_factory=list)
    custom_character_names: Optional[List["CustomCharacterName"]] = Field(default_factory=list) 

    class Settings:
        name = "user_specific_data"

class CustomItem(DocumentWithConfig):
    _id: ObjectId
    item_id: ObjectId
    custom_item_images: Optional[List[ObjectId]] = Field(default_factory=list) # image_id
    custom_item_name: Optional[str] = None
    custom_item_series_name: Optional[ObjectId] = None # CustomSeriesName_id
    custom_item_character_name: Optional[ObjectId] = None # CustomCategoryName_id
    custom_item_category_name: Optional[ObjectId] = None # CustomCharacterName_id
    custom_item_tags: Optional[List[str]] = Field(default_factory=list) #tag
    custom_item_retailer: Optional[str] = None
    custom_item_notes: Optional[str] = None
    created_at: datetime
    exchange_status: Optional[bool] = None
    own_status: Optional[bool] = None

class CustomCategoryName(DocumentWithConfig):
    _id: ObjectId
    category_id: ObjectId
    custom_category_name: str

class CustomSeriesName(DocumentWithConfig):
    _id: ObjectId
    series_id: ObjectId
    custom_series_name: str

class CustomCharacterName(DocumentWithConfig):
    _id: ObjectId
    character_id: ObjectId
    custom_character_name: str

############### MVPここまで ########################

# chatコレクション
class Chat(DocumentWithConfig):
    _id: ObjectId
    chat_name: str = Indexed(unique=True)
    participants: List[ObjectId] # user_idのリスト
    created_at: datetime
    updated_at: Optional[datetime] = None
    messages: Optional[List["Message"]] = Field(default_factory=list)

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
    related_series: Optional[List[ObjectId]] = Field(default_factory=list) # series_id
    related_characters: Optional[List[ObjectId]] = Field(default_factory=list) # character_id

    class Settings:
        name = "events"