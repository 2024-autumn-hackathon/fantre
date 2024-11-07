# app/api/user.py
from typing import Annotated
from fastapi import APIRouter, Form, HTTPException
from pydantic import BaseModel, Field, field_validator, ValidationInfo, EmailStr, SecretStr
from app.models import User
from app.database.db_user import create_user, exists_username, exists_email
from passlib.context import CryptContext
from app.models import User


router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class SignupFormData(BaseModel):
    user_name: str
    email: EmailStr
    password1: SecretStr = Field(..., min_length=8)
    password2: SecretStr = Field(..., min_length=8)

    @field_validator("password2")
    def passwords_match(cls, v: SecretStr, info: ValidationInfo) -> SecretStr:
        if "password1" in info.data and v != info.data["password1"]:
            raise ValueError()
        return v


# passwordハッシュ化
def password_hash(password):
    return pwd_context.hash(password)


# サインアップ
@router.post("/signup")
async def signup(data: Annotated[SignupFormData, Form()]):
    if await exists_username(data.user_name):
        raise HTTPException(status_code=422, detail="The username is already taken.")
    if await exists_email(data.email):
        raise HTTPException(status_code=422, detail="The email is already taken.")
    password = password_hash(data.password1.get_secret_value())
    user = User(user_name=data.user_name, email=data.email, password=password)
    return await create_user(user)