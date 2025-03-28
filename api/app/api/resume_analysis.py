from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from app.models.resume import ResumeData, ResumeAnalysis
from app.services.resume_analysis import ResumeAnalysisService
from app.core.config import settings
from app.core.logger import get_logger
import json
import traceback
from pydantic import ValidationError

logger = get_logger("resume_analysis_api")
router = APIRouter()
resume_service = ResumeAnalysisService()

@router.post("/analyze", response_model=ResumeAnalysis)
async def analyze_resume(request: Request, resume_data: ResumeData) -> ResumeAnalysis:
    """
    分析简历内容，提供完整度评估和改进建议
    """
    try:
        # 记录请求信息
        try:
            body = await request.body()
            body_str = body.decode('utf-8')
            logger.info(f"Received resume analysis request with raw data: {body_str}")
        except Exception as e:
            logger.warning(f"Error logging request body: {str(e)}")
            
        # 检查OpenAI API密钥
        if not settings.OPENAI_API_KEY:
            logger.error("OpenAI API key not configured")
            return JSONResponse(
                status_code=500,
                content={"detail": "OpenAI API密钥未配置"}
            )
        
        # 记录转换后的Pydantic模型
        try:
            logger.info(f"Parsed resume data: {resume_data.dict(exclude_none=True)}")
        except Exception as e:
            logger.warning(f"Error logging resume data: {str(e)}")
        
        # 验证简历数据
        resume_dict = resume_data.dict(exclude_none=True)
        if not resume_dict or (
            not resume_dict.get('basic_info') and 
            not resume_dict.get('education') and
            not resume_dict.get('experience') and
            not resume_dict.get('skills')
        ):
            logger.warning("Empty or minimal resume data received")
            return JSONResponse(
                status_code=400,
                content={"detail": "简历数据不足以进行分析"}
            )
        
        # 调用简历分析服务
        logger.info("Starting resume analysis service")
        analysis = resume_service.analyze_resume(resume_data)
        logger.info("Resume analysis completed successfully")
        
        # 验证分析结果
        if not analysis or not hasattr(analysis, 'completeness'):
            logger.error("Invalid analysis result returned from service")
            return JSONResponse(
                status_code=500,
                content={"detail": "分析服务返回无效结果"}
            )
            
        return analysis
        
    except HTTPException as he:
        logger.error(f"HTTP error in resume analysis: {str(he)}")
        return JSONResponse(
            status_code=he.status_code,
            content={"detail": he.detail}
        )
    except ValueError as ve:
        logger.error(f"Value error in resume analysis: {str(ve)}")
        return JSONResponse(
            status_code=422,
            content={"detail": f"数据验证失败: {str(ve)}"}
        )
    except Exception as e:
        # 记录详细的异常信息，包括堆栈跟踪
        error_stack = traceback.format_exc()
        logger.error(f"Unexpected error in resume analysis: {str(e)}")
        logger.error(f"Error stack trace: {error_stack}")
        
        return JSONResponse(
            status_code=500,
            content={"detail": f"简历分析失败: {str(e)}"}
        )

@router.post("/validate-data")
async def validate_resume_data(request: Request):
    """
    验证简历数据格式，用于调试API
    """
    try:
        body = await request.body()
        body_str = body.decode('utf-8')
        logger.info(f"Validating data: {body_str}")
        
        # 尝试解析JSON
        body_json = json.loads(body_str)
        
        # 尝试使用Pydantic模型验证
        try:
            resume_data = ResumeData(**body_json)
            result = {
                "valid": True,
                "parsed_data": resume_data.dict(exclude_none=True)
            }
            return JSONResponse(status_code=200, content=result)
        except ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            result = {
                "valid": False,
                "errors": e.errors(),
                "received_data": body_json
            }
            return JSONResponse(status_code=422, content=result)
            
    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error: {str(e)}")
        return JSONResponse(
            status_code=400,
            content={"detail": f"无效的JSON数据: {str(e)}"}
        )
    except Exception as e:
        logger.error(f"Unexpected error in validation: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": f"验证失败: {str(e)}"}
        ) 