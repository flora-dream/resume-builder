<template>
  <div class="education-form">
    <div class="section-header">
      <h3>教育经历</h3>
      <el-button type="primary" @click="addEducation" size="small">添加教育经历</el-button>
    </div>

    <div v-if="educationList.length === 0" class="empty-tip">
      <p>暂无教育经历，点击"添加教育经历"按钮添加</p>
    </div>

    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="(edu, index) in educationList" :key="index" :name="index">
        <template #title>
          <div class="collapse-title">
            <span>{{ edu.school || '未命名学校' }} - {{ edu.degree || '未指定学位' }}</span>
          </div>
        </template>

        <el-form :model="edu" label-width="100px">
          <el-form-item label="学校名称">
            <el-input v-model="edu.school" placeholder="请输入学校名称" />
          </el-form-item>
          
          <el-form-item label="学位">
            <el-input v-model="edu.degree" placeholder="例如：学士、硕士、博士" />
          </el-form-item>
          
          <el-form-item label="专业">
            <el-input v-model="edu.major" placeholder="请输入专业名称" />
          </el-form-item>
          
          <el-form-item label="开始日期">
            <el-input v-model="edu.startDate" placeholder="例如：2018年9月" />
          </el-form-item>
          
          <el-form-item label="结束日期">
            <el-input v-model="edu.endDate" placeholder="例如：2022年7月" />
          </el-form-item>
          
          <el-form-item label="描述">
            <el-input 
              v-model="edu.description" 
              type="textarea" 
              :rows="3"
              placeholder="描述您的学习情况、获奖经历等"
            />
          </el-form-item>
          
          <div class="form-actions">
            <el-button type="danger" @click="removeEducation(index)" size="small">删除</el-button>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue';
import { useResumeStore } from '../../stores/resumeStore';

const resumeStore = useResumeStore();

// 教育经历列表
const educationList = reactive([]);
// 展开的折叠面板
const activeNames = ref([0]);

// 添加教育经历
const addEducation = () => {
  const newEdu = {
    school: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
    description: ''
  };
  
  educationList.push(newEdu);
  
  // 自动展开新添加的项
  nextTick(() => {
    activeNames.value = [educationList.length - 1];
  });
};

// 删除教育经历
const removeEducation = (index) => {
  educationList.splice(index, 1);
};

// 监听教育经历变化
watch(educationList, (newValue) => {
  resumeStore.updateEducation([...newValue]);
}, { deep: true });

// 组件挂载时初始化数据
onMounted(() => {
  const storeData = resumeStore.resumeData.education;
  
  if (storeData && storeData.length > 0) {
    storeData.forEach(item => {
      educationList.push({...item});
    });
  } else {
    // 如果没有数据，添加一个空的表单
    addEducation();
  }
});
</script>

<style scoped>
.education-form {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h3 {
  margin: 0;
}

.empty-tip {
  text-align: center;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 4px;
  color: #999;
}

.collapse-title {
  font-weight: bold;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style> 