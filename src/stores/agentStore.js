import { defineStore } from 'pinia';
import agentService from '../services/agentService';

export const useAgentStore = defineStore('agent', {
  state: () => ({
    isActive: false,
    isLoading: false,
    activeTask: null,
    currentAnalysis: null,
    jobMatchResult: null,
    contentSuggestions: [],
    templateRecommendation: null,
    optimizationResult: null,
    agentHistory: [],
    error: null,
    analysisError: null
  }),
  
  actions: {
    setActive(status) {
      this.isActive = status;
    },
    
    startTask(taskName) {
      this.isLoading = true;
      this.activeTask = taskName;
      this.error = null;
      
      // 记录任务启动到历史记录
      this.agentHistory.push({
        type: 'task-start',
        task: taskName,
        timestamp: new Date().toISOString()
      });
    },
    
    finishTask(result) {
      this.isLoading = false;
      this.activeTask = null;
      
      // 记录任务完成到历史记录
      this.agentHistory.push({
        type: 'task-complete',
        result: result ? 'success' : 'error',
        timestamp: new Date().toISOString()
      });
    },
    
    setError(error) {
      this.error = error;
      this.isLoading = false;
      
      // 记录错误到历史记录
      this.agentHistory.push({
        type: 'error',
        message: error,
        timestamp: new Date().toISOString()
      });
    },
    
    setAnalysisError(error) {
      this.analysisError = error;
      this.isLoading = false;
      
      // 记录分析错误到历史记录
      if (error) {
        this.agentHistory.push({
          type: 'analysis-error',
          message: error,
          timestamp: new Date().toISOString()
        });
      }
    },
    
    // 分析简历内容
    async analyzeResume(resumeData) {
      try {
        this.startTask('resume-analysis');
        
        // 添加验证，确保resumeData不为空
        if (!resumeData || typeof resumeData !== 'object') {
          throw new Error('简历数据无效或为空');
        }
        
        console.log('AgentStore: 开始分析简历', resumeData);
        const analysis = await agentService.analyzeResume(resumeData);
        
        // 验证分析结果
        if (!analysis || !analysis.completeness || !analysis.strengths || !analysis.suggestions) {
          throw new Error('收到无效的分析结果');
        }
        
        this.currentAnalysis = analysis;
        
        // 添加分析结果到历史记录
        this.agentHistory.push({
          type: 'analysis-result',
          completeness: analysis.completeness.percentage,
          timestamp: new Date().toISOString()
        });
        
        this.finishTask(true);
        return analysis;
      } catch (error) {
        console.error('AgentStore: 简历分析失败', error);
        this.setError(`简历分析失败: ${error.message}`);
        return null;
      }
    },
    
    // 生成职位匹配分析
    async generateJobMatch(resumeData, jobDescription) {
      try {
        this.startTask('job-match');
        const matchResult = await agentService.generateJobMatchSuggestions(resumeData, jobDescription);
        this.jobMatchResult = matchResult;
        
        // 添加匹配结果到历史记录
        this.agentHistory.push({
          type: 'job-match-result',
          matchScore: matchResult.match,
          timestamp: new Date().toISOString()
        });
        
        this.finishTask(true);
        return matchResult;
      } catch (error) {
        this.setError(`职位匹配分析失败: ${error.message}`);
        return null;
      }
    },
    
    // 获取内容建议
    async getContentSuggestions(section, experience) {
      try {
        this.startTask('content-suggestions');
        const suggestions = await agentService.generateContentSuggestions(section, experience);
        this.contentSuggestions = suggestions;
        
        // 添加建议生成到历史记录
        this.agentHistory.push({
          type: 'suggestions-generated',
          section: section,
          count: suggestions.length,
          timestamp: new Date().toISOString()
        });
        
        this.finishTask(true);
        return suggestions;
      } catch (error) {
        this.setError(`内容建议生成失败: ${error.message}`);
        return [];
      }
    },
    
    // 获取模板推荐
    async getTemplateRecommendation(resumeData) {
      try {
        this.startTask('template-recommendation');
        
        // 确保resumeData不为空
        if (!resumeData || typeof resumeData !== 'object') {
          console.error('无效的简历数据:', resumeData);
          this.setError('无效的简历数据');
          return null;
        }
        
        // 添加调试日志
        console.log('AgentStore: 获取模板推荐，简历数据类型:', typeof resumeData);
        
        const recommendation = await agentService.recommendTemplate(resumeData);
        
        // 检查推荐结果
        if (!recommendation) {
          console.error('模板推荐服务返回空结果');
          this.setError('模板推荐服务返回空结果');
          return null;
        }
        
        console.log('AgentStore: 获得模板推荐结果:', recommendation);
        
        // 设置推荐结果
        this.templateRecommendation = recommendation;
        
        // 添加推荐结果到历史记录
        this.agentHistory.push({
          type: 'template-recommended',
          template: recommendation.recommended,
          timestamp: new Date().toISOString()
        });
        
        this.finishTask(true);
        this.saveSessionToStorage();
        return recommendation;
      } catch (error) {
        console.error('模板推荐失败:', error);
        this.setError(`模板推荐失败: ${error.message || '未知错误'}`);
        return null;
      }
    },
    
    // 优化简历内容
    async optimizeResume(resumeData, targetJob) {
      try {
        this.startTask('resume-optimization');
        
        if (!resumeData || typeof resumeData !== 'object') {
          this.setError('无效的简历数据');
          return null;
        }
        
        if (!targetJob || !targetJob.title) {
          this.setError('请提供目标职位信息');
          return null;
        }
        
        const result = await agentService.optimizeResume(resumeData, targetJob);
        this.optimizationResult = result;
        
        // 添加优化结果到历史记录
        this.agentHistory.push({
          type: 'resume-optimized',
          changes: result.changes.length,
          timestamp: new Date().toISOString()
        });
        
        this.finishTask(true);
        this.saveSessionToStorage();
        return result;
      } catch (error) {
        this.setError(`简历优化失败: ${error.message || '未知错误'}`);
        return null;
      }
    },
    
    // 清除历史记录
    clearHistory() {
      this.agentHistory = [];
    },
    
    // 清除所有结果
    clearResults() {
      this.currentAnalysis = null;
      this.jobMatchResult = null;
      this.contentSuggestions = [];
      this.templateRecommendation = null;
      this.optimizationResult = null;
      this.error = null;
    },
    
    // 保存会话状态到本地存储
    saveSessionToStorage() {
      try {
        localStorage.setItem('agent-session', JSON.stringify({
          isActive: this.isActive,
          agentHistory: this.agentHistory,
          currentAnalysis: this.currentAnalysis,
          jobMatchResult: this.jobMatchResult,
          templateRecommendation: this.templateRecommendation
        }));
      } catch (error) {
        console.error('保存Agent会话失败:', error);
      }
    },
    
    // 从本地存储加载会话状态
    loadSessionFromStorage() {
      try {
        const sessionData = localStorage.getItem('agent-session');
        if (sessionData) {
          const data = JSON.parse(sessionData);
          this.isActive = data.isActive;
          this.agentHistory = data.agentHistory || [];
          this.currentAnalysis = data.currentAnalysis;
          this.jobMatchResult = data.jobMatchResult;
          this.templateRecommendation = data.templateRecommendation;
        }
      } catch (error) {
        console.error('加载Agent会话失败:', error);
      }
    }
  }
}); 