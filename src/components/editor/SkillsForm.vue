<template>
  <div class="skills-form">
    <h3>技能与专长</h3>
    
    <div v-if="skills.length > 0" class="skills-list">
      <div v-for="(skill, index) in skills" :key="index" class="skill-item">
        <div class="skill-header">
          <el-input 
            v-model="skill.name" 
            placeholder="技能名称" 
            class="skill-name-input"
            @change="updateSkills"
          />
          <el-button 
            type="danger" 
            circle 
            size="small"
            class="delete-btn"
            @click="removeSkill(index)"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
    </div>

        <div class="skill-content">
          <div class="skill-level-container">
            <span class="level-label">熟练度：{{ skill.level }}%</span>
            <el-slider 
                v-model="skill.level" 
              :min="0" 
              :max="100" 
              :step="5" 
              show-stops 
              class="skill-level-slider"
              @change="updateSkills"
            />
          </div>
          
          <!-- 技能描述小项列表 -->
          <div class="skill-points-section">
            <div class="section-header">
              <span class="points-title">描述小项</span>
              <el-button 
                type="primary" 
                size="small" 
                @click="addSkillPoint(index)"
                :icon="Plus"
              >
                添加小项
              </el-button>
            </div>
            
            <div v-if="skill.points && skill.points.length > 0" class="skill-points-list">
              <div v-for="(point, pointIndex) in skill.points" :key="pointIndex" class="skill-point-item">
                <el-input 
                  v-model="skill.points[pointIndex]" 
                  placeholder="例如：精通React框架，熟悉组件生命周期和状态管理" 
                  @change="updateSkills"
                />
            <el-button 
              type="danger" 
                  size="small" 
              circle 
                  class="remove-point-btn"
                  @click="removeSkillPoint(index, pointIndex)"
                >
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
            </div>
            
            <div v-else class="no-points">
              <span>点击"添加小项"按钮添加技能描述小项</span>
            </div>
            
            <!-- 保留传统描述字段，允许选择使用方式 -->
            <div class="use-traditional-desc" v-if="!skill.points || skill.points.length === 0">
              <span>或使用传统描述：</span>
              <el-input
                v-model="skill.description"
                type="textarea"
                :rows="2"
                placeholder="技能描述（可选，简要说明您的经验和专长）"
                class="skill-description-input"
                @change="updateSkills"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-skills">
      <p>暂无技能信息，请添加您的技能专长</p>
    </div>
    
    <div class="actions">
      <el-button type="primary" @click="addSkill">添加技能</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useResumeStore } from '../../stores/resumeStore';
import { Delete, Close, Plus } from '@element-plus/icons-vue';

const resumeStore = useResumeStore();
const skills = ref([]);

// 从 store 加载技能数据
onMounted(() => {
  // 将 store 中的数据深拷贝到本地，以避免直接修改 store
  skills.value = JSON.parse(JSON.stringify(resumeStore.resumeData.skills || []));
  
  // 确保每个技能项都有必要的字段
  skills.value.forEach(skill => {
    if (!skill.hasOwnProperty('description')) {
      skill.description = '';
    }
    if (!skill.hasOwnProperty('points')) {
      skill.points = [];
    }
    // 如果有老的描述但没有小项，可以选择性地将描述拆分为小项
    if (skill.description && (!skill.points || skill.points.length === 0)) {
      // 这里不自动拆分，而是保留用户选择权
    }
  });
});

// 添加技能
const addSkill = () => {
  skills.value.push({
    name: '',
    level: 70,
    description: '',
    points: []
  });
  updateSkills();
};

// 删除技能
const removeSkill = (index) => {
  skills.value.splice(index, 1);
  updateSkills();
};

// 添加技能描述小项
const addSkillPoint = (skillIndex) => {
  if (!skills.value[skillIndex].points) {
    skills.value[skillIndex].points = [];
  }
  skills.value[skillIndex].points.push('');
  updateSkills();
};

// 移除技能描述小项
const removeSkillPoint = (skillIndex, pointIndex) => {
  skills.value[skillIndex].points.splice(pointIndex, 1);
  updateSkills();
};

// 将技能数据更新到 store
const updateSkills = () => {
  resumeStore.updateResumeData('skills', JSON.parse(JSON.stringify(skills.value)));
};
</script>

<style scoped>
.skills-form {
  padding: 10px 0;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.skill-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  position: relative;
}

.skill-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.skill-name-input {
  flex: 1;
  margin-right: 10px;
}

.delete-btn {
  flex-shrink: 0;
}

.skill-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-level-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.level-label {
  font-size: 14px;
  color: #606266;
}

.skill-level-slider {
  width: 100%;
}

.skill-points-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.points-title {
  font-weight: 500;
  color: #606266;
}

.skill-points-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-point-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.remove-point-btn {
  flex-shrink: 0;
}

.no-points {
  padding: 10px;
  color: #909399;
  background-color: #f2f6fc;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}

.use-traditional-desc {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.use-traditional-desc span {
  color: #606266;
  font-size: 14px;
}

.skill-description-input {
  width: 100%;
}

.no-skills {
  text-align: center;
  color: #909399;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  justify-content: center;
}
</style> 