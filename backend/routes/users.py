from fastapi import APIRouter, HTTPException
from database import users_collection
from models import UserRegister, UserLogin, Token, UserResponse
from auth import hash_password, verify_password, create_access_token
from bson import ObjectId

router = APIRouter()

@router.post("/register")
async def register(user: UserRegister):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user.password)

    new_user = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "password": hashed,
        "role": user.role
    }

    result = await users_collection.insert_one(new_user)

    return {"message": "User created successfully", "id": str(result.inserted_id)}


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await users_collection.find_one({"email": credentials.email})

    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user["_id"]), "role": user["role"]})

    return Token(
        access_token=token,
        user=UserResponse(
            id=str(user["_id"]),
            first_name=user["first_name"],
            last_name=user["last_name"],
            email=user["email"],
            role=user["role"]
        )
    )