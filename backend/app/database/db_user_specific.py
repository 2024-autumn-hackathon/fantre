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
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User specific data not found."
            )
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
async def create_user_specific_data(user_id: ObjectId, user_specific_data = UserSpecificData):
    
    user_id = user_id
    await db.connect()
    try:
        await user_specific_data.insert()
        return user_specific_data
    except Exception as e:
        raise Exception(f"Error creating user_specific_data: {str(e)}") 
    finally:
        await db.disconnect()  # 接