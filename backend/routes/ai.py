from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from auth import decode_access_token
from anthropic import Anthropic
import os

router = APIRouter()
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class ChatMessage(BaseModel):
    message: str
    lesson_id: str
    lesson_title: str
    lesson_context: str
    history: list = []

def get_user_id(authorization: str) -> str:
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload.get("sub")

@router.post("/ai/chat")
async def chat(data: ChatMessage, authorization: str = Header(...)):
    get_user_id(authorization)

    system_prompt = f"""You are a friendly and patient Socratic tutor helping a student with autism learn financial literacy.

You are currently helping with lesson: {data.lesson_id} — {data.lesson_title}

Lesson context: {data.lesson_context}

Your guidelines:
- Use the Socratic method: ask guiding questions instead of giving direct answers
- Keep responses short, clear, and encouraging — 2-4 sentences max
- Use simple, concrete language — avoid jargon
- Be warm, patient, and positive
- If the student is stuck, give a small hint but still ask a question
- Never just give away the answer directly
- Celebrate correct thinking with brief positive reinforcement"""

    messages = data.history + [{"role": "user", "content": data.message}]

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=300,
        system=system_prompt,
        messages=messages
    )

    return {"response": response.content[0].text}