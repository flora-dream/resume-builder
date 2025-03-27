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
    error: null
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
    
    // 分析简历内容
    async analyzeResume(resumeData) {
      try {
        this.startTask('resume-analysis');
        const analysis = await agentService.analyzeResume(resumeData);
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
        const recommendation = await agentService.recommendTemplate(resumeData);
        this.templateRecommendation = recommendation;
        
        // 添加推荐结果到历史记录
        this.agentHistory.push({
          type: 'template-recommended',
          template: recommendation.recommended,
          timestamp: new Date().toISOString()
        });
        
        this.finishTask(true);
        return recommendation;
      } catch (error) {
        this.setError(`模板推荐失败: ${error.message}`);
        return null;
      }
    },
    
    // 优化简历内容
    async optimizeResume(resumeData, targetJob) {
      try {
        this.startTask('resume-optimization');
        const result = await agentService.optimizeResume(resumeData, targetJob);
        this.optimizationResult = result;
        
        // 添加优化结果到历史记录
        this.agentHistory.push({
          type: 'resume-optimized',
          changes: result.changes.length,
          timestamp: new Date().toISOString()
        });
        
        this.finishTask(true);
        return result;
      } catch (error) {
        this.setError(`简历优化失败: ${error.message}`);
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