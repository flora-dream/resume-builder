from typing import List, Dict
import openai
import json
import os
from app.models.resume import ResumeData, ResumeAnalysis
from app.core.config import settings

class ResumeAnalysisService:
    def __init__(self):
        # 初始化OpenAI客户端
        openai.api_key = settings.OPENAI_API_KEY
        
        # 设置API基础URL
        if os.getenv("OPENAI_API_BASE"):
            openai.api_base = os.getenv("OPENAI_API_BASE")
            
        # 设置超时时间
        openai.timeout = 30
        openai.max_retries = 2
        
        # 设置代理 - 如果需要可以取消注释并配置
        # openai.proxy = "http://127.0.0.1:7890"  # 使用本地代理

    def analyze_resume(self, resume_data: ResumeData) -> ResumeAnalysis:
        try:
            # 构建提示词
            prompt = self._build_analysis_prompt(resume_data)

            # 调用OpenAI API
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "你是一个专业的简历分析专家，请根据提供的简历信息进行分析。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                request_timeout=30  # 设置请求超时时间为30秒
            )

            # 解析响应
            analysis = self._parse_analysis_response(response.choices[0].message.content)
            return analysis
        except Exception as e:
            # 记录错误并返回默认响应
            print(f"简历分析出错: {str(e)}")
            return ResumeAnalysis(
                completeness={"percentage": 0, "missingFields": ["API调用失败"]},
                strengths=["无法分析"],
                suggestions={
                    "general": [f"分析失败: {str(e)}"],
                    "experience": [],
                    "skills": [],
                    "education": []
                }
            )

    def _build_analysis_prompt(self, resume_data: ResumeData) -> str:
        prompt = "请分析以下简历信息，并提供以下方面的分析：\n\n"

        # 添加基本信息
        if resume_data.basic_info:
            prompt += "基本信息：\n"
            for key, value in resume_data.basic_info.items():
                prompt += f"{key}: {value}\n"
            prompt += "\n"

        # 添加教育经历
        if resume_data.education:
            prompt += "教育经历：\n"
            for edu in resume_data.education:
                prompt += f"- {edu.get('school', '')} {edu.get('degree', '')} {edu.get('major', '')}\n"
            prompt += "\n"

        # 添加工作经验
        if resume_data.experience:
            prompt += "工作经验：\n"
            for exp in resume_data.experience:
                prompt += f"- {exp.get('company', '')} {exp.get('position', '')} {exp.get('period', '')}\n"
                prompt += f"  {exp.get('description', '')}\n"
            prompt += "\n"

        # 添加技能
        if resume_data.skills:
            prompt += "技能：\n"
            prompt += ", ".join(resume_data.skills) + "\n\n"

        # 添加项目经历
        if resume_data.projects:
            prompt += "项目经历：\n"
            for proj in resume_data.projects:
                prompt += f"- {proj.get('name', '')}\n"
                prompt += f"  {proj.get('description', '')}\n"
            prompt += "\n"

        prompt += """
请提供以下分析：
1. 简历完整度（百分比）和缺失的关键信息
2. 简历的主要优势
3. 改进建议（包括一般建议、工作经验建议、技能建议和教育背景建议）

请以JSON格式返回，格式如下：
{
    "completeness": {
        "percentage": 85,
        "missingFields": ["期望薪资", "工作地点"]
    },
    "strengths": ["优势1", "优势2"],
    "suggestions": {
        "general": ["建议1", "建议2"],
        "experience": ["建议1", "建议2"],
        "skills": ["建议1", "建议2"],
        "education": ["建议1", "建议2"]
    }
}
"""
        return prompt

    def _parse_analysis_response(self, response_text: str) -> ResumeAnalysis:
        try:
            # 尝试解析JSON响应
            data = json.loads(response_text)
            return ResumeAnalysis(
                completeness=data.get("completeness", {"percentage": 0, "missingFields": []}),
                strengths=data.get("strengths", []),
                suggestions=data.get("suggestions", {
                    "general": ["请重试"],
                    "experience": [],
                    "skills": [],
                    "education": []
                })
            )
        except Exception as e:
            # 解析失败时返回默认值
            return ResumeAnalysis(
                completeness={"percentage": 0, "missingFields": ["解析失败"]},
                strengths=["解析失败"],
                suggestions={
                    "general": ["解析响应时出错"],
                    "experience": [],
                    "skills": [],
                    "education": []
                }
            ) 