<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { useResumeStore } from './stores/resumeStore';

const resumeStore = useResumeStore();

onMounted(() => {
  // 从本地存储加载数据
  resumeStore.loadFromLocalStorage();
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

/* 确保字体一致性 */
@font-face {
  font-family: 'ArialPDF';
  src: local('Arial');
  font-display: swap;
}

/* 全局打印和导出样式 */
@media print {
  @page {
    size: A4 portrait;
    margin: 0;
  }
  
  body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
    font-family: 'ArialPDF', Arial, sans-serif;
  }
}
</style> 