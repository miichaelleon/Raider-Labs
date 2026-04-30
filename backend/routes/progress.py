from fastapi import APIRouter, HTTPException, Header
from database import progress_collection
from auth import decode_access_token
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class ProgressUpdate(BaseModel):
    lesson_id: str
    score: int
    completed: bool = True

def get_user_id(authorization: str) -> str:
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload.get("sub")

@router.post("/progress")
async def save_progress(data: ProgressUpdate, authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    passed = data.score >= 4

    existing = await progress_collection.find_one({
        "user_id": user_id,
        "lesson_id": data.lesson_id
    })

    if existing:
        await progress_collection.update_one(
            {"user_id": user_id, "lesson_id": data.lesson_id},
            {"$set": {
                "score": data.score,
                "completed": passed,
                "completed_at": datetime.utcnow()
            }, "$inc": {"attempts": 1}}
        )
    else:
        await progress_collection.insert_one({
            "user_id": user_id,
            "lesson_id": data.lesson_id,
            "score": data.score,
            "completed": passed,
            "attempts": 1,
            "completed_at": datetime.utcnow()
        })

    return {"message": "Progress saved", "passed": passed}

@router.get("/progress")
async def get_progress(authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    cursor = progress_collection.find({"user_id": user_id})
    results = []
    async for doc in cursor:
        results.append({
            "lesson_id": doc["lesson_id"],
            "score": doc["score"],
            "completed": doc["completed"],
            "attempts": doc["attempts"],
            "completed_at": str(doc.get("completed_at", ""))
        })
    return results