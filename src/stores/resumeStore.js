import { defineStore } from 'pinia'

export const useResumeStore = defineStore('resume', {
  state: () => ({
    resumeData: {
      personalInfo: {
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
        summary: '',
        avatar: null
      },
      education: [],
      workExperience: [],
      skills: [],
      projects: [],
      certifications: []
    },
    selectedTemplate: localStorage.getItem('selectedTemplate') || 'classic', // 从本地存储中获取或使用默认模板
    themeOptions: {
      primaryColor: '#2c3e50',
      secondaryColor: '#3498db',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      headingFont: 'Arial, sans-serif',
      bodyFont: 'Arial, sans-serif',
      fontSize: '14px',
      layoutType: 'standard'
    },
    // 添加模板详情信息
    templateInfo: {
      classic: {
        name: '经典模板',
        description: '传统专业风格，适合多数行业的求职者',
        thumbnail: 'classic-preview'
      },
      creative: {
        name: '创意模板',
        description: '现代创新风格，适合设计和创意行业的求职者',
        thumbnail: 'creative-preview'
      },
      minimal: {
        name: '极简模板',
        description: '简约风格，留白设计，突出重点内容',
        thumbnail: 'minimal-preview'
      },
      modern: {
        name: '现代模板',
        description: '现代专业风格，平衡视觉效果和内容展示',
        thumbnail: 'modern-preview'
      }
    }
  }),
  
  actions: {
    // 从本地存储加载数据
    loadFromLocalStorage() {
      try {
        const resumeData = localStorage.getItem('resume-data');
        const themeOptions = localStorage.getItem('theme-options');
        
        if (resumeData) {
          this.resumeData = JSON.parse(resumeData);
        }
        
        if (themeOptions) {
          this.themeOptions = JSON.parse(themeOptions);
        }
        
        // selectedTemplate 已在 state 初始化时加载
      } catch (error) {
        console.error('加载本地存储数据失败:', error);
      }
    },
    
    // 保存数据到本地存储
    saveToLocalStorage() {
      try {
        localStorage.setItem('resume-data', JSON.stringify(this.resumeData));
        localStorage.setItem('theme-options', JSON.stringify(this.themeOptions));
        // selectedTemplate 在 selectTemplate 方法中保存
      } catch (error) {
        console.error('保存数据到本地存储失败:', error);
      }
    },
    
    // 选择模板并保存到本地存储
    selectTemplate(templateId) {
      this.selectedTemplate = templateId;
      localStorage.setItem('selectedTemplate', templateId);
      this.saveToLocalStorage();
    },
    
    // 更新简历数据
    updateResumeData(section, data) {
      this.resumeData[section] = data;
      this.saveToLocalStorage();
    },
    
    // 更新个人信息字段
    updatePersonalInfo(field, value) {
      this.resumeData.personalInfo[field] = value;
      this.saveToLocalStorage();
    },
    
    // 添加教育经历
    addEducation(education) {
      this.resumeData.education.push(education);
      this.saveToLocalStorage();
    },
    
    // 更新教育经历
    updateEducation(index, education) {
      this.resumeData.education[index] = education;
      this.saveToLocalStorage();
    },
    
    // 删除教育经历
    deleteEducation(index) {
      this.resumeData.education.splice(index, 1);
      this.saveToLocalStorage();
    },
    
    // 添加工作经验
    addWorkExperience(experience) {
      this.resumeData.workExperience.push(experience);
      this.saveToLocalStorage();
    },
    
    // 更新工作经验
    updateWorkExperience(index, experience) {
      this.resumeData.workExperience[index] = experience;
      this.saveToLocalStorage();
    },
    
    // 删除工作经验
    deleteWorkExperience(index) {
      this.resumeData.workExperience.splice(index, 1);
      this.saveToLocalStorage();
    },
    
    // 更新主题选项
    updateThemeOption(option, value) {
      this.themeOptions[option] = value;
      this.saveToLocalStorage();
    },
    
    // 获取模板详细信息
    getTemplateInfo(templateId) {
      return this.templateInfo[templateId] || this.templateInfo.classic;
    },
    
    // 更新项目经验
    updateProjects(projects) {
      this.resumeData.projects = projects;
      this.saveToLocalStorage();
    },
    
    // 更新证书信息
    updateCertifications(certifications) {
      this.resumeData.certifications = certifications;
      this.saveToLocalStorage();
    }
  },
  
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'resume-data',
        storage: localStorage
      }
    ]
  }
}) 