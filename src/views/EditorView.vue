<template>
  <div class="editor-page">
    <header class="header">
      <div class="logo">
        <h1>简历制作工具</h1>
      </div>
      <div class="header-actions">
        <el-tooltip content="更换模板" placement="bottom" effect="light">
          <el-button type="primary" plain @click="showTemplateDialog = true">
            <el-icon><Picture /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="预览简历" placement="bottom" effect="light">
          <el-button type="primary" plain @click="goToPreview">
            <el-icon><View /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="导出为PDF" placement="bottom" effect="light">
          <el-button type="success" plain @click="exportPDF">
            <el-icon><Download /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </header>

    <div class="editor-container">
      <div class="sidebar">
        <div class="sidebar-header">编辑模块</div>
        <div class="sidebar-items">
          <el-tooltip
            v-for="tab in tabs" 
            :key="tab.name"
            :content="tab.label"
            placement="right"
            effect="light"
          >
            <div 
              class="sidebar-item" 
              :class="{ active: activeTab === tab.name }"
              @click="activeTab = tab.name"
            >
              <el-icon>
                <component :is="tab.icon" />
              </el-icon>
            </div>
          </el-tooltip>
        </div>
        <div class="sidebar-help">
          友情提示：请根据模板选择合适的简历风格，让您的简历脱颖而出
        </div>
      </div>

      <div class="content-area">
        <div class="form-section">
          <div class="form-container">
            <component :is="activeTabComponent.component" />
          </div>
        </div>

        <div class="preview-section">
          <div class="preview-header">
            <h3>实时预览</h3>
            <div class="preview-controls">
              <el-tooltip content="缩小视图" placement="top">
                <el-button :disabled="previewScale <= 0.5" @click="previewScale -= 0.1" circle size="small">
                  <el-icon><ZoomOut /></el-icon>
                </el-button>
              </el-tooltip>
              <span class="scale-text">{{ Math.round(previewScale * 100) }}%</span>
              <el-tooltip content="放大视图" placement="top">
                <el-button :disabled="previewScale >= 1.3" @click="previewScale += 0.1" circle size="small">
                  <el-icon><ZoomIn /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="恢复默认大小" placement="top">
                <el-button @click="previewScale = 0.8" circle size="small">
                  <el-icon><RefreshRight /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </div>
          <div class="preview-container">
            <div class="preview-wrapper" :style="{ transform: `scale(${previewScale})`, transformOrigin: 'top center' }">
              <component :is="templateComponent" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模板选择对话框 -->
    <el-dialog
      v-model="showTemplateDialog"
      title="选择简历模板"
      width="70%"
      destroy-on-close
      :close-on-click-modal="false"
      class="template-dialog"
    >
      <div class="template-selector-container">
        <p class="template-selector-tip">选择适合您的简历风格，让您的简历脱颖而出</p>
        <div class="template-cards">
          <div 
            v-for="(template, id) in templateInfo" 
            :key="id"
            class="template-card" 
            :class="{ 'active': dialogSelectedTemplate === id }"
            @click="dialogSelectedTemplate = id"
          >
            <div class="template-preview" :class="template.thumbnail"></div>
            <div class="template-info">
              <div class="template-name">{{ template.name }}</div>
              <div class="template-desc">{{ template.description }}</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showTemplateDialog = false">取消</el-button>
          <el-button type="primary" @click="applyTemplateChange">应用模板</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useResumeStore } from '../stores/resumeStore';
import { ElMessage } from 'element-plus';
import { 
  Picture, View, Download, ZoomIn, ZoomOut, 
  User, School, OfficeBuilding, Histogram, 
  Promotion, Medal, RefreshRight 
} from '@element-plus/icons-vue';

// 导入模板缩略图样式
import '../assets/template-thumbnails.css';

// 导入表单组件
import PersonalInfoForm from '../components/editor/PersonalInfoForm.vue';
import EducationForm from '../components/editor/EducationForm.vue';
import WorkExperienceForm from '../components/editor/WorkExperienceForm.vue';
import SkillsForm from '../components/editor/SkillsForm.vue';
import ProjectsForm from '../components/editor/ProjectsForm.vue';
import CertificationsForm from '../components/editor/CertificationsForm.vue';

// 导入模板组件
import ClassicTemplate from '../components/templates/ClassicTemplate.vue';
import CreativeTemplate from '../components/templates/CreativeTemplate.vue';
import MinimalTemplate from '../components/templates/MinimalTemplate.vue';
import ModernTemplate from '../components/templates/ModernTemplate.vue';

const router = useRouter();
const resumeStore = useResumeStore();

// 定义标签页配置
const tabs = [
  { name: 'personalInfo', label: '个人信息', component: PersonalInfoForm, icon: User },
  { name: 'education', label: '教育经历', component: EducationForm, icon: School },
  { name: 'workExperience', label: '工作经验', component: WorkExperienceForm, icon: OfficeBuilding },
  { name: 'skills', label: '技能', component: SkillsForm, icon: Histogram },
  { name: 'projects', label: '项目经验', component: ProjectsForm, icon: Promotion },
  { name: 'certifications', label: '证书', component: CertificationsForm, icon: Medal }
];

const activeTab = ref('personalInfo');
const selectedTemplate = ref(resumeStore.selectedTemplate);
const templateInfo = computed(() => resumeStore.templateInfo);

// 预览缩放状态
const previewScale = ref(0.8);

// 模板选择对话框状态
const showTemplateDialog = ref(false);
const dialogSelectedTemplate = ref(selectedTemplate.value);

// 获取当前激活的标签页组件
const activeTabComponent = computed(() => {
  return tabs.find(tab => tab.name === activeTab.value);
});

// 计算当前选择的模板组件
const templateComponent = computed(() => {
  switch (selectedTemplate.value) {
    case 'classic':
      return ClassicTemplate;
    case 'creative':
      return CreativeTemplate;
    case 'minimal':
      return MinimalTemplate;
    case 'modern':
      return ModernTemplate;
    default:
      return ClassicTemplate;
  }
});

// 应用模板更改
const applyTemplateChange = () => {
  if (dialogSelectedTemplate.value !== selectedTemplate.value) {
    selectedTemplate.value = dialogSelectedTemplate.value;
    resumeStore.selectTemplate(dialogSelectedTemplate.value);
    ElMessage({
      message: '模板已更新，您可以继续完善简历内容',
      type: 'success',
      duration: 2000
    });
  }
  showTemplateDialog.value = false;
};

// 跳转到预览页面
const goToPreview = () => {
  router.push('/preview');
};

// 导出PDF功能
const exportPDF = async () => {
  ElMessage({
    message: '请在预览页面导出PDF以获得最佳效果',
    type: 'info',
    duration: 3000
  });
  router.push('/preview');
};
</script>

<style scoped>
.editor-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9fafc;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.5rem;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
  z-index: 10;
}

.logo h1 {
  font-size: 1.3rem;
  color: #303133;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.editor-container {
  display: flex;
  flex: 1;
  height: calc(100vh - 60px);
}

.sidebar {
  width: 60px;
  background-color: #fff;
  border-right: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03);
  position: relative;
}

.sidebar-header {
  text-align: center;
  font-size: 10px;
  color: #909399;
  font-weight: 500;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #ebeef5;
  width: 100%;
}

.sidebar-items {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  margin-bottom: 5px;
  border-left: 3px solid transparent;
  width: 100%;
}

.sidebar-item:hover {
  background-color: #f0f7ff;
}

.sidebar-item.active {
  background-color: #ecf5ff;
  border-left: 3px solid #409EFF;
}

.sidebar-item .el-icon {
  font-size: 22px;
  transition: all 0.2s;
  color: #606266;
}

.sidebar-item:hover .el-icon {
  color: #409EFF;
}

.sidebar-item.active .el-icon {
  transform: scale(1.1);
  color: #409EFF;
}

.sidebar-help {
  margin-top: auto;
  padding: 10px 5px;
  text-align: center;
  font-size: 10px;
  color: #909399;
  border-top: 1px dashed #ebeef5;
  line-height: 1.4;
}

.content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.form-section {
  width: 50%;
  padding: 20px;
  overflow-y: auto;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #303133;
}

.info-badge {
  margin-left: 10px;
  background-color: #e6f7ff;
  color: #1890ff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.form-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.preview-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #eaedf1;
  background-color: #f5f7fa;
  height: 100%;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #ebeef5;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.preview-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  display: flex;
  align-items: center;
}

.preview-header h3::before {
  content: '';
  display: inline-block;
  width: 3px;
  height: 14px;
  background-color: #409EFF;
  margin-right: 8px;
  border-radius: 1px;
}

.preview-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f5f7fa;
  padding: 3px 6px;
  border-radius: 4px;
}

.scale-text {
  font-size: 12px;
  color: #606266;
  width: 36px;
  text-align: center;
  font-weight: 500;
}

.preview-controls :deep(.el-button) {
  box-shadow: none !important;
  border: none !important;
}

.preview-container {
  flex: 1;
  overflow: auto;
  background-color: #ebeef5;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 25px 0;
}

.preview-wrapper {
  width: 210mm; /* A4宽度 */
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform-origin: top center;
  transition: transform 0.3s ease;
  max-height: 100%;
  height: auto;
  aspect-ratio: 1 / 1.414; /* A4纸张长宽比 */
  overflow: hidden;
  border-radius: 2px;
}

/* 模板选择对话框样式 */
.template-selector-container {
  padding: 10px 20px;
}

.template-selector-tip {
  text-align: center;
  margin-bottom: 25px;
  color: #606266;
  font-size: 16px;
}

.template-dialog :deep(.el-dialog__body) {
  padding-top: 10px;
}

:deep(.el-icon) {
  font-size: 18px;
}
</style> 