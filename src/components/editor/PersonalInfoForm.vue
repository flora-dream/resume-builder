<template>
  <div class="personal-info-form">
    <el-form :model="personalInfo" label-width="100px">
      <el-form-item label="姓名">
        <el-input v-model="personalInfo.name" placeholder="请输入姓名" />
      </el-form-item>
      
      <el-form-item label="职位">
        <el-input v-model="personalInfo.title" placeholder="请输入意向职位" />
      </el-form-item>
      
      <el-form-item label="电子邮箱">
        <el-input v-model="personalInfo.email" placeholder="请输入电子邮箱" />
      </el-form-item>
      
      <el-form-item label="电话">
        <el-input v-model="personalInfo.phone" placeholder="请输入联系电话" />
      </el-form-item>
      
      <el-form-item label="所在地">
        <el-input v-model="personalInfo.location" placeholder="例如：北京市朝阳区" />
      </el-form-item>
      
      <el-form-item label="个人网站">
        <el-input v-model="personalInfo.website" placeholder="例如：https://example.com" />
      </el-form-item>
      
      <el-form-item label="头像URL">
        <el-input v-model="personalInfo.avatar" placeholder="可选，请输入头像图片链接" />
        <div v-if="personalInfo.avatar" class="avatar-preview">
          <img :src="personalInfo.avatar" alt="头像预览" />
        </div>
      </el-form-item>
      
      <el-form-item label="个人简介">
        <el-input 
          v-model="personalInfo.summary" 
          type="textarea" 
          :rows="4"
          placeholder="请简要介绍自己的背景、经验和目标"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue';
import { useResumeStore } from '../../stores/resumeStore';

const resumeStore = useResumeStore();

// 从store中获取数据
const personalInfo = reactive({
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  avatar: '',
  summary: ''
});

// 监听表单数据变化并更新store
watch(personalInfo, (newValue) => {
  resumeStore.updatePersonalInfo(newValue);
}, { deep: true });

// 组件挂载时初始化数据
onMounted(() => {
  // 从store获取数据
  const storeData = resumeStore.resumeData.personalInfo;
  
  // 更新本地表单数据
  Object.keys(personalInfo).forEach(key => {
    if (storeData[key]) {
      personalInfo[key] = storeData[key];
    }
  });
});
</script>

<style scoped>
.personal-info-form {
  max-width: 100%;
}

.avatar-preview {
  margin-top: 10px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style> 