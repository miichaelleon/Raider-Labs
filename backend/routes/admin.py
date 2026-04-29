from fastapi import APIRouter, HTTPException, Header
from database import users_collection, progress_collection
from auth import decode_access_token

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