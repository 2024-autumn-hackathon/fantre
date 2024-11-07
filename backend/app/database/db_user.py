# backend/app/database/db_user.py
from app.database.db_connection import Database
from app.models import User

db = Database()

# user登録
async def create_user(user: User):
    await db.connect()
    await user.insert()
    return user

# user_name重複確認
async def exists_username(user_name: str) -> bool:
    await db.connect()
    result = await User.find_one({"user_name": user_name})
    return result is not None

# email重複確認
async def exists_email(email: str) -> bool:
    await db.connect()
    result = await User.find_one({"email": email})
    return result is not None
