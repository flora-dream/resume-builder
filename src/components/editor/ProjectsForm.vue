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
            <span class="project-date" v-if="project.time">
              {{ project.time }}
            </span>
          </div>
        </template>

        <el-form :model="project" label-width="90px" size="default">
          <el-form-item label="项目名称">
            <el-input 
              v-model="project.name" 
              placeholder="例如：智能客服系统（NLP方向）" 
              @change="updateProjects" 
              clearable 
            />
          </el-form-item>
          
          <el-row :gutter="20">
            <el-col :span="24" :md="12">
              <el-form-item label="角色">
                <el-input 
                  v-model="project.role" 
                  placeholder="例如：算法工程师 & 后端开发" 
                  @change="updateProjects" 
                  clearable 
                />
              </el-form-item>
            </el-col>
            
            <el-col :span="24" :md="12">
              <el-form-item label="时间">
                <el-input 
                  v-model="project.time" 
                  placeholder="例如：2021.09-2022.06" 
                  @change="updateProjects" 
                  clearable
                >
                  <template #prefix>
                    <el-icon><Calendar /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="技术栈">
            <el-tooltip content="输入技术名称后按回车添加" placement="top">
              <el-select
                v-model="project.technologies"
                multiple
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
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
          
          <el-divider>项目描述</el-divider>
          
          <div class="project-description">
            <div class="description-section">
              <div class="section-title">
                <el-tag size="small" type="success" effect="plain">目标</el-tag>
              </div>
              <el-input 
                v-model="project.objective" 
                type="textarea" 
                :rows="2"
                placeholder="例如：为企业客户提供自动化问答服务，降低人工客服成本"
                @change="updateProjects"
              />
            </div>
            
            <div class="description-section">
              <div class="section-title">
                <el-tag size="small" type="warning" effect="plain">职责</el-tag>
              </div>
              <div class="responsibility-container">
                <div v-for="(resp, i) in project.responsibilities || []" :key="i" class="responsibility-item">
                  <el-input 
                    v-model="project.responsibilities[i]" 
                    placeholder="例如：基于BERT预训练模型微调，实现意图识别准确率92%"
                    @change="updateProjects"
                  >
                    <template #prefix>
                      <el-icon><StarFilled /></el-icon>
                    </template>
                    <template #append>
                      <el-button @click="removeResponsibility(project, i)">
                        <el-icon><Delete /></el-icon>
                      </el-button>
                      <el-button v-if="i === (project.responsibilities.length - 1)" @click="addResponsibility(project)">
                        <el-icon><Plus /></el-icon>
                      </el-button>
                    </template>
                  </el-input>
                </div>
              </div>
            </div>
            
            <div class="description-section">
              <div class="section-title">
                <el-tag size="small" type="danger" effect="plain">成果</el-tag>
              </div>
              <el-input 
                v-model="project.achievement" 
                type="textarea" 
                :rows="2"
                placeholder="例如：系统上线后客户问题解决率提升40%，节省人力成本60%"
                @change="updateProjects"
              />
            </div>
          </div>
          
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
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useResumeStore } from '../../stores/resumeStore';
import { Delete, Plus, Calendar, Monitor, CopyDocument, StarFilled } from '@element-plus/icons-vue';

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
  'Git', 'CI/CD', 'RESTful API', 'GraphQL',
  'BERT', 'Transformer', 'Django', 'Flask', 'FastAPI',
  'PyTorch', 'TensorFlow', 'Hadoop', 'Spark'
];

// 添加项目
const addProject = () => {
  const newProject = {
    name: '',
    role: '',
    time: '',
    technologies: [],
    objective: '',
    responsibilities: [''],
    achievement: ''
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

// 添加职责
const addResponsibility = (project) => {
  if (!project.responsibilities) {
    project.responsibilities = [];
  }
  project.responsibilities.push('');
  updateProjects();
};

// 删除职责
const removeResponsibility = (project, index) => {
  project.responsibilities.splice(index, 1);
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
        role: item.role || '',
        time: item.time || '',
        technologies: item.technologies || [],
        objective: item.objective || '',
        responsibilities: item.responsibilities || [''],
        achievement: item.achievement || '',
        // 保留原有数据，兼容旧格式
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        url: item.url || '',
        description: item.description || '',
        value: item.value || '',
        techStack: item.techStack || '',
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

.project-description {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.description-section {
  margin-bottom: 20px;
}

.section-title {
  margin-bottom: 8px;
}

.responsibility-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.responsibility-item {
  margin-bottom: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

:deep(.el-collapse-item__header) {
  font-size: 16px;
}

:deep(.el-collapse-item__content) {
  padding: 20px 15px;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-divider__text) {
  font-size: 14px;
  color: #606266;
  font-weight: bold;
}

/* 优化小屏幕上的布局 */
@media (max-width: 768px) {
  :deep(.el-form-item) {
    margin-bottom: 15px;
  }
}

:deep(.el-input-group__append) {
  padding: 0;
}

:deep(.el-input-group__append .el-button) {
  border: none;
  margin: 0;
  border-radius: 0;
}

:deep(.el-input-group__append .el-button:first-child) {
  border-right: 1px solid #dcdfe6;
}
</style> 