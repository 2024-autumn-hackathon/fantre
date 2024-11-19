# backend/app/database/db_user_specific.py
from bson import ObjectId
from app.models import Category, Character, ContentCatalog, Series, SeriesCharacter, UserSpecificData
from app.database.db_connection import Database
from fastapi import HTTPException, status

db = Database()

# 指定したユーザーの独自データ（カスタムアイテム等すべての詳細を含む）を取得する
async def get_user_specific_data(user_id: ObjectId):
  await db.connect()
  try:
        user_specific_data = await UserSpecificData.find_one({"user_id": user_id})
        if user_specific_data is None:
            return None
        return user_specific_data

  except HTTPException as http_ex:
        raise http_ex
  except Exception as e:
      print(f"Error fetching user_specific_data: {str(e)}")
      raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching user_specific_data: {str(e)}"
      )
  finally:
        await db.disconnect()

# 新しいユーザー独自データを作成する
async def create_user_specific_data(user_id: ObjectId, user_specific_data: UserSpecificData):
    print("Starting to create user-specific data...")
    user_specific_data.user_id = user_id
    print(f"User ID assigned: {user_id}")
    
    await db.connect()
    print("Database connected.")
    try:
        print("Attempting to insert user_specific_data into the database...")
        await user_specific_data.insert()
        print("User specific data inserted successfully.")
        return user_specific_data
    
    except Exception as e:
        print(f"Error during insertion: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inserting user specific data: {str(e)}"
        )
    finally:
        await db.disconnect()  
        print("Database disconnected.")