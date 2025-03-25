<template>
  <div class="resume-template modern-template" :style="computedStyles">
    <div class="sidebar">
      <div class="profile-section">
        <div class="profile-avatar">
          <img v-if="resumeData.personalInfo.avatar" :src="resumeData.personalInfo.avatar" alt="个人头像" />
          <div v-else class="avatar-placeholder">
            {{ resumeData.personalInfo.name ? resumeData.personalInfo.name.charAt(0).toUpperCase() : 'U' }}
          </div>
        </div>
        <h1 class="name">{{ resumeData.personalInfo.name || '姓名' }}</h1>
        <p class="title">{{ resumeData.personalInfo.title || '职位头衔' }}</p>
      </div>

      <div class="sidebar-section">
        <h2 class="sidebar-title">联系方式</h2>
        <ul class="contact-list">
          <li v-if="resumeData.personalInfo.email">
            <span class="contact-icon">✉</span> {{ resumeData.personalInfo.email }}
          </li>
          <li v-if="resumeData.personalInfo.phone">
            <span class="contact-icon">☏</span> {{ resumeData.personalInfo.phone }}
          </li>
          <li v-if="resumeData.personalInfo.location">
            <span class="contact-icon">⌖</span> {{ resumeData.personalInfo.location }}
          </li>
          <li v-if="resumeData.personalInfo.linkedin">
            <span class="contact-icon">in</span> {{ resumeData.personalInfo.linkedin }}
          </li>
          <li v-if="resumeData.personalInfo.website">
            <span class="contact-icon">🔗</span> {{ resumeData.personalInfo.website }}
          </li>
        </ul>
      </div>

      <div class="sidebar-section">
        <h2 class="sidebar-title">技能</h2>
        <div class="skills-container">
          <div 
            v-for="(skill, index) in resumeData.skills" 
            :key="index" 
            class="skill-badge"
          >
            {{ skill.name }}
          </div>
        </div>
      </div>

      <div class="sidebar-section" v-if="resumeData.certifications && resumeData.certifications.length > 0">
        <h2 class="sidebar-title">证书</h2>
        <div class="certifications-list">
          <div v-for="(cert, index) in resumeData.certifications" :key="index" class="cert-item">
            <p class="cert-name">{{ cert.name }}</p>
            <p class="cert-issuer">{{ cert.issuer }}</p>
            <p class="cert-date">{{ cert.date }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <div class="summary-section" v-if="resumeData.personalInfo.summary">
        <h2 class="section-title">个人简介</h2>
        <p class="summary">{{ resumeData.personalInfo.summary }}</p>
      </div>

      <div class="work-section" v-if="resumeData.workExperience && resumeData.workExperience.length > 0">
        <h2 class="section-title">工作经验</h2>
        <div class="timeline">
          <div v-for="(job, index) in resumeData.workExperience" :key="index" class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="job-header">
                <h3 class="job-title">{{ job.title }}</h3>
                <div class="date-badge">{{ job.startDate }} - {{ job.endDate || '至今' }}</div>
              </div>
              <h4 class="company-name">{{ job.company }}</h4>
              <p class="job-description">{{ job.description }}</p>
              <ul class="achievements-list" v-if="job.achievements && job.achievements.length > 0">
                <li v-for="(achievement, i) in job.achievements" :key="i">{{ achievement }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div class="education-section" v-if="resumeData.education && resumeData.education.length > 0">
        <h2 class="section-title">教育经历</h2>
        <div class="timeline">
          <div v-for="(edu, index) in resumeData.education" :key="index" class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="edu-header">
                <h3 class="degree">{{ edu.degree }}</h3>
                <div class="date-badge">{{ edu.startDate }} - {{ edu.endDate || '至今' }}</div>
              </div>
              <h4 class="school-name">{{ edu.school }}</h4>
              <p class="edu-description">{{ edu.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="projects-section" v-if="resumeData.projects && resumeData.projects.length > 0">
        <h2 class="section-title">项目经验</h2>
        <div class="projects-grid">
          <div v-for="(project, index) in resumeData.projects" :key="index" class="project-card">
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-date">{{ project.startDate }} - {{ project.endDate || '至今' }}</p>
            <p class="project-description">{{ project.description }}</p>
            <ul class="highlights-list" v-if="project.highlights && project.highlights.length > 0">
              <li v-for="(highlight, i) in project.highlights" :key="i">{{ highlight }}</li>
            </ul>
            <a v-if="project.link" :href="project.link" target="_blank" class="project-link">查看项目</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useResumeStore } from '../../stores/resumeStore';

const resumeStore = useResumeStore();
const resumeData = computed(() => resumeStore.resumeData);
const themeOptions = computed(() => resumeStore.themeOptions);

const computedStyles = computed(() => {
  return {
    '--primary-color': themeOptions.value.primaryColor || '#2e5bff',
    '--secondary-color': themeOptions.value.secondaryColor || '#5accf5',
    '--background-color': themeOptions.value.backgroundColor || '#ffffff',
    '--sidebar-color': themeOptions.value.sidbarColor || '#f5f8ff',
    '--text-color': themeOptions.value.textColor || '#333333',
    '--heading-font': themeOptions.value.headingFont || 'Montserrat, Arial, sans-serif',
    '--body-font': themeOptions.value.bodyFont || 'Open Sans, Arial, sans-serif',
    '--font-size': themeOptions.value.fontSize || '10pt',
  };
});
</script>

<style scoped>
.modern-template {
  width: 100%;
  min-height: 297mm;
  background-color: var(--background-color, #ffffff);
  color: var(--text-color, #333333);
  font-family: var(--body-font, 'Open Sans', Arial, sans-serif);
  padding: 0;
  box-sizing: border-box;
  display: flex;
  position: relative;
}

.sidebar {
  width: 30%;
  background-color: var(--primary-color, #2e5bff);
  color: white;
  padding: 30px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-height: 297mm;
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 15px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  background: linear-gradient(135deg, #4a90e2, #63b3ed);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 40px;
  font-weight: bold;
}

.sidebar .name {
  margin: 0 0 5px;
  font-family: var(--heading-font, 'Montserrat', Arial, sans-serif);
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.sidebar .title {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.sidebar-section {
  margin-bottom: 25px;
}

.sidebar-title {
  font-family: var(--heading-font, 'Montserrat', Arial, sans-serif);
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.contact-list li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  line-height: 1.4;
  word-break: break-word;
}

.contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 12px;
  margin-right: 10px;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-badge {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 4px 12px;
  font-size: 11px;
  display: inline-block;
  color: white;
}

.certifications-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cert-item {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 5px;
  border-left: 3px solid rgba(255, 255, 255, 0.3);
}

.cert-name {
  font-weight: 600;
  margin: 0 0 5px 0;
  font-size: 12px;
  color: white;
}

.cert-issuer {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 5px 0;
}

.cert-date {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.main-content {
  width: 70%;
  padding: 30px;
  box-sizing: border-box;
  background-color: white;
  min-height: 297mm;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.section-title {
  font-family: var(--heading-font, 'Montserrat', Arial, sans-serif);
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color, #2e5bff);
  margin: 0 0 20px 0;
  position: relative;
  padding-bottom: 8px;
}

.section-title:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 3px;
  background-color: var(--primary-color, #2e5bff);
}

.summary {
  margin: 0;
  line-height: 1.6;
  color: #555;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline:before {
  content: '';
  position: absolute;
  left: 9px;
  top: 5px;
  bottom: 0;
  width: 2px;
  background-color: #e0e0e0;
}

.timeline-item {
  position: relative;
  margin-bottom: 25px;
}

.timeline-marker {
  position: absolute;
  left: -30px;
  top: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid var(--primary-color, #2e5bff);
  z-index: 1;
}

.timeline-content {
  background-color: rgba(245, 248, 255, 0.5);
  border-radius: 5px;
  padding: 15px;
  border-left: 3px solid var(--primary-color, #2e5bff);
}

.job-header, .edu-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.job-title, .degree {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-color, #2e5bff);
}

.date-badge {
  background-color: var(--primary-color, #2e5bff);
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
}

.company-name, .school-name {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.job-description, .edu-description {
  margin: 0 0 15px 0;
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}

.achievements-list, .highlights-list {
  margin: 0;
  padding-left: 20px;
  font-size: 12px;
  color: #555;
}

.achievements-list li, .highlights-list li {
  margin-bottom: 5px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.project-card {
  background-color: rgba(245, 248, 255, 0.5);
  border-radius: 8px;
  padding: 20px;
  border-top: 4px solid var(--primary-color, #2e5bff);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.project-title {
  margin: 0 0 10px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--primary-color, #2e5bff);
}

.project-date {
  margin: 0 0 10px 0;
  font-size: 11px;
  color: #666;
}

.project-description {
  margin: 0 0 15px 0;
  font-size: 12px;
  color: #555;
  line-height: 1.5;
}

.project-link {
  display: inline-block;
  margin-top: 10px;
  font-size: 12px;
  color: var(--primary-color, #2e5bff);
  text-decoration: none;
  font-weight: 500;
}

.project-link:hover {
  text-decoration: underline;
}

/* 打印样式 */
@media print {
  .modern-template {
    box-shadow: none;
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 297mm;
  }
  
  .sidebar {
    height: 100%;
    min-height: 297mm;
    break-inside: avoid;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  
  .main-content {
    height: 100%;
    min-height: 297mm;
  }
  
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>