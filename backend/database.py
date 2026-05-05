from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "your_mongodb_connection_string_here")

client = AsyncIOMotorClient(MONGO_URL, tlsAllowInvalidCertificates=True)

db = client.finlit_db

users_collection = db["users"]
lessons_collection = db["lessons"]
quizzes_collection = db["quizzes"]
progress_collection = db["progress"]
scores_collection = db["scores"]
conversations_collection = db["conversations"]