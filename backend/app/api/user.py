# app/api/user.py
import os
import jwt
from jwt.exceptions import InvalidTokenError
from datetime import datetime, timedelta, timezone
from typing import Annotated, Union
from fastapi import APIRouter, Depends, Form, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, field_validator, ValidationInfo, EmailStr, SecretStr
from passlib.context import CryptContext
from bson import ObjectId
from dotenv import load_dotenv

from app.models import User
from app.database.db_user import create_user, get_user, exists_username, exists_email


router = APIRouter()


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "login")




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
    

class LoginFormData(BaseModel):
    email: EmailStr
    password: SecretStr = Field(..., min_length=8)
    

class Token(BaseModel):
    access_token: str
    token_type: str
    

class CurrentUser(BaseModel):
    user_id: str




# passwordハッシュ化
def password_hash(password):
    return pwd_context.hash(password)


# 入力パスワード照合
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# 入力された情報と一致するユーザーを取得
async def authenticate_user(email: EmailStr, password: str):
    user = await get_user(email)

    if not user:
        raise HTTPException(status_code=401, detail="The user is not exit.")
    if not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="password error.")
    return user


# token作成
def create_access_token(_id: ObjectId, expires_delta: Union[timedelta, None] = None):
    user_id = str(_id)
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": user_id, "exp": expire}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    return token


# tokenデコードしてuser_id取得
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    return user_id




# サインアップ
@router.post("/signup")
async def signup(signup_request: Annotated[SignupFormData, Form()]):
    if await exists_username(signup_request.user_name):
        raise HTTPException(status_code=422, detail="The username is already taken.")
    if await exists_email(signup_request.email):
        raise HTTPException(status_code=422, detail="The email is already taken.")
    password = password_hash(signup_request.password1.get_secret_value())
    new_user = User(user_name=signup_request.user_name, email=signup_request.email, password=password)
    return await create_user(new_user)


# ログイン
@router.post("/login")
async def login(login_request: Annotated[OAuth2PasswordRequestForm, Depends()]) -> Token:
    login_user = await authenticate_user(login_request.username, login_request.password) # OAuth2PasswordRequestFormを使う場合usernameとpasswordという名前を使う必要がある
    if not login_user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(login_user.id)
    return Token(access_token=access_token, token_type="bearer")


# tokenからuser_idを取るテスト用
@router.get("/token-test") 
async def token_test(user_id: str = Depends(get_current_user)):
    return user_id
