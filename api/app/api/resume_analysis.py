from fastapi import APIRouter, HTTPException, Depends
from app.models.resume import ResumeData, ResumeAnalysis
from app.services.resume_analysis import ResumeAnalysisService
from app.core.config import settings
from app.core.logger import get_logger

logger = get_logger("resume_analysis_api")
router = APIRouter()
resume_service = ResumeAnalysisService()

@router.post("/analyze", response_model=ResumeAnalysis)
async def analyze_resume(resume_data: ResumeData) -> ResumeAnalysis:
    """
    分析简历内容，提供完整度评估和改进建议
    """
    try:
        logger.info("Received resume analysis request")
        
        # 检查OpenAI API密钥
        if not settings.OPENAI_API_KEY:
            logger.error("OpenAI API key not configured")
            raise HTTPException(
                status_code=500,
                detail="OpenAI API密钥未配置"
            )
        
        # 检查简历数据是否为空
        if not resume_data.dict(exclude_none=True):
            logger.warning("Empty resume data received")
            raise HTTPException(
                status_code=400,
                detail="简历数据不能为空"
            )
        
        # 调用简历分析服务
        logger.info("Starting resume analysis service")
        analysis = resume_service.analyze_resume(resume_data)
        logger.info("Resume analysis completed successfully")
        return analysis
        
    except HTTPException as he:
        logger.error(f"HTTP error in resume analysis: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in resume analysis: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"简历分析失败: {str(e)}"
        ) 