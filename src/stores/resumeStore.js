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
    selectedTemplate: 'classic',  // 默认使用经典模板
    themeOptions: {
      primaryColor: '#2c3e50',
      secondaryColor: '#3498db',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      headingFont: 'Arial, sans-serif',
      bodyFont: 'Arial, sans-serif',
      fontSize: '14px',
      layoutType: 'standard'
    }
  }),
  
  actions: {
    updatePersonalInfo(data) {
      this.resumeData.personalInfo = { ...this.resumeData.personalInfo, ...data }
      this.saveToLocalStorage()
    },
    
    updateEducation(data) {
      this.resumeData.education = data
      this.saveToLocalStorage()
    },
    
    updateWorkExperience(data) {
      this.resumeData.workExperience = data
      this.saveToLocalStorage()
    },
    
    updateSkills(data) {
      this.resumeData.skills = data
      this.saveToLocalStorage()
    },
    
    updateProjects(data) {
      this.resumeData.projects = data
      this.saveToLocalStorage()
    },
    
    updateCertifications(data) {
      this.resumeData.certifications = data
      this.saveToLocalStorage()
    },
    
    selectTemplate(templateId) {
      this.selectedTemplate = templateId
      this.saveToLocalStorage()
    },
    
    updateThemeOptions(options) {
      this.themeOptions = { ...this.themeOptions, ...options }
      this.saveToLocalStorage()
    },
    
    saveToLocalStorage() {
      localStorage.setItem('resumeData', JSON.stringify(this.resumeData))
      localStorage.setItem('selectedTemplate', this.selectedTemplate)
      localStorage.setItem('themeOptions', JSON.stringify(this.themeOptions))
    },
    
    loadFromLocalStorage() {
      const resumeData = localStorage.getItem('resumeData')
      const selectedTemplate = localStorage.getItem('selectedTemplate')
      const themeOptions = localStorage.getItem('themeOptions')
      
      if (resumeData) {
        this.resumeData = JSON.parse(resumeData)
      }
      
      if (selectedTemplate) {
        this.selectedTemplate = selectedTemplate
      }
      
      if (themeOptions) {
        this.themeOptions = JSON.parse(themeOptions)
      }
    }
  }
}) 