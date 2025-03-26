<template>
  <div class="projects-form">
    <div class="section-header">
      <h3>项目经验</h3>
      <el-button type="primary" @click="addProject" size="small">
        <el-icon><Plus /></el-icon> 添加项目
      </el-button>
    </div>

    <div v-if="projectsList.length === 0" class="empty-tip">
      <p>暂无项目经验，点击上方"添加项目"按钮添加</p>
    </div>

    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item v-for="(project, index) in projectsList" :key="index" :name="index">
        <template #title>
          <div class="collapse-title">
            <span>{{ project.name || '未命名项目' }}</span>
            <span class="project-date" v-if="project.startDate || project.endDate">
              {{ project.startDate }}{{ project.endDate ? ` - ${project.endDate}` : '' }}
            </span>
          </div>
        </template>

        <el-form :model="project" label-width="90px" size="default">
          <el-form-item label="项目名称">
            <el-input 
              v-model="project.name" 
              placeholder="请输入项目名称" 
              @change="updateProjects" 
              clearable 
            />
          </el-form-item>
          
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="开始日期">
                <el-input 
                  v-model="project.startDate" 
                  placeholder="例如：2021.03" 
                  @change="updateProjects" 
                  clearable
                  class="date-input"
                >
                  <template #prefix>
                    <el-icon><Calendar /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            
            <el-col :span="12">
              <el-form-item label="结束日期">
                <el-input 
                  v-model="project.endDate" 
                  placeholder="例如：2021.09" 
                  @change="updateProjects" 
                  clearable
                  class="date-input"
                >
                  <template #prefix>
                    <el-icon><Calendar /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="项目链接">
            <el-input v-model="project.url" placeholder="项目URL（可选）" @change="updateProjects" clearable>
              <template #prefix>
                <el-icon><Link /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <el-tabs type="border-card" class="project-tabs">
            <el-tab-pane label="基本信息">
              <el-form-item label="项目描述">
                <el-input 
                  v-model="project.description" 
                  type="textarea" 
                  :rows="3"
                  placeholder="描述项目的背景、目标和您的职责"
                  @change="updateProjects"
                />
              </el-form-item>
              
              <el-form-item label="项目价值">
                <el-input 
                  v-model="project.value" 
                  type="textarea" 
                  :rows="2" 
                  placeholder="描述项目的业务价值和意义"
                  @change="updateProjects"
                />
              </el-form-item>
            </el-tab-pane>
            
            <el-tab-pane label="技术与成果">
              <el-form-item label="关键技术">
                <el-tooltip content="输入技术名称后按回车添加" placement="top">
                  <el-select
                    v-model="project.technologies"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="添加关键技术和工具"
                    style="width: 100%"
                    @change="updateProjects"
                  >
                    <el-option
                      v-for="tech in commonTechnologies"
                      :key="tech"
                      :label="tech"
                      :value="tech"
                    />
                  </el-select>
                </el-tooltip>
              </el-form-item>
              
              <el-divider content-position="left">项目亮点</el-divider>
              
              <div class="highlight-container">
                <div v-for="(highlight, i) in project.highlights || []" :key="i" class="highlight-item">
                  <el-input 
                    v-model="project.highlights[i]" 
                    placeholder="请输入项目亮点或成就"
                    @change="updateProjects"
                  >
                    <template #prefix>
                      <el-icon><Star /></el-icon>
                    </template>
                    <template #append>
                      <el-button @click="removeHighlight(project, i)">
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </template>
                  </el-input>
                </div>
                <el-button 
                  type="success" 
                  size="small" 
                  plain 
                  @click="addHighlight(project)" 
                  class="add-highlight-btn"
                >
                  <el-icon><Plus /></el-icon> 添加亮点
                </el-button>
              </div>
              
              <el-divider content-position="left">项目成果</el-divider>
              
              <div class="outcome-container">
                <div v-for="(outcome, outcomeIndex) in project.outcomes || []" :key="outcomeIndex" class="outcome-item">
                  <el-input 
                    v-model="project.outcomes[outcomeIndex]" 
                    placeholder="项目取得的具体成果或量化结果"
                    @change="updateProjects"
                  >
                    <template #prefix>
                      <el-icon><Trophy /></el-icon>
                    </template>
                    <template #append>
                      <el-button @click="removeOutcome(index, outcomeIndex)">
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </template>
                  </el-input>
                </div>
                <el-button 
                  type="success" 
                  size="small" 
                  plain 
                  @click="addOutcome(index)"
                  class="add-outcome-btn"
                >
                  <el-icon><Plus /></el-icon> 添加成果
                </el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
          
          <div class="form-actions">
            <el-popconfirm
              title="确定要删除此项目吗？"
              @confirm="removeProject(index)"
              confirm-button-text="确定"
              cancel-button-text="取消"
            >
              <template #reference>
                <el-button type="danger" size="small">
                  <el-icon><Delete /></el-icon> 删除项目
                </el-button>
              </template>
            </el-popconfirm>
            
            <el-button @click="duplicateProject(index)" type="info" size="small">
              <el-icon><CopyDocument /></el-icon> 复制项目
            </el-button>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue';
import { useResumeStore } from '../../stores/resumeStore';
import { Delete, Plus, Star, Trophy, Link, CopyDocument, Calendar } from '@element-plus/icons-vue';

const resumeStore = useResumeStore();

// 项目列表
const projectsList = reactive([]);
// 展开的折叠面板
const activeNames = ref([0]);

// 常用技术列表（精简版）
const commonTechnologies = [
  'JavaScript', 'TypeScript', 'Vue.js', 'React', 'Angular',
  'Node.js', 'Java', 'Python', 'Go', 'C++', 
  'HTML/CSS', 'SASS/LESS', 'Webpack', 'Vite',
  'MongoDB', 'MySQL', 'PostgreSQL', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'Azure',
  'Git', 'CI/CD', 'RESTful API', 'GraphQL'
];

// 添加项目
const addProject = () => {
  const newProject = {
    name: '',
    startDate: '',
    endDate: '',
    url: '',
    description: '',
    value: '',
    technologies: [],
    highlights: [''],
    outcomes: ['']
  };
  
  projectsList.push(newProject);
  
  // 自动展开新添加的项
  nextTick(() => {
    activeNames.value = [projectsList.length - 1];
  });
  
  updateProjects();
};

// 删除项目
const removeProject = (index) => {
  projectsList.splice(index, 1);
  updateProjects();
};

// 复制项目
const duplicateProject = (index) => {
  const projectCopy = JSON.parse(JSON.stringify(projectsList[index]));
  projectCopy.name = `${projectCopy.name} (副本)`;
  projectsList.push(projectCopy);
  
  // 自动展开复制的项
  nextTick(() => {
    activeNames.value = [projectsList.length - 1];
  });
  
  updateProjects();
};

// 添加项目亮点
const addHighlight = (project) => {
  if (!project.highlights) {
    project.highlights = [];
  }
  project.highlights.push('');
  updateProjects();
};

// 删除项目亮点
const removeHighlight = (project, index) => {
  project.highlights.splice(index, 1);
  updateProjects();
};

// 添加项目成果
const addOutcome = (index) => {
  if (!projectsList[index].outcomes) {
    projectsList[index].outcomes = [];
  }
  projectsList[index].outcomes.push('');
  updateProjects();
};

// 删除项目成果
const removeOutcome = (index, outcomeIndex) => {
  projectsList[index].outcomes.splice(outcomeIndex, 1);
  updateProjects();
};

// 更新项目数据到store
const updateProjects = () => {
  try {
    resumeStore.updateProjects(JSON.parse(JSON.stringify(projectsList)));
  } catch (error) {
    console.error('更新项目数据失败:', error);
  }
};

// 组件挂载时初始化数据
onMounted(() => {
  const storeData = resumeStore.resumeData.projects;
  
  if (storeData && storeData.length > 0) {
    storeData.forEach(item => {
      // 确保所有项目有正确的默认字段
      projectsList.push({
        name: item.name || '',
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        url: item.url || '',
        description: item.description || '',
        value: item.value || '',
        technologies: item.technologies || [],
        highlights: item.highlights || [],
        outcomes: item.outcomes || []
      });
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
  font-size: 18px;
  color: #333;
}

.empty-tip {
  text-align: center;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 6px;
  color: #909399;
  font-size: 14px;
  margin-bottom: 20px;
  border: 1px dashed #dcdfe6;
}

.collapse-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-weight: 600;
}

.project-date {
  font-size: 12px;
  color: #909399;
  font-weight: normal;
}

.highlight-container, .outcome-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.add-highlight-btn, .add-outcome-btn {
  align-self: flex-start;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.project-tabs {
  margin-bottom: 20px;
}

:deep(.el-tabs__content) {
  padding: 20px;
}

:deep(.el-divider__text) {
  font-size: 14px;
  color: #606266;
}

:deep(.el-collapse-item__header) {
  font-size: 16px;
}

:deep(.el-collapse-item__content) {
  padding: 20px 15px;
}

/* 调整日期输入框样式 */
.date-input {
  width: 100%;
}

.date-input :deep(.el-input__wrapper) {
  padding-right: 8px;
}

.date-input :deep(.el-input__prefix) {
  margin-right: 4px;
}

/* 调整表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 18px;
}

/* 优化小屏幕上的布局 */
@media (max-width: 768px) {
  :deep(.el-form-item) {
    margin-bottom: 15px;
  }
  
  .el-row {
    --el-gutter-x: 12px;
  }
  
  :deep(.el-form-item__label) {
    padding-right: 4px;
    font-size: 13px;
  }
  
  /* 在小屏幕上调整日期字段的布局 */
  .date-input :deep(.el-input__wrapper) {
    padding: 0 8px;
  }
}
</style> 