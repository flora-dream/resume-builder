from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api import resume_analysis
from app.core.config import settings
from app.core.logger import get_logger
import time

logger = get_logger("main")

app = FastAPI(
    title="AI简历助手API",
    description="AI简历助手后端服务",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(resume_analysis.router, prefix="/api/v1", tags=["resume"])

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(
        f"Method: {request.method} Path: {request.url.path} "
        f"Status: {response.status_code} Time: {process_time:.3f}s"
    )
    return response

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up AI Resume Assistant API")
    logger.info(f"OpenAI API Key configured: {'Yes' if settings.OPENAI_API_KEY else 'No'}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down AI Resume Assistant API") 