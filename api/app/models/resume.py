from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ResumeAnalysis(BaseModel):
    completeness: Dict[str, Any]
    strengths: List[str]
    suggestions: Dict[str, List[str]]

class ResumeData(BaseModel):
    basic_info: Optional[Dict[str, str]] = None
    education: Optional[List[Dict[str, str]]] = None
    experience: Optional[List[Dict[str, str]]] = None
    skills: Optional[List[str]] = None
    projects: Optional[List[Dict[str, str]]] = None
    certificates: Optional[List[Dict[str, str]]] = None
    languages: Optional[List[Dict[str, str]]] = None
    interests: Optional[List[str]] = None 