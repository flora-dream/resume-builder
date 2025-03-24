<template>
  <div class="work-experience-form">
    <div class="section-header">
      <h3>工作经验</h3>
      <el-button type="primary" @click="addWorkExperience" size="small">添加工作经验</el-button>
    </div>

    <div v-if="workExperienceList.length === 0" class="empty-tip">
      <p>暂无工作经验，点击"添加工作经验"按钮添加</p>
    </div>

    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="(job, index) in workExperienceList" :key="index" :name="index">
        <template #title>
          <div class="collapse-title">
            <span>{{ job.company || '未命名公司' }} - {{ job.position || '未指定职位' }}</span>
          </div>
        </template>

        <el-form :model="job" label-width="100px">
          <el-form-item label="公司名称">
            <el-input v-model="job.company" placeholder="请输入公司名称" />
          </el-form-item>
          
          <el-form-item label="职位">
            <el-input v-model="job.position" placeholder="请输入职位名称" />
          </el-form-item>
          
          <el-form-item label="开始日期">
            <el-input v-model="job.startDate" placeholder="例如：2020年3月" />
          </el-form-item>
          
          <el-form-item label="结束日期">
            <div class="date-with-current">
              <el-input 
                v-model="job.endDate" 
                placeholder="例如：2022年7月" 
                :disabled="job.current"
                style="width: 70%;"
              />
              <el-checkbox v-model="job.current" style="margin-left: 10px;">至今</el-checkbox>
            </div>
          </el-form-item>
          
          <el-form-item label="工作描述">
            <el-input 
              v-model="job.description" 
              type="textarea" 
              :rows="3"
              placeholder="描述您的工作职责和主要内容"
            />
          </el-form-item>
          
          <el-form-item label="工作成果">
            <div v-for="(achievement, i) in job.achievements" :key="i" class="achievement-item">
              <el-input v-model="job.achievements[i]" placeholder="工作成果或亮点">
                <template #append>
                  <el-button @click="removeAchievement(job, i)" icon="Delete" />
                </template>
              </el-input>
            </div>
            <el-button 
              type="primary" 
              size="small" 
              plain 
              @click="addAchievement(job)" 
              icon="Plus"
              style="margin-top: 5px;">
              添加成果
            </el-button>
          </el-form-item>
          
          <div class="form-actions">
            <el-button type="danger" @click="removeWorkExperience(index)" size="small">删除</el-button>
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

// 工作经验列表
const workExperienceList = reactive([]);
// 展开的折叠面板
const activeNames = ref([0]);

// 添加工作经验
const addWorkExperience = () => {
  const newJob = {
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: []
  };
  
  workExperienceList.push(newJob);
  
  // 自动展开新添加的项
  nextTick(() => {
    activeNames.value = [workExperienceList.length - 1];
  });
};

// 删除工作经验
const removeWorkExperience = (index) => {
  workExperienceList.splice(index, 1);
};

// 添加工作成果
const addAchievement = (job) => {
  if (!job.achievements) {
    job.achievements = [];
  }
  job.achievements.push('');
};

// 删除工作成果
const removeAchievement = (job, index) => {
  job.achievements.splice(index, 1);
};

// 监听工作经验变化
watch(workExperienceList, (newValue) => {
  resumeStore.updateWorkExperience([...newValue]);
}, { deep: true });

// 组件挂载时初始化数据
onMounted(() => {
  const storeData = resumeStore.resumeData.workExperience;
  
  if (storeData && storeData.length > 0) {
    storeData.forEach(item => {
      workExperienceList.push({...item});
    });
  } else {
    // 如果没有数据，添加一个空的表单
    addWorkExperience();
  }
});
</script>

<style scoped>
.work-experience-form {
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

.date-with-current {
  display: flex;
  align-items: center;
}

.achievement-item {
  margin-bottom: 5px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style> 