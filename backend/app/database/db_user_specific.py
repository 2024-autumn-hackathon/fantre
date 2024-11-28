# backend/app/database/db_user_specific.py
from bson import ObjectId
from app.models import Category, Character, ContentCatalog, CustomItem, Series, SeriesCharacter, UserSpecificData
from app.database.db_connection import Database
from app.database.db_content_catalog import get_content_catalog
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

    user_specific_data.user_id = user_id
    
    await db.connect()
    try:
        await user_specific_data.insert()
        return user_specific_data
    
    except Exception as e:
        print(f"Error during insertion: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inserting user specific data: {str(e)}"
        )
    finally:
        await db.disconnect()  


# 独自アイテムを作成する
async def create_custom_item(user_specific_data, custom_item: CustomItem):
    await db.connect()
    try:
        user_specific_data.custom_items.append(custom_item)
        await user_specific_data.save()

        return custom_item
    
    except Exception as e:
        print(f"Error during insertion: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inserting custom item: {str(e)}"
        )
    finally:
        await db.disconnect()


# custom_series_nameの部分一致検索
async def custom_series_name_partial_match(series_name: str):

    content_catalog = await get_content_catalog()

    matched_series_ids = []
    for series in content_catalog.series:
        if series_name.lower() in series.series_name.lower():
            matched_series_ids.append(series.id)

    return matched_series_ids