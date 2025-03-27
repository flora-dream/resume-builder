from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

class Settings(BaseModel):
    # API配置
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "AI简历助手"
    
    # CORS配置
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    # OpenAI配置
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # 模型配置
    DEFAULT_MODEL: str = "gpt-3.5-turbo"
    TEMPERATURE: float = 0.7
    
    class Config:
        case_sensitive = True

settings = Settings() 