<template>
  <div class="agent-assistant-container" :class="{ 'agent-active': isActive }">
    <div class="agent-header" @click="toggleAgent">
      <div class="agent-title">
        <el-icon><MagicStick /></el-icon>
        <span>AI简历助手</span>
      </div>
      <el-button
        size="small"
        :icon="isActive ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
        circle
        plain
      ></el-button>
    </div>
    
    <div v-if="isActive" class="agent-content">
      <div v-if="isLoading" class="agent-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>正在{{ getTaskName() }}...</span>
      </div>
      
      <div v-else-if="error" class="agent-error">
        <el-icon><Warning /></el-icon>
        <span>{{ error }}</span>
        <el-button size="small" type="text" @click="clearError">重试</el-button>
      </div>
      
      <div v-else class="agent-features">
        <template v-if="!currentSection">
          <div class="feature-intro">
            <h3>AI简历助手可以帮助你：</h3>
            <ul>
              <li>分析简历完整度和质量</li>
              <li>根据目标职位匹配度评估</li>
              <li>生成针对性的内容建议</li>
              <li>智能推荐最适合的简历模板</li>
              <li>自动优化简历内容</li>
            </ul>
          </div>
          
          <div class="feature-buttons">
            <el-button 
              type="primary" 
              plain 
              @click="startAnalysis"
              :disabled="isLoading"
            >
              <el-icon><DataAnalysis /></el-icon>
              简历分析
            </el-button>
            
            <el-button 
              type="primary" 
              plain 
              @click="showJobMatchSection"
              :disabled="isLoading"
            >
              <el-icon><Link /></el-icon>
              职位匹配度
            </el-button>
            
            <el-button 
              type="primary" 
              plain 
              @click="showTemplateRecommendation"
              :disabled="isLoading"
            >
              <el-icon><Star /></el-icon>
              模板推荐
            </el-button>
            
            <el-button 
              type="primary" 
              plain 
              @click="showOptimizationSection"
              :disabled="isLoading"
            >
              <el-icon><MagicStick /></el-icon>
              简历优化
            </el-button>
          </div>
        </template>
        
        <!-- 简历分析结果 -->
        <div v-else-if="currentSection === 'analysis'" class="agent-section analysis-section">
          <div class="section-header">
            <h3>简历分析</h3>
            <el-button size="small" text @click="backToMain">返回</el-button>
          </div>
          
          <div v-if="currentAnalysis" class="section-content">
            <div class="completeness-chart">
              <el-progress 
                type="circle" 
                :percentage="currentAnalysis.completeness.percentage" 
                :status="getCompletenessStatus(currentAnalysis.completeness.percentage)"
              />
              <span>简历完整度</span>
            </div>
            
            <div class="analysis-details">
              <template v-if="currentAnalysis.completeness.missingFields.length > 0">
                <h4>缺失的关键信息:</h4>
                <ul class="missing-fields">
                  <li v-for="(field, index) in currentAnalysis.completeness.missingFields" :key="index">
                    {{ field }}
                  </li>
                </ul>
              </template>
              
              <h4>简历优势:</h4>
              <ul class="strengths-list">
                <li v-for="(strength, index) in currentAnalysis.strengths" :key="index">
                  {{ strength }}
                </li>
              </ul>
              
              <h4>改进建议:</h4>
              <ul class="suggestions-list">
                <li v-for="(suggestion, index) in currentAnalysis.suggestions.general" :key="'g'+index">
                  {{ suggestion }}
                </li>
                <li v-for="(suggestion, index) in currentAnalysis.suggestions.experience" :key="'e'+index">
                  {{ suggestion }}
                </li>
                <li v-for="(suggestion, index) in currentAnalysis.suggestions.skills" :key="'s'+index">
                  {{ suggestion }}
                </li>
                <li v-for="(suggestion, index) in currentAnalysis.suggestions.education" :key="'ed'+index">
                  {{ suggestion }}
                </li>
              </ul>
              
              <div class="analysis-actions">
                <el-button type="primary" @click="showOptimizationSection">优化简历</el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 职位匹配度分析 -->
        <div v-else-if="currentSection === 'job-match'" class="agent-section job-match-section">
          <div class="section-header">
            <h3>职位匹配度分析</h3>
            <el-button size="small" text @click="backToMain">返回</el-button>
          </div>
          
          <div class="section-content">
            <el-form v-if="!jobMatchResult" @submit.prevent="analyzeJobMatch">
              <el-form-item label="职位描述">
                <el-input 
                  v-model="jobDescription" 
                  type="textarea" 
                  :rows="5" 
                  placeholder="请粘贴目标职位的描述..."
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="analyzeJobMatch" :disabled="!jobDescription.trim()">
                  分析匹配度
                </el-button>
              </el-form-item>
            </el-form>
            
            <div v-else class="match-result">
              <div class="match-score">
                <el-progress 
                  type="dashboard" 
                  :percentage="jobMatchResult.match" 
                  :color="getMatchColor(jobMatchResult.match)"
                />
                <span>匹配度</span>
              </div>
              
              <div class="match-suggestions">
                <h4>如何提高与职位的匹配度:</h4>
                <ul>
                  <li v-for="(suggestion, index) in jobMatchResult.suggestions" :key="index">
                    {{ suggestion }}
                  </li>
                </ul>
                
                <div class="match-actions">
                  <el-button type="primary" @click="jobMatchResult = null">重新分析</el-button>
                  <el-button @click="optimizeForJob">针对此职位优化简历</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 模板推荐 -->
        <div v-else-if="currentSection === 'template-recommendation'" class="agent-section template-section">
          <div class="section-header">
            <h3>模板推荐</h3>
            <el-button size="small" text @click="backToMain">返回</el-button>
          </div>
          
          <div v-if="templateRecommendation" class="section-content">
            <div class="recommendation-main">
              <h4>推荐模板: {{ getTemplateName(templateRecommendation.recommended) }}</h4>
              <p class="recommendation-reason">{{ templateRecommendation.reason }}</p>
              
              <el-button 
                type="primary" 
                @click="applyRecommendedTemplate(templateRecommendation.recommended)"
              >
                应用此模板
              </el-button>
            </div>
            
            <div class="alternative-templates">
              <h4>其他可选模板:</h4>
              <div class="template-options">
                <div 
                  v-for="template in templateRecommendation.alternatives" 
                  :key="template"
                  class="template-option"
                  @click="applyRecommendedTemplate(template)"
                >
                  <div class="template-preview">
                    <img :src="`/templates/${template}-thumb.png`" :alt="template" 
                      onerror="this.src='/templates/default-thumb.png'">
                  </div>
                  <span>{{ getTemplateName(template) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 简历优化 -->
        <div v-else-if="currentSection === 'optimization'" class="agent-section optimization-section">
          <div class="section-header">
            <h3>简历优化</h3>
            <el-button size="small" text @click="backToMain">返回</el-button>
          </div>
          
          <div class="section-content">
            <template v-if="!optimizationResult">
              <el-form @submit.prevent="startOptimization">
                <el-form-item label="目标职位">
                  <el-input 
                    v-model="targetJob.title" 
                    placeholder="例如: 前端开发工程师"
                  ></el-input>
                </el-form-item>
                <el-form-item label="关键技能" optional>
                  <el-select
                    v-model="targetJob.keywords"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="添加与职位相关的关键技能"
                  >
                    <el-option
                      v-for="item in commonKeywords"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="startOptimization" :disabled="!targetJob.title.trim()">
                    优化简历
                  </el-button>
                </el-form-item>
              </el-form>
            </template>
            
            <div v-else class="optimization-result">
              <h4>简历优化完成</h4>
              <div class="changes-list">
                <h5>改进:</h5>
                <ul>
                  <li v-for="(change, index) in optimizationResult.changes" :key="index">
                    {{ change }}
                  </li>
                </ul>
              </div>
              
              <div class="optimization-actions">
                <el-button type="primary" @click="applyOptimization">应用优化结果</el-button>
                <el-button @click="optimizationResult = null">重新优化</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, computed } from 'vue';
import { useAgentStore } from '../../stores/agentStore';
import { useResumeStore } from '../../stores/resumeStore';
import { ElMessage } from 'element-plus';
import { 
  Check, 
  Loading, 
  Warning, 
  DataAnalysis,
  Link, 
  Star, 
  MagicStick 
} from '@element-plus/icons-vue';

export default {
  name: 'AgentAssistant',
  components: {
    Check,
    Loading,
    Warning,
    DataAnalysis,
    Link,
    Star,
    MagicStick
  },
  setup() {
    const agentStore = useAgentStore();
    const resumeStore = useResumeStore();
    
    // 加载保存的会话
    agentStore.loadSessionFromStorage();
    
    const currentSection = ref(null);
    const jobDescription = ref('');
    const targetJob = reactive({
      title: '',
      keywords: []
    });
    
    // 常用关键词
    const commonKeywords = ref([
      'JavaScript', 'Vue.js', 'React', 'Angular', 'Node.js', 
      'HTML', 'CSS', 'Python', 'Java', 'C++',
      '项目管理', '团队管理', '沟通能力', '领导力',
      'UI设计', 'UX设计', '产品设计', '平面设计',
      '数据分析', '机器学习', '人工智能'
    ]);
    
    // 计算属性
    const isActive = computed(() => agentStore.isActive);
    const isLoading = computed(() => agentStore.isLoading);
    const error = computed(() => agentStore.error);
    const currentAnalysis = computed(() => agentStore.currentAnalysis);
    const jobMatchResult = computed(() => agentStore.jobMatchResult);
    const templateRecommendation = computed(() => agentStore.templateRecommendation);
    const optimizationResult = computed(() => agentStore.optimizationResult);
    
    // 方法
    const toggleAgent = () => {
      agentStore.setActive(!isActive.value);
      agentStore.saveSessionToStorage();
    };
    
    const getTaskName = () => {
      const taskNames = {
        'resume-analysis': '分析简历',
        'job-match': '分析职位匹配度',
        'content-suggestions': '生成内容建议',
        'template-recommendation': '推荐模板',
        'resume-optimization': '优化简历'
      };
      
      return taskNames[agentStore.activeTask] || '处理';
    };
    
    const clearError = () => {
      agentStore.setError(null);
    };
    
    const backToMain = () => {
      currentSection.value = null;
    };
    
    const startAnalysis = async () => {
      currentSection.value = 'analysis';
      const resumeData = resumeStore.resumeData;
      await agentStore.analyzeResume(resumeData);
    };
    
    const showJobMatchSection = () => {
      currentSection.value = 'job-match';
      // 重置职位匹配结果，允许用户输入新的职位描述
      agentStore.jobMatchResult = null;
      jobDescription.value = '';
    };
    
    const analyzeJobMatch = async () => {
      if (!jobDescription.value.trim()) return;
      
      const resumeData = resumeStore.resumeData;
      await agentStore.generateJobMatch(resumeData, jobDescription.value);
    };
    
    const showTemplateRecommendation = async () => {
      currentSection.value = 'template-recommendation';
      const resumeData = resumeStore.resumeData;
      await agentStore.getTemplateRecommendation(resumeData);
    };
    
    const applyRecommendedTemplate = (template) => {
      resumeStore.selectTemplate(template);
      // 提示用户模板已应用
      ElMessage.success(`已应用${getTemplateName(template)}模板`);
    };
    
    const showOptimizationSection = () => {
      currentSection.value = 'optimization';
      // 重置优化结果，允许用户输入新的目标职位
      agentStore.optimizationResult = null;
      targetJob.title = '';
      targetJob.keywords = [];
    };
    
    const startOptimization = async () => {
      if (!targetJob.title.trim()) return;
      
      const resumeData = resumeStore.resumeData;
      await agentStore.optimizeResume(resumeData, targetJob);
    };
    
    const applyOptimization = () => {
      if (!optimizationResult.value) return;
      
      // 应用优化后的简历数据
      resumeStore.resumeData = optimizationResult.value.optimized;
      resumeStore.saveToLocalStorage();
      
      // 提示用户优化已应用
      ElMessage.success('简历优化已应用');
    };
    
    const optimizeForJob = () => {
      showOptimizationSection();
      // 从职位描述中提取职位名称
      const lines = jobDescription.value.split('\n');
      if (lines.length > 0) {
        targetJob.title = lines[0].substring(0, 30); // 使用描述的第一行作为职位名称
      }
      
      // 从职位匹配结果中提取关键词
      if (jobMatchResult.value && jobMatchResult.value.suggestions) {
        const keywordSuggestion = jobMatchResult.value.suggestions.find(
          suggestion => suggestion.includes('关键词')
        );
        
        if (keywordSuggestion) {
          const keywordMatch = keywordSuggestion.match(/关键词: ([^.]+)/);
          if (keywordMatch && keywordMatch[1]) {
            targetJob.keywords = keywordMatch[1]
              .split(',')
              .map(k => k.trim())
              .filter(k => k);
          }
        }
      }
    };
    
    const getTemplateName = (templateId) => {
      const templateInfo = resumeStore.getTemplateInfo(templateId);
      return templateInfo ? templateInfo.name : templateId;
    };
    
    const getCompletenessStatus = (percentage) => {
      if (percentage >= 80) return 'success';
      if (percentage >= 60) return 'warning';
      return 'exception';
    };
    
    const getMatchColor = (score) => {
      if (score >= 75) return '#67c23a';
      if (score >= 60) return '#e6a23c';
      return '#f56c6c';
    };
    
    return {
      isActive,
      isLoading,
      error,
      currentSection,
      currentAnalysis,
      jobMatchResult,
      templateRecommendation,
      optimizationResult,
      jobDescription,
      targetJob,
      commonKeywords,
      
      toggleAgent,
      getTaskName,
      clearError,
      backToMain,
      startAnalysis,
      showJobMatchSection,
      analyzeJobMatch,
      showTemplateRecommendation,
      applyRecommendedTemplate,
      showOptimizationSection,
      startOptimization,
      applyOptimization,
      optimizeForJob,
      getTemplateName,
      getCompletenessStatus,
      getMatchColor
    };
  }
};
</script>

<style scoped>
.agent-assistant-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transition: all 0.3s ease;
  max-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.agent-active {
  height: auto;
}

.agent-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #409eff;
  color: white;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
}

.agent-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.agent-content {
  padding: 16px;
  overflow-y: auto;
  max-height: 500px;
}

.agent-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
}

.agent-loading .el-icon {
  font-size: 32px;
  color: #409eff;
}

.agent-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  color: #f56c6c;
}

.feature-intro {
  margin-bottom: 16px;
}

.feature-intro h3 {
  margin-bottom: 8px;
  font-size: 16px;
  color: #333;
}

.feature-intro ul {
  padding-left: 20px;
  margin: 0;
}

.feature-intro li {
  margin-bottom: 4px;
  color: #666;
}

.feature-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-buttons .el-button {
  justify-content: flex-start;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.completeness-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.completeness-chart span {
  margin-top: 8px;
  color: #606266;
}

.analysis-details h4 {
  margin: 16px 0 8px;
  font-size: 14px;
  color: #333;
}

.missing-fields, .strengths-list, .suggestions-list {
  padding-left: 20px;
  margin: 0;
  color: #666;
}

.missing-fields li {
  color: #f56c6c;
}

.analysis-actions {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.job-match-section .el-form {
  margin-bottom: 16px;
}

.match-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.match-score span {
  margin-top: 8px;
  color: #606266;
}

.match-suggestions h4 {
  margin: 16px 0 8px;
  font-size: 14px;
  color: #333;
}

.match-suggestions ul {
  padding-left: 20px;
  margin: 0;
  color: #666;
}

.match-actions {
  margin-top: 24px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.recommendation-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.recommendation-main h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #333;
}

.recommendation-reason {
  margin: 0 0 16px;
  color: #666;
  text-align: center;
}

.alternative-templates h4 {
  margin: 16px 0 8px;
  font-size: 14px;
  color: #333;
}

.template-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.template-option {
  width: 90px;
  cursor: pointer;
  border-radius: 4px;
  padding: 4px;
  transition: all 0.3s;
  text-align: center;
}

.template-option:hover {
  background-color: #f5f7fa;
}

.template-preview {
  width: 80px;
  height: 100px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
}

.template-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.template-option span {
  font-size: 12px;
  color: #606266;
}

.optimization-section .el-form {
  margin-bottom: 16px;
}

.optimization-result h4 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #333;
  text-align: center;
}

.changes-list h5 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #333;
}

.changes-list ul {
  padding-left: 20px;
  margin: 0 0 16px;
  color: #666;
}

.optimization-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* 小屏幕适配 */
@media screen and (max-width: 600px) {
  .agent-assistant-container {
    width: calc(100% - 32px);
    max-height: calc(100vh - 80px);
  }
}
</style> 