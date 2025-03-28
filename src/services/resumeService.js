// 简历分析服务
import axios from 'axios';

// 创建API客户端
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000 // 设置超时为60秒
});

// 转换简历数据格式，将前端数据格式转换为后端API所需格式
function transformResumeData(resumeData) {
  // 确保数据非空且格式正确
  if (!resumeData || typeof resumeData !== 'object') {
    console.error('无效的简历数据');
    return {};
  }

  try {
    // 转换基本信息 - 确保所有值都是字符串
    const basic_info = {};
    if (resumeData.personalInfo) {
      Object.entries(resumeData.personalInfo).forEach(([key, value]) => {
        // 跳过avatar字段，它可能是二进制数据
        if (key !== 'avatar') {
          basic_info[key] = value ? String(value) : "";
        }
      });
    }

    // 转换教育经历 - 确保所有值都是字符串
    const education = (resumeData.education || []).map(edu => {
      const result = {};
      Object.entries(edu).forEach(([key, value]) => {
        result[key] = value ? String(value) : "";
      });
      return result;
    });

    // 转换工作经验 - 确保所有值都是字符串
    const experience = (resumeData.workExperience || []).map(exp => {
      const result = {};
      Object.entries(exp).forEach(([key, value]) => {
        result[key] = value ? String(value) : "";
      });
      return result;
    });

    // 转换项目经历 - 确保所有值都是字符串
    const projects = (resumeData.projects || []).map(proj => {
      const result = {};
      Object.entries(proj).forEach(([key, value]) => {
        result[key] = value ? String(value) : "";
      });
      return result;
    });

    // 证书 - 确保所有值都是字符串
    const certificates = (resumeData.certifications || []).map(cert => {
      const result = {};
      Object.entries(cert).forEach(([key, value]) => {
        result[key] = value ? String(value) : "";
      });
      return result;
    });

    // 技能 - 确保是字符串数组
    const skills = Array.isArray(resumeData.skills) 
      ? resumeData.skills.map(skill => String(skill || ""))
      : [];

    // 语言 - 添加缺失的字段
    const languages = [];

    // 兴趣爱好 - 添加缺失的字段
    const interests = [];

    // 返回后端API期望的精确格式
    return {
      basic_info,
      education,
      experience,
      skills,
      projects,
      certificates,
      languages,
      interests
    };
  } catch (error) {
    console.error('转换简历数据时出错:', error);
    // 返回一个最小化的有效对象，避免验证错误
    return {
      basic_info: {},
      education: [],
      experience: [],
      skills: [],
      projects: [],
      certificates: [],
      languages: [],
      interests: []
    };
  }
}

// 添加测试验证方法
async function validateResumeData(resumeData) {
  try {
    const transformedData = transformResumeData(resumeData);
    console.log('验证请求数据:', JSON.stringify(transformedData));
    
    const response = await apiClient.post('/validate-data', transformedData);
    console.log('验证结果:', response.data);
    return response.data;
  } catch (error) {
    console.error('数据验证失败:', error);
    if (error.response) {
      console.error('错误状态码:', error.response.status);
      console.error('错误响应数据:', error.response.data);
      return error.response.data;
    }
    throw error;
  }
}

// 简历分析服务
export default {
  // 添加这个方法，使其可以从组件中调用
  testConnection: async (resumeData) => {
    return validateResumeData(resumeData);
  },
  
  // 分析简历
  async analyzeResume(resumeData) {
    try {
      // 首先验证数据格式
      try {
        await validateResumeData(resumeData);
      } catch (e) {
        console.warn('数据验证异常，但仍继续尝试分析', e);
      }
      
      // 转换数据格式
      const transformedData = transformResumeData(resumeData);
      
      // 数据验证，确保至少有一些有效数据
      if (!transformedData.basic_info || Object.keys(transformedData.basic_info).length === 0) {
        console.warn('简历基本信息为空');
      }
      
      // 添加调试日志
      console.log('正在发送简历分析请求:', JSON.stringify(transformedData));
      
      // 调用API
      const response = await apiClient.post('/analyze', transformedData);
      
      // 返回分析结果
      console.log('简历分析结果:', response.data);
      return response.data;
    } catch (error) {
      console.error('简历分析请求失败:', error);
      // 记录详细错误信息
      if (error.response) {
        // 服务器返回了错误响应
        console.error('错误状态码:', error.response.status);
        console.error('错误响应数据:', error.response.data);
      } else if (error.request) {
        // 请求已发送但没有收到响应
        console.error('未收到响应:', error.request);
      } else {
        // 其他错误
        console.error('错误信息:', error.message);
      }
      
      // 如果有响应，尝试返回服务器错误信息
      if (error.response && error.response.data) {
        throw new Error(error.response.data.detail || '简历分析失败');
      }
      // 否则返回通用错误
      throw new Error('简历分析服务暂时不可用，请稍后再试');
    }
  }
}; 