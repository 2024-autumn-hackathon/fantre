# backend/app/api/content_catalog.py
from typing import List, Optional
from app.models import Category, ContentCatalog, Item
from app.database.db_content_catalog import save_content_catalog
from pydantic import BaseModel, field_validator, ValidationError, Field
from datetime import date
from bson import ObjectId
from fastapi import APIRouter, HTTPException, status
from beanie import Indexed
import re

router = APIRouter()

class CategoryRequeset(BaseModel):
    category_name: str


@router.post("/api/categories")
async def create_category_endpoint(category_request: CategoryRequeset):
    try:
        category_data = category_request.model_dump()

        # ContentCatalogを取得
        content_catalog = await ContentCatalog.find_one()
        if not content_catalog:
            content_catalog = ContentCatalog()        

        # 既存のcategory_nameと重複を確認
        for existing_category in content_catalog.categories:
            if existing_category.category_name == category_data["category_name"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Category with the same name already exists."
                )
            
        # 新しいカテゴリを追加
        new_category = Category(_id=ObjectId(), **category_data)
        content_catalog.categories.append(new_category)
        await save_content_catalog(content_catalog)
        return new_category
    
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=e.errors()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )