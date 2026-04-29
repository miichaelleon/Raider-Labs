from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.users import router as users_router
from routes.progress import router as progress_router
from routes.ai import router as ai_router
from routes.admin import router as admin_router

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://project-p4lhh.vercel.app", ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(progress_router)
app.include_router(ai_router)
app.include_router(admin_router)