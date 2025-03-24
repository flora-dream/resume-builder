<template>
  <div class="preview-page">
    <header class="header">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回编辑
      </el-button>
      <h2>简历预览</h2>
      <el-button type="primary" @click="exportPDF">导出PDF</el-button>
    </header>

    <main class="main-content">
      <div class="resume-container" ref="resumeContainer" id="resumeContent">
        <component :is="templateComponent" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElLoading, ElMessage } from 'element-plus';
import { useResumeStore } from '../stores/resumeStore';
import { ArrowLeft } from '@element-plus/icons-vue';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// 导入模板组件
import ClassicTemplate from '../components/templates/ClassicTemplate.vue';
import CreativeTemplate from '../components/templates/CreativeTemplate.vue';
import MinimalTemplate from '../components/templates/MinimalTemplate.vue';

const router = useRouter();
const resumeStore = useResumeStore();
const resumeContainer = ref(null);

// 计算当前选择的模板组件
const templateComponent = computed(() => {
  switch (resumeStore.selectedTemplate) {
    case 'classic':
      return ClassicTemplate;
    case 'creative':
      return CreativeTemplate;
    case 'minimal':
      return MinimalTemplate;
    default:
      return ClassicTemplate;
  }
});

// 返回编辑页面
const goBack = () => {
  router.push('/');
};

// 导出PDF
const exportPDF = async () => {
  try {
    const element = document.getElementById('resumeContent');
    
    // 创建弹窗提示用户正在导出
    const loading = ElLoading.service({
      lock: true,
      text: '正在生成PDF...',
      background: 'rgba(0, 0, 0, 0.7)',
    });

    const canvas = await html2canvas(element, {
      scale: 2, // 提高清晰度
      useCORS: true, // 允许加载跨域图片
      logging: false,
      backgroundColor: '#FFFFFF'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4宽度
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // 关闭加载提示
    loading.close();
    
    // 下载PDF
    pdf.save(`简历_${resumeStore.resumeData.personalInfo.name || '未命名'}.pdf`);
    
  } catch (error) {
    console.error('PDF导出错误:', error);
    ElMessage.error('PDF导出失败，请重试');
  }
};
</script>

<style scoped>
.preview-page {
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
  flex: 1;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #f0f2f5;
  overflow: auto;
}

.resume-container {
  width: 210mm; /* A4宽度 */
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  min-height: 297mm; /* A4高度 */
}
</style> 