<template>
  <div class="editor-page">
    <header class="header">
      <h1>简历制作工具</h1>
    </header>

    <main class="main-content">
      <div class="editor-section">
        <!-- 模板选择卡片 -->
        <div class="template-selector-cards">
          <h3>选择模板样式</h3>
          <div class="template-cards">
            <div 
              v-for="(template, id) in templateInfo" 
              :key="id"
              class="template-card" 
              :class="{ 'active': selectedTemplate === id }"
              @click="changeTemplate(id)"
            >
              <div class="template-preview" :class="template.thumbnail"></div>
              <div class="template-info">
                <div class="template-name">{{ template.name }}</div>
                <div class="template-desc" v-if="selectedTemplate === id">{{ template.description }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <el-tabs v-model="activeTab">
          <el-tab-pane label="个人信息" name="personalInfo">
            <personal-info-form />
          </el-tab-pane>
          <el-tab-pane label="教育经历" name="education">
            <education-form />
          </el-tab-pane>
          <el-tab-pane label="工作经验" name="workExperience">
            <work-experience-form />
          </el-tab-pane>
          <el-tab-pane label="技能" name="skills">
            <skills-form />
          </el-tab-pane>
          <el-tab-pane label="项目经验" name="projects">
            <projects-form />
          </el-tab-pane>
          <el-tab-pane label="证书" name="certifications">
            <certifications-form />
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="preview-section">
        <h3>实时预览</h3>
        <div class="preview-container">
          <div class="preview-wrapper">
            <component :is="templateComponent" />
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <el-button type="primary" @click="goToPreview">预览</el-button>
      <el-button type="success" @click="exportPDF">导出PDF</el-button>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useResumeStore } from '../stores/resumeStore';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

const activeTab = ref('personalInfo');
const selectedTemplate = ref(resumeStore.selectedTemplate);
const templateInfo = computed(() => resumeStore.templateInfo);

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

// 切换模板
const changeTemplate = (value) => {
  selectedTemplate.value = value;
  resumeStore.selectTemplate(value);
};

// 跳转到预览页面
const goToPreview = () => {
  router.push('/preview');
};

// 导出PDF功能
const exportPDF = async () => {
  // 实际生产环境中应该在预览页面执行导出
  alert('在编辑页面导出可能效果不佳，建议在预览页面导出PDF');
};
</script>

<style scoped>
.editor-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e6e6e6;
}

.main-content {
  display: flex;
  flex: 1;
  padding: 1rem;
}

.editor-section {
  flex: 1;
  padding: 1rem;
  border-right: 1px solid #e6e6e6;
  overflow-y: auto;
}

.preview-section {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.preview-container {
  flex: 1;
  overflow: auto;
  border: 1px solid #e6e6e6;
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  min-height: 500px;
  position: relative;
}

.preview-wrapper {
  width: 210mm;
  height: 297mm;
  transform: scale(0.88);
  transform-origin: center center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  overflow: hidden;
}

.footer {
  padding: 1rem 2rem;
  background-color: #f5f7fa;
  border-top: 1px solid #e6e6e6;
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style> 