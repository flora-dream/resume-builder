<template>
  <div class="skills-form">
    <div class="section-header">
      <h3>技能</h3>
      <el-button type="primary" @click="addSkill" size="small">添加技能</el-button>
    </div>

    <div v-if="skillsList.length === 0" class="empty-tip">
      <p>暂无技能，点击"添加技能"按钮添加</p>
    </div>

    <div v-else class="skills-list">
      <div v-for="(skill, index) in skillsList" :key="index" class="skill-item">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="技能名称">
              <el-input v-model="skill.name" placeholder="例如：JavaScript" />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="类别">
              <el-select v-model="skill.category" placeholder="选择类别" style="width: 100%">
                <el-option label="编程语言" value="编程语言" />
                <el-option label="框架/库" value="框架/库" />
                <el-option label="工具/平台" value="工具/平台" />
                <el-option label="语言能力" value="语言能力" />
                <el-option label="软技能" value="软技能" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="6">
            <el-form-item label="熟练度">
              <el-rate 
                v-model="skill.level" 
                :max="5"
                :texts="['入门', '基础', '熟悉', '精通', '专家']"
                show-text
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="2" class="action-column">
            <el-button 
              type="danger" 
              icon="Delete" 
              circle 
              @click="removeSkill(index)"
              size="small"
            />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue';
import { useResumeStore } from '../../stores/resumeStore';

const resumeStore = useResumeStore();

// 技能列表
const skillsList = reactive([]);

// 添加技能
const addSkill = () => {
  const newSkill = {
    name: '',
    level: 3,
    category: ''
  };
  
  skillsList.push(newSkill);
};

// 删除技能
const removeSkill = (index) => {
  skillsList.splice(index, 1);
};

// 监听技能变化
watch(skillsList, (newValue) => {
  resumeStore.updateSkills([...newValue]);
}, { deep: true });

// 组件挂载时初始化数据
onMounted(() => {
  const storeData = resumeStore.resumeData.skills;
  
  if (storeData && storeData.length > 0) {
    storeData.forEach(item => {
      skillsList.push({...item});
    });
  } else {
    // 如果没有数据，添加一个空的表单
    addSkill();
  }
});
</script>

<style scoped>
.skills-form {
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

.skills-list {
  margin-top: 15px;
}

.skill-item {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fafafa;
}

.action-column {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 20px;
}
</style> 