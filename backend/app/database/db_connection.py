# backend/app/database/db_connection.py
import os
from motor.motor_asyncio import AsyncIOMotorClient


# データベースへの接続・切断を管理
class Database:
    def __init__(self):
        self.client = None # MongoDBクライアント
        self.database = None # デフォルトのデータベース

    # データベースへ接続
    async def connect(self):
        self.client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
        self.database = self.client["teamC"]
        return self.database
    
    # データベースから切断
    async def disconnect(self):
        if self.client:
            self.client.close()