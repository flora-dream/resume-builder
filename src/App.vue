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
</style> 