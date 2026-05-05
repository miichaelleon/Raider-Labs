from fastapi import APIRouter, HTTPException, Header
from database import lessons_collection
from auth import decode_access_token
from bson import ObjectId

router = APIRouter()

def get_user_id(authorization: str) -> str:
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload.get("sub")

def serialize_lesson(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc

@router.get("/lessons")
async def get_all_lessons(authorization: str = Header(...)):
    get_user_id(authorization)
    cursor = lessons_collection.find({})
    results = []
    async for doc in cursor:
        results.append({
            "id":    doc.get("id"),
            "zone":  doc.get("zone"),
            "title": doc.get("title"),
            "icon":  doc.get("icon", ""),
        })
    return results

@router.get("/lessons/{lesson_id}")
async def get_lesson(lesson_id: str, authorization: str = Header(...)):
    get_user_id(authorization)
    doc = await lessons_collection.find_one({"id": lesson_id})
    if not doc:
        raise HTTPException(status_code=404, detail=f"Lesson '{lesson_id}' not found")
    return serialize_lesson(doc)