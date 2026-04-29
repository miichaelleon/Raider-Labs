from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: str = "student"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse