<template>
  <div class="projects-form">
    <div class="section-header">
      <h3>项目经验</h3>
      <el-button type="primary" @click="addProject" size="small">添加项目</el-button>
    </div>

    <div v-if="projectsList.length === 0" class="empty-tip">
      <p>暂无项目经验，点击"添加项目"按钮添加</p>
    </div>

    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="(project, index) in projectsList" :key="index" :name="index">
        <template #title>
          <div class="collapse-title">
            <span>{{ project.name || '未命名项目' }}</span>
          </div>
        </template>

        <el-form :model="project" label-width="100px">
          <el-form-item label="项目名称">
            <el-input v-model="project.name" placeholder="请输入项目名称" />
          </el-form-item>
          
          <el-form-item label="开始日期">
            <el-input v-model="project.startDate" placeholder="例如：2021年3月" />
          </el-form-item>
          
          <el-form-item label="结束日期">
            <el-input v-model="project.endDate" placeholder="例如：2021年9月" />
          </el-form-item>
          
          <el-form-item label="项目链接">
            <el-input v-model="project.url" placeholder="项目URL（可选）" />
          </el-form-item>
          
          <el-form-item label="项目描述">
            <el-input 
              v-model="project.description" 
              type="textarea" 
              :rows="3"
              placeholder="描述项目的背景、目标和您的职责"
            />
          </el-form-item>
          
          <el-form-item label="项目亮点">
            <div v-for="(highlight, i) in project.highlights" :key="i" class="highlight-item">
              <el-input v-model="project.highlights[i]" placeholder="项目亮点或成就">
                <template #append>
                  <el-button @click="removeHighlight(project, i)" icon="Delete" />
                </template>
              </el-input>
            </div>
            <el-button 
              type="primary" 
              size="small" 
              plain 
              @click="addHighlight(project)" 
              icon="Plus"
              style="margin-top: 5px;">
              添加亮点
            </el-button>
          </el-form-item>
          
          <div class="form-actions">
            <el-button type="danger" @click="removeProject(index)" size="small">删除</el-button>
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

// 项目列表
const projectsList = reactive([]);
// 展开的折叠面板
const activeNames = ref([0]);

// 添加项目
const addProject = () => {
  const newProject = {
    name: '',
    startDate: '',
    endDate: '',
    url: '',
    description: '',
    highlights: []
  };
  
  projectsList.push(newProject);
  
  // 自动展开新添加的项
  nextTick(() => {
    activeNames.value = [projectsList.length - 1];
  });
};

// 删除项目
const removeProject = (index) => {
  projectsList.splice(index, 1);
};

// 添加项目亮点
const addHighlight = (project) => {
  if (!project.highlights) {
    project.highlights = [];
  }
  project.highlights.push('');
};

// 删除项目亮点
const removeHighlight = (project, index) => {
  project.highlights.splice(index, 1);
};

// 监听项目变化
watch(projectsList, (newValue) => {
  resumeStore.updateProjects([...newValue]);
}, { deep: true });

// 组件挂载时初始化数据
onMounted(() => {
  const storeData = resumeStore.resumeData.projects;
  
  if (storeData && storeData.length > 0) {
    storeData.forEach(item => {
      projectsList.push({...item});
    });
  } else {
    // 如果没有数据，添加一个空的表单
    addProject();
  }
});
</script>

<style scoped>
.projects-form {
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

.highlight-item {
  margin-bottom: 5px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style> 