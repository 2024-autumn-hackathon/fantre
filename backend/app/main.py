# backend/app/main.py
from contextlib import asynccontextmanager
from app.database.db_connection import Database
from fastapi import FastAPI
from app.init_schema import init_schema


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = Database()
    database = await db.connect()     
    await init_schema(database) # データベースのスキーマを初期化
    yield  # アプリケーションが実行中の間はこの状態を保持

app = FastAPI(lifespan=lifespan)
