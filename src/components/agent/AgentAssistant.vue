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
      
      <!-- 分析错误处理 -->
      <div v-else-if="analysisError" class="agent-error">
        <el-icon><Warning /></el-icon>
        <span>{{ analysisError }}</span>
        <div class="error-actions">
          <el-button size="small" type="primary" @click="testConnection">测试连接</el-button>
          <el-button size="small" type="text" @click="clearAnalysisError">重试</el-button>
        </div>
      </div>
      
      <div v-else class="agent-features">
        <template v-if="!currentSection">
          <div class="feature-intro">
            <h3>AI简历助手可以帮助你：</h3>
            <ul>
              <li>分析简历完整度和质量</li>
              <li>生成针对性的内容建议</li>
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
                :format="(percentage) => `${percentage}%`"
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
        
        <!-- 简历优化 -->
        <div v-else-if="currentSection === 'optimization'" class="agent-section optimization-section">
          <div class="section-header">
            <h3>简历优化</h3>
            <el-button size="small" text @click="backToMain">返回</el-button>
          </div>
          
          <div class="section-content">
            <template v-if="!optimizationResult">
              <div class="optimization-intro">
                <h4>智能优化说明</h4>
                <ul>
                  <li>根据目标职位智能调整简历内容</li>
                  <li>优化关键词匹配度</li>
                  <li>突出相关工作经验</li>
                  <li>调整技能描述的专业性</li>
                </ul>
              </div>
              
              <el-form @submit.prevent="startOptimization" class="optimization-form">
                <el-form-item label="目标职位">
                  <el-input 
                    v-model="targetJob.title" 
                    placeholder="请输入目标职位，例如：前端开发工程师"
                    clearable
                  ></el-input>
                </el-form-item>
                
                <el-form-item label="职位类型">
                  <el-select v-model="targetJob.type" placeholder="请选择职位类型" clearable>
                    <el-option label="技术类" value="technical" />
                    <el-option label="管理类" value="management" />
                    <el-option label="设计类" value="design" />
                    <el-option label="市场类" value="marketing" />
                    <el-option label="销售类" value="sales" />
                    <el-option label="其他" value="other" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="职位关键词">
                  <el-select
                    v-model="targetJob.keywords"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="选择或输入与职位相关的关键词"
                    class="keywords-select"
                  >
                    <el-option-group label="专业技能">
                      <el-option
                        v-for="item in professionalKeywords"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-option-group>
                    <el-option-group label="软技能">
                      <el-option
                        v-for="item in softSkillKeywords"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-option-group>
                    <el-option-group label="管理能力">
                      <el-option
                        v-for="item in managementKeywords"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-option-group>
                  </el-select>
                  <div class="keywords-tip">建议选择3-5个关键词，优先选择与目标职位最相关的</div>
                </el-form-item>
                
                <el-form-item label="优化重点">
                  <el-checkbox-group v-model="targetJob.focus">
                    <el-checkbox label="experience">工作经验</el-checkbox>
                    <el-checkbox label="skills">技能描述</el-checkbox>
                    <el-checkbox label="education">教育背景</el-checkbox>
                    <el-checkbox label="projects">项目经历</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                
                <el-form-item>
                  <el-button 
                    type="primary" 
                    @click="startOptimization" 
                    :disabled="!targetJob.title.trim()"
                    :loading="isLoading"
                  >
                    开始优化
                  </el-button>
                </el-form-item>
              </el-form>
            </template>
            
            <div v-else class="optimization-result">
              <div class="result-header">
                <h4>优化完成</h4>
                <p class="result-subtitle">AI已根据您的目标职位优化了简历内容</p>
              </div>
              
              <div class="changes-list">
                <h5>主要改进:</h5>
                <ul>
                  <li v-for="(change, index) in optimizationResult.changes" :key="index">
                    {{ change }}
                  </li>
                </ul>
              </div>
              
              <div class="optimization-actions">
                <el-button type="primary" @click="applyOptimization" :loading="isLoading">
                  应用优化结果
                </el-button>
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
import resumeService from '../../services/resumeService';
import { ElMessage, ElNotification } from 'element-plus';
import { 
  Check, 
  Loading, 
  Warning, 
  DataAnalysis,
  MagicStick 
} from '@element-plus/icons-vue';

export default {
  name: 'AgentAssistant',
  components: {
    Check,
    Loading,
    Warning,
    DataAnalysis,
    MagicStick
  },
  setup() {
    const agentStore = useAgentStore();
    const resumeStore = useResumeStore();
    
    // 加载保存的会话
    agentStore.loadSessionFromStorage();
    
    const currentSection = ref(null);
    const targetJob = reactive({
      title: '',
      type: '',
      keywords: [],
      focus: ['experience', 'skills']
    });
    
    // 专业技能关键词
    const professionalKeywords = ref([
      '项目管理', '产品设计', 'UI设计', 'UX设计', '数据分析',
      '市场营销', '品牌策划', '内容运营', '客户服务', '销售管理',
      '财务分析', '人力资源', '法律咨询', '教育培训', '医疗护理',
      '研发创新', '质量控制', '供应链管理', '物流管理', '采购管理'
    ]);
    
    // 软技能关键词
    const softSkillKeywords = ref([
      '沟通能力', '团队协作', '问题解决', '学习能力',
      '创新思维', '时间管理', '项目管理', '领导力',
      '客户服务', '商业意识', '跨文化沟通', '压力管理',
      '决策能力', '执行力', '责任心', '主动性'
    ]);
    
    // 管理能力关键词
    const managementKeywords = ref([
      '团队管理', '项目管理', '资源规划', '风险管理',
      '战略规划', '预算管理', '绩效管理', '变革管理',
      '决策能力', '冲突解决', '人才发展', '组织建设',
      '目标管理', '流程优化', '成本控制', '质量管理'
    ]);
    
    // 计算属性
    const isActive = computed(() => agentStore.isActive);
    const isLoading = computed(() => agentStore.isLoading);
    const error = computed(() => agentStore.error);
    const currentAnalysis = computed(() => agentStore.currentAnalysis);
    const optimizationResult = computed(() => agentStore.optimizationResult);
    const analysisError = computed(() => agentStore.analysisError);
    
    // 方法
    const toggleAgent = () => {
      agentStore.setActive(!isActive.value);
      agentStore.saveSessionToStorage();
    };
    
    const getTaskName = () => {
      const taskNames = {
        'resume-analysis': '分析简历',
        'content-suggestions': '生成内容建议',
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
      try {
        currentSection.value = 'analysis';
        const resumeData = resumeStore.resumeData;
        
        // 清除之前的错误
        clearAnalysisError();
        
        // 调用API测试
        try {
          const testResult = await resumeService.testConnection(resumeData);
          if (!testResult.valid) {
            console.warn('数据验证未通过，但继续尝试分析', testResult.errors);
          }
        } catch (e) {
          console.warn('API连接测试失败，但继续尝试分析', e);
        }
        
        // 执行分析
        await agentStore.analyzeResume(resumeData);
      } catch (error) {
        console.error('分析过程出错', error);
        agentStore.setAnalysisError(`分析失败: ${error.message}`);
      }
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
      try {
        if (!optimizationResult.value) return;
        
        // 应用优化后的简历数据
        resumeStore.resumeData = optimizationResult.value.optimized;
        resumeStore.saveToLocalStorage();
        
        // 提示用户优化已应用
        ElMessage({
          message: '简历优化已应用',
          type: 'success'
        });
      } catch (error) {
        console.error('应用优化失败:', error);
        ElMessage({
          message: '应用优化失败，请重试',
          type: 'error'
        });
      }
    };
    
    const getCompletenessStatus = (percentage) => {
      if (percentage >= 80) return 'success';
      if (percentage >= 60) return 'warning';
      return 'exception';
    };
    
    const clearAnalysisError = () => {
      agentStore.setAnalysisError(null);
    };
    
    const testConnection = async () => {
      try {
        const resumeData = resumeStore.resumeData;
        const result = await resumeService.testConnection(resumeData);
        
        // 显示测试结果
        ElNotification({
          title: result.valid ? '连接成功' : '连接失败',
          message: result.valid 
            ? '数据格式验证通过，API连接正常' 
            : `验证失败: ${JSON.stringify(result.errors)}`,
          type: result.valid ? 'success' : 'error',
          duration: 5000
        });
      } catch (error) {
        ElNotification({
          title: '连接测试失败',
          message: `API连接失败: ${error.message}`,
          type: 'error',
          duration: 5000
        });
      }
    };
    
    return {
      isActive,
      isLoading,
      error,
      currentSection,
      currentAnalysis,
      optimizationResult,
      targetJob,
      professionalKeywords,
      softSkillKeywords,
      managementKeywords,
      
      toggleAgent,
      getTaskName,
      clearError,
      backToMain,
      startAnalysis,
      showOptimizationSection,
      startOptimization,
      applyOptimization,
      getCompletenessStatus,
      analysisError,
      clearAnalysisError,
      testConnection
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

.feature-buttons .el-icon {
  margin-right: 8px;
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

.optimization-intro {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.optimization-intro h4 {
  margin: 0 0 12px;
  font-size: 14px;
  color: #333;
}

.optimization-intro ul {
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

.optimization-intro li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.optimization-intro li:last-child {
  margin-bottom: 0;
}

.optimization-form {
  max-width: 100%;
}

.keywords-select {
  width: 100%;
}

.keywords-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.el-checkbox {
  margin-right: 0;
}

.result-header {
  text-align: center;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.result-header h4 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #333;
}

.result-subtitle {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.changes-list {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 24px;
}

.changes-list h5 {
  margin: 0 0 12px;
  font-size: 14px;
  color: #333;
}

.changes-list ul {
  padding-left: 20px;
  margin: 0;
  color: #606266;
}

.changes-list li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.changes-list li:last-child {
  margin-bottom: 0;
}

.optimization-actions {
  display: flex;
  gap: 12px;
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