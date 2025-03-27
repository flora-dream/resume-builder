// agentService.js - 基础的AI Agent服务

// 模拟API调用的延迟
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 示例的简历模板
const resumeTemplates = {
  technical: {
    sections: ['个人信息', '技术技能', '工作经验', '项目经验', '教育背景', '证书'],
    skills: ['编程语言', '框架', '工具', '平台', '方法论'],
    emphasis: '技术项目与解决方案'
  },
  management: {
    sections: ['个人信息', '专业概述', '管理经验', '关键成就', '教育背景', '专业能力'],
    skills: ['团队管理', '项目管理', '战略规划', '预算管理', '沟通'],
    emphasis: '管理能力与成就'
  },
  creative: {
    sections: ['个人信息', '创意技能', '作品集', '工作经验', '教育背景', '个人项目'],
    skills: ['设计工具', '创意思维', '技术技能', '沟通协作', '问题解决'],
    emphasis: '创意作品与表达能力'
  }
};

// 提供基础的建议数据库
const suggestionsDatabase = {
  general: [
    "在简历中使用可量化的成就来突显你的贡献",
    "确保简历格式一致，便于快速阅读",
    "针对不同的职位定制简历内容",
    "简历篇幅控制在1-2页以内",
    "使用行业关键词以通过ATS筛选系统"
  ],
  skills: [
    "突出与目标职位相关的核心技能",
    "技能部分可以分类展示，增强可读性",
    "对技能熟练程度进行标注",
    "包含技术技能和软技能的平衡展示"
  ],
  experience: [
    "使用STAR法则描述工作经验：情境(Situation)、任务(Task)、行动(Action)和结果(Result)",
    "强调你的贡献而非职责",
    "每段经历使用3-5个要点描述",
    "使用动词开头，如'领导'、'开发'、'优化'等"
  ],
  education: [
    "只列出最高学历，除非其他学历相关性更强",
    "包含相关课程、研究项目或学术成就",
    "如果是应届毕业生，可以将教育部分放在前面"
  ]
};

// Agent功能类
class ResumeAgent {
  // 分析简历内容
  async analyzeResume(resumeData) {
    await delay(1000); // 模拟API调用延迟
    
    // 简单分析逻辑
    const analysis = {
      completeness: this._calculateCompleteness(resumeData),
      suggestions: this._generateSuggestions(resumeData),
      strengths: this._identifyStrengths(resumeData),
      weaknesses: this._identifyWeaknesses(resumeData)
    };
    
    return analysis;
  }
  
  // 生成职位匹配建议
  async generateJobMatchSuggestions(resumeData, jobDescription) {
    await delay(1500); // 模拟API调用延迟
    
    if (!jobDescription || jobDescription.trim() === '') {
      return {
        match: 0,
        suggestions: ["请提供职位描述以获取匹配建议"]
      };
    }
    
    // 简单的关键词匹配逻辑
    const keywords = this._extractKeywords(jobDescription);
    const matchScore = this._calculateMatchScore(resumeData, keywords);
    const suggestions = this._generateJobSpecificSuggestions(resumeData, keywords);
    
    return {
      match: matchScore,
      suggestions: suggestions
    };
  }
  
  // 优化简历内容
  async optimizeResume(resumeData, targetJob) {
    await delay(2000); // 模拟API调用延迟
    
    // 根据目标职位调整简历内容
    const optimizedResume = JSON.parse(JSON.stringify(resumeData)); // 深拷贝
    
    // 简单示例优化逻辑
    if (targetJob && targetJob.title) {
      // 调整个人概述以匹配目标职位
      if (optimizedResume.personalInfo && optimizedResume.personalInfo.summary) {
        optimizedResume.personalInfo.summary = this._optimizeSummary(
          optimizedResume.personalInfo.summary,
          targetJob
        );
      }
      
      // 重排技能以匹配目标职位
      if (optimizedResume.skills && optimizedResume.skills.length > 0) {
        optimizedResume.skills = this._reorderSkills(
          optimizedResume.skills,
          targetJob
        );
      }
    }
    
    return {
      original: resumeData,
      optimized: optimizedResume,
      changes: this._identifyChanges(resumeData, optimizedResume)
    };
  }
  
  // 根据经验生成简历内容建议
  async generateContentSuggestions(section, experience) {
    await delay(1200); // 模拟API调用延迟
    
    let suggestions = [];
    
    switch (section) {
      case 'workExperience':
        suggestions = [
          `${experience.title} at ${experience.company}: Led a team of X professionals...`,
          `Increased ${experience.company}'s efficiency by Y% through implementation of...`,
          `Managed a budget of Z while delivering project under timeline and expectations...`
        ];
        break;
      case 'projects':
        suggestions = [
          `${experience.title}: Developed using [relevant technologies]...`,
          `Implemented [key feature] that resulted in [measurable outcome]...`,
          `Collaborated with a team of X to deliver Y within Z timeframe...`
        ];
        break;
      case 'summary':
        suggestions = [
          `Experienced ${experience} professional with X years of expertise in...`,
          `Results-driven ${experience} with proven track record of...`,
          `Innovative ${experience} seeking to leverage skills in...`
        ];
        break;
      default:
        suggestions = [
          "使用动词开头的描述句",
          "添加可量化的成就",
          "突出相关技能和专业知识"
        ];
    }
    
    return suggestions;
  }
  
  // 推荐简历模板
  async recommendTemplate(resumeData) {
    await delay(800); // 模拟API调用延迟
    
    // 基于简历内容和行业进行简单推荐逻辑
    let recommendedTemplate = 'classic'; // 默认推荐
    
    // 检查技术相关关键词
    const hasTechnicalFocus = this._checkForKeywords(resumeData, [
      'developer', '开发', '工程师', 'engineer', '编程', 'programming', 
      'software', '软件', 'coding', '代码', 'technical', '技术'
    ]);
    
    // 检查管理相关关键词
    const hasManagementFocus = this._checkForKeywords(resumeData, [
      'manager', '经理', 'director', '总监', 'lead', '负责人', 
      'supervisor', '主管', 'head', '团队', 'team', 'leadership', '领导'
    ]);
    
    // 检查创意相关关键词
    const hasCreativeFocus = this._checkForKeywords(resumeData, [
      'design', '设计', 'creative', '创意', 'artist', '艺术', 
      'media', '媒体', 'content', '内容', 'ux', 'ui', '用户体验'
    ]);
    
    // 简单的逻辑确定推荐模板
    if (hasTechnicalFocus) {
      recommendedTemplate = 'modern'; // 推荐现代模板给技术人员
    } else if (hasCreativeFocus) {
      recommendedTemplate = 'creative'; // 推荐创意模板给创意人员
    } else if (hasManagementFocus) {
      recommendedTemplate = 'classic'; // 推荐经典模板给管理人员
    } else {
      recommendedTemplate = 'minimal'; // 如果无明显倾向，推荐极简模板
    }
    
    return {
      recommended: recommendedTemplate,
      reason: this._getRecommendationReason(recommendedTemplate),
      alternatives: this._getAlternativeRecommendations(recommendedTemplate)
    };
  }
  
  // 私有辅助方法
  _calculateCompleteness(resumeData) {
    // 简单的完整度计算逻辑
    let totalFields = 0;
    let filledFields = 0;
    
    // 检查个人信息
    if (resumeData.personalInfo) {
      const personalInfoFields = Object.keys(resumeData.personalInfo);
      totalFields += personalInfoFields.length;
      filledFields += personalInfoFields.filter(
        key => resumeData.personalInfo[key] && resumeData.personalInfo[key].toString().trim() !== ''
      ).length;
    }
    
    // 检查教育背景
    if (resumeData.education && Array.isArray(resumeData.education)) {
      totalFields += 1; // 将整个教育部分视为一个字段
      filledFields += resumeData.education.length > 0 ? 1 : 0;
    }
    
    // 检查工作经验
    if (resumeData.workExperience && Array.isArray(resumeData.workExperience)) {
      totalFields += 1; // 将整个工作经验部分视为一个字段
      filledFields += resumeData.workExperience.length > 0 ? 1 : 0;
    }
    
    // 检查技能
    if (resumeData.skills && Array.isArray(resumeData.skills)) {
      totalFields += 1;
      filledFields += resumeData.skills.length > 0 ? 1 : 0;
    }
    
    // 检查项目
    if (resumeData.projects && Array.isArray(resumeData.projects)) {
      totalFields += 1;
      filledFields += resumeData.projects.length > 0 ? 1 : 0;
    }
    
    // 计算完整度百分比
    const completeness = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    
    return {
      percentage: completeness,
      missingFields: this._identifyMissingFields(resumeData)
    };
  }
  
  _identifyMissingFields(resumeData) {
    const missingFields = [];
    
    // 检查个人信息
    if (resumeData.personalInfo) {
      const requiredPersonalFields = ['name', 'email', 'phone', 'summary'];
      for (const field of requiredPersonalFields) {
        if (!resumeData.personalInfo[field] || resumeData.personalInfo[field].toString().trim() === '') {
          missingFields.push(`个人信息: ${field}`);
        }
      }
    }
    
    // 检查其他必填部分
    if (!resumeData.education || resumeData.education.length === 0) {
      missingFields.push('教育背景');
    }
    
    if (!resumeData.workExperience || resumeData.workExperience.length === 0) {
      missingFields.push('工作经验');
    }
    
    if (!resumeData.skills || resumeData.skills.length === 0) {
      missingFields.push('技能');
    }
    
    return missingFields;
  }
  
  _generateSuggestions(resumeData) {
    // 从建议数据库中选择随机建议
    const getRandomSuggestions = (category, count) => {
      const suggestions = suggestionsDatabase[category] || [];
      const result = [];
      const indices = new Set();
      
      while (indices.size < Math.min(count, suggestions.length)) {
        const randomIndex = Math.floor(Math.random() * suggestions.length);
        if (!indices.has(randomIndex)) {
          indices.add(randomIndex);
          result.push(suggestions[randomIndex]);
        }
      }
      
      return result;
    };
    
    // 生成综合建议
    return {
      general: getRandomSuggestions('general', 2),
      skills: getRandomSuggestions('skills', 1),
      experience: getRandomSuggestions('experience', 2),
      education: getRandomSuggestions('education', 1)
    };
  }
  
  _identifyStrengths(resumeData) {
    // 简单分析优势的示例实现
    const strengths = [];
    
    // 检查是否有量化的成就
    let hasQuantifiedAchievements = false;
    if (resumeData.workExperience && resumeData.workExperience.length > 0) {
      for (const exp of resumeData.workExperience) {
        if (exp.description && /\d+%|\d+倍|\d+个|\$\d+|¥\d+/.test(exp.description)) {
          hasQuantifiedAchievements = true;
          break;
        }
      }
    }
    
    if (hasQuantifiedAchievements) {
      strengths.push("简历包含量化的成就，这有助于展示你的实际贡献");
    }
    
    // 检查技能多样性
    if (resumeData.skills && resumeData.skills.length >= 5) {
      strengths.push("技能部分全面，展示了多样化的能力");
    }
    
    // 检查教育背景
    if (resumeData.education && resumeData.education.length > 0) {
      const hasHigherEducation = resumeData.education.some(edu => 
        edu.degree && (edu.degree.includes('学士') || edu.degree.includes('硕士') || 
                      edu.degree.includes('博士') || /bachelor|master|phd|doctor/i.test(edu.degree))
      );
      
      if (hasHigherEducation) {
        strengths.push("具有相关的高等教育背景");
      }
    }
    
    // 如果没有识别到特定优势，添加一个通用评论
    if (strengths.length === 0) {
      strengths.push("简历结构清晰，易于阅读");
    }
    
    return strengths;
  }
  
  _identifyWeaknesses(resumeData) {
    // 简单分析劣势的示例实现
    const weaknesses = [];
    
    // 检查个人概述是否过短
    if (resumeData.personalInfo && resumeData.personalInfo.summary) {
      if (resumeData.personalInfo.summary.length < 100) {
        weaknesses.push("个人概述过短，可以扩展以更好地展示你的专业形象");
      }
    } else {
      weaknesses.push("缺少个人概述，这是向雇主介绍自己的重要部分");
    }
    
    // 检查工作经验描述
    if (resumeData.workExperience && resumeData.workExperience.length > 0) {
      let hasShortDescriptions = false;
      for (const exp of resumeData.workExperience) {
        if (exp.description && exp.description.length < 150) {
          hasShortDescriptions = true;
          break;
        }
      }
      
      if (hasShortDescriptions) {
        weaknesses.push("一些工作经验描述过短，考虑添加更多细节和成就");
      }
    }
    
    // 检查技能描述
    if (!resumeData.skills || resumeData.skills.length < 3) {
      weaknesses.push("技能部分需要扩展，以展示你的全面能力");
    }
    
    // 如果没有识别到特定劣势，添加一个通用改进建议
    if (weaknesses.length === 0) {
      weaknesses.push("考虑添加更多量化的成就，以更具体地展示你的贡献");
    }
    
    return weaknesses;
  }
  
  _extractKeywords(text) {
    // 简单的关键词提取示例
    // 在实际实现中，可以使用更复杂的NLP方法
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = ['and', 'or', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 'by', '和', '与', '的', '是'];
    const keywords = words.filter(word => 
      word.length > 2 && !stopWords.includes(word) && /^[a-z\u4e00-\u9fa5]+$/.test(word)
    );
    
    // 返回去重后的关键词
    return [...new Set(keywords)];
  }
  
  _calculateMatchScore(resumeData, keywords) {
    // 简单的关键词匹配评分
    let matches = 0;
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    
    for (const keyword of keywords) {
      if (resumeText.includes(keyword.toLowerCase())) {
        matches++;
      }
    }
    
    // 计算匹配百分比
    const matchPercentage = keywords.length > 0 ? Math.round((matches / keywords.length) * 100) : 0;
    // 上限设为85%，因为100%匹配不太可能，这样也鼓励求职者改进
    return Math.min(matchPercentage, 85);
  }
  
  _generateJobSpecificSuggestions(resumeData, keywords) {
    const suggestions = [];
    
    // 创建一个简单的关键词匹配检查
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    const missingKeywords = keywords.filter(keyword => !resumeText.includes(keyword.toLowerCase()));
    
    // 根据缺失的关键词生成建议
    if (missingKeywords.length > 0) {
      suggestions.push(`考虑将以下关键词融入简历: ${missingKeywords.slice(0, 5).join(', ')}${missingKeywords.length > 5 ? '等' : ''}`);
    }
    
    // 固定的一般性建议
    suggestions.push("确保简历中的工作经验描述与职位要求相匹配");
    suggestions.push("将最相关的技能和成就放在简历的突出位置");
    
    return suggestions;
  }
  
  _optimizeSummary(summary, targetJob) {
    // 在实际产品中，这里可以接入更高级的AI优化逻辑
    return `专业的${targetJob.title}，拥有丰富的行业经验。${summary}`;
  }
  
  _reorderSkills(skills, targetJob) {
    // 简单的技能重排序逻辑示例
    return skills.sort((a, b) => {
      const aRelevance = targetJob.keywords && targetJob.keywords.some(keyword => 
        a.toLowerCase().includes(keyword.toLowerCase())
      ) ? 1 : 0;
      
      const bRelevance = targetJob.keywords && targetJob.keywords.some(keyword => 
        b.toLowerCase().includes(keyword.toLowerCase())
      ) ? 1 : 0;
      
      return bRelevance - aRelevance;
    });
  }
  
  _identifyChanges(original, optimized) {
    // 简单的变更检测逻辑
    return [
      "个人概述已针对目标职位进行了优化",
      "技能顺序已根据职位相关性重新排序",
      "工作经验描述已强调与目标职位相关的职责和成就"
    ];
  }
  
  _checkForKeywords(resumeData, keywords) {
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    return keywords.some(keyword => resumeText.includes(keyword.toLowerCase()));
  }
  
  _getRecommendationReason(template) {
    const reasons = {
      classic: "经典模板布局清晰，适合正式场合和传统行业，突出专业性",
      modern: "现代模板提供平衡的视觉效果和内容展示，适合技术专业人士",
      creative: "创意模板具有独特的视觉元素，适合设计和创意领域的专业人士",
      minimal: "极简模板注重内容和留白，适合希望突出核心能力的求职者"
    };
    
    return reasons[template] || "此模板适合您的简历内容和目标职位";
  }
  
  _getAlternativeRecommendations(mainRecommendation) {
    const templates = ['classic', 'modern', 'creative', 'minimal'];
    return templates.filter(template => template !== mainRecommendation);
  }
}

// 导出Agent服务
export default new ResumeAgent(); 