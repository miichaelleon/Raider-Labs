from fastapi import APIRouter, HTTPException, Header, UploadFile, File
from database import users_collection, progress_collection, lessons_collection
from auth import decode_access_token, verify_password
from pydantic import BaseModel
from bson import ObjectId
import json

router = APIRouter()

def get_user_payload(authorization: str):
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload

@router.get("/admin/users")
async def get_all_users(authorization: str = Header(...)):
    payload = get_user_payload(authorization)
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    pipeline = [
        {
            "$addFields": {
                "user_id_str": {"$toString": "$_id"}
            }
        },
        {
            "$lookup": {
                "from": "progress",
                "let": {"uid": "$user_id_str"},
                "pipeline": [
                    {"$match": {
                        "$expr": {
                            "$and": [
                                {"$eq": ["$user_id", "$$uid"]},
                                {"$eq": ["$completed", True]}
                            ]
                        }
                    }},
                    {"$count": "count"}
                ],
                "as": "progress"
            }
        },
        {
            "$project": {
                "_id": 0,
                "id": "$user_id_str",
                "first_name": 1,
                "last_name": 1,
                "email": 1,
                "role": 1,
                "completed_lessons": {
                    "$ifNull": [{"$arrayElemAt": ["$progress.count", 0]}, 0]
                }
            }
        }
    ]

    users = []
    cursor = users_collection.aggregate(pipeline)
    async for u in cursor:
        users.append(u)
    return users

@router.get("/admin/users/{user_id}/progress")
async def get_user_progress(user_id: str, authorization: str = Header(...)):
    payload = get_user_payload(authorization)
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

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

class DeleteUserRequest(BaseModel):
    admin_password: str
 
@router.delete("/admin/users/{user_id}")
async def delete_user(
    user_id: str,
    body: DeleteUserRequest,
    authorization: str = Header(...)
):
    payload = get_user_payload(authorization)
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
 
    admin_id = payload.get("sub")
 
    if admin_id == user_id:
        raise HTTPException(status_code=400, detail="You cannot delete your own account")
 
    admin_record = await users_collection.find_one({"_id": ObjectId(admin_id)})
    if not admin_record:
        raise HTTPException(status_code=404, detail="Admin record not found")
 
    if not verify_password(body.admin_password, admin_record["password"]):
        raise HTTPException(status_code=401, detail="Incorrect admin password")
 
    target = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
 
    if target.get("role") == "admin":
        raise HTTPException(status_code=400, detail="Cannot delete another admin account")
 
    await users_collection.delete_one({"_id": ObjectId(user_id)})
    await progress_collection.delete_many({"user_id": user_id})
 
    return {"message": f"User {user_id} and all associated data deleted successfully"}
REQUIRED_FIELDS = {"id", "zone", "title", "tabs"}
REQUIRED_TABS   = {"showMe", "practice", "assess"}

@router.post("/admin/lessons")
async def upload_lesson(
    file: UploadFile = File(...),
    authorization: str = Header(...)
):
    payload = get_user_payload(authorization)
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    if not file.filename.lower().endswith(".json"):
        raise HTTPException(status_code=400, detail="Only .json files are accepted")

    try:
        contents = await file.read()
        lesson = json.loads(contents)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {e}")

    missing = REQUIRED_FIELDS - set(lesson.keys())
    if missing:
        raise HTTPException(status_code=422, detail=f"Missing required fields: {missing}")

    if not isinstance(lesson.get("id"), str) or not lesson["id"].strip():
        raise HTTPException(status_code=422, detail="'id' must be a non-empty string")

    tabs = lesson.get("tabs", {})
    missing_tabs = REQUIRED_TABS - set(tabs.keys())
    if missing_tabs:
        raise HTTPException(status_code=422, detail=f"Missing required tabs: {missing_tabs}")

    questions = tabs.get("assess", {}).get("questions", [])
    if not questions:
        raise HTTPException(status_code=422, detail="assess.questions must contain at least one question")
    for i, q in enumerate(questions):
        if "question" not in q or "options" not in q or "correct" not in q:
            raise HTTPException(status_code=422, detail=f"Question {i} is missing 'question', 'options', or 'correct'")
        if not isinstance(q["options"], list) or len(q["options"]) < 2:
            raise HTTPException(status_code=422, detail=f"Question {i} must have at least 2 options")
        if not isinstance(q["correct"], int) or q["correct"] >= len(q["options"]):
            raise HTTPException(status_code=422, detail=f"Question {i} has an invalid 'correct' index")

    lesson_id = lesson["id"].strip()

    existing = await lessons_collection.find_one({"id": lesson_id})
    if existing:
        await lessons_collection.replace_one({"id": lesson_id}, lesson)
        return {"message": f"Lesson '{lesson_id}' updated successfully", "action": "updated"}
    else:
        await lessons_collection.insert_one(lesson)
        return {"message": f"Lesson '{lesson_id}' uploaded successfully", "action": "created"}