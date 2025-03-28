<template>
  <div class="resume-template modern-template" :style="computedStyles">
    <header class="resume-header">
      <div class="profile-info">
        <div class="profile-avatar">
          <img v-if="resumeData.personalInfo.avatar" :src="resumeData.personalInfo.avatar" alt="个人头像" />
          <div v-else class="avatar-placeholder">
            {{ resumeData.personalInfo.name ? resumeData.personalInfo.name.charAt(0).toUpperCase() : 'U' }}
          </div>
        </div>
        <div class="name-title">
          <h1 class="name">{{ resumeData.personalInfo.name || '姓名' }}</h1>
          <p class="title">{{ resumeData.personalInfo.title || '职位头衔' }}</p>
        </div>
      </div>
      <div class="contact-info">
        <div class="contact-item" v-if="resumeData.personalInfo.email">
          <span class="contact-icon">✉</span>
          <span>{{ resumeData.personalInfo.email }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.personalInfo.phone">
          <span class="contact-icon">☏</span>
          <span>{{ resumeData.personalInfo.phone }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.personalInfo.location">
          <span class="contact-icon">⚲</span>
          <span>{{ resumeData.personalInfo.location }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.personalInfo.website">
          <span class="contact-icon">☍</span>
          <span>{{ resumeData.personalInfo.website }}</span>
        </div>
      </div>
    </header>

    <div class="resume-body">
      <div class="main-column">
        <section v-if="resumeData.personalInfo.summary" class="resume-section summary-section">
          <h2 class="section-title">个人简介</h2>
          <p class="summary">{{ resumeData.personalInfo.summary }}</p>
        </section>

        <section v-if="resumeData.workExperience && resumeData.workExperience.length > 0" class="resume-section">
          <h2 class="section-title">工作经验</h2>
          <div class="experience-list">
            <div v-for="(job, index) in resumeData.workExperience" :key="index" class="experience-item">
              <div class="experience-header">
                <div class="experience-company-position">
                  <h3 class="experience-company">{{ job.company }}</h3>
                  <p class="experience-position">{{ job.position }}</p>
                </div>
                <div class="experience-period">
                  {{ job.startDate }}<span v-if="job.endDate"> - {{ job.endDate }}</span><span v-else-if="job.current"> - 至今</span>
                </div>
              </div>
              <p v-if="job.description" class="experience-description">{{ job.description }}</p>
              <ul v-if="job.achievements && job.achievements.length > 0" class="achievements-list">
                <li v-for="(achievement, achievementIndex) in job.achievements" :key="achievementIndex">
                  {{ achievement }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section v-if="resumeData.projects && resumeData.projects.length > 0" class="resume-section">
          <h2 class="section-title">项目经验</h2>
          <div class="projects-list">
            <div v-for="(project, index) in resumeData.projects" :key="index" class="project-item">
              <div class="project-header">
                <h3 class="project-title">{{ project.name }}</h3>
                <div class="project-meta">
                  <span v-if="project.role" class="project-role">{{ project.role }}</span>
                  <span class="project-date">{{ project.time }}</span>
                </div>
              </div>
              
              <div class="project-content">
                <div v-if="project.technologies && project.technologies.length > 0" class="project-detail tech-section">
                  <span class="detail-label">技术：</span>
                  <div class="tech-tags">
                    <span v-for="(tech, techIndex) in project.technologies" :key="techIndex" class="tech-tag">
                      {{ tech }}
                    </span>
                  </div>
                </div>
                
                <div v-if="project.objective" class="project-detail">
                  <span class="detail-label">目标：</span>
                  <span class="detail-content">{{ project.objective }}</span>
                </div>

                <div v-if="project.responsibilities && project.responsibilities.length > 0" class="project-detail">
                  <span class="detail-label">职责：</span>
                  <div class="detail-list-container">
                    <ul class="detail-list">
                      <li v-for="(resp, respIndex) in project.responsibilities" :key="respIndex">
                        {{ resp }}
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div v-if="project.achievement" class="project-detail">
                  <span class="detail-label">成果：</span>
                  <span class="detail-content">{{ project.achievement }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="side-column">
        <section v-if="resumeData.education && resumeData.education.length > 0" class="resume-section">
          <h2 class="section-title">教育背景</h2>
          <div class="education-list">
            <div v-for="(edu, index) in resumeData.education" :key="index" class="education-item">
              <div class="education-school-info">
                <h3 class="education-school">{{ edu.school }}</h3>
                <div class="education-period">
                  <span v-if="edu.startDate">{{ edu.startDate }}</span>
                  <span v-if="edu.startDate && edu.graduationDate"> - </span>
                  <span>{{ edu.graduationDate }}</span>
                </div>
              </div>
              <div class="education-details">
                <p class="education-degree-major">
                  <span class="education-degree">{{ edu.degree }}</span>
                  <span v-if="edu.major" class="education-major">· {{ edu.major }}</span>
                </p>
                <p v-if="edu.description" class="education-description">{{ edu.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <section v-if="resumeData.skills && resumeData.skills.length > 0" class="resume-section">
          <h2 class="section-title">技能专长</h2>
          <div class="skills-container">
            <div v-for="(skill, index) in resumeData.skills" :key="index" class="skill-item">
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-level-badge">{{ skill.level }}%</span>
              </div>
              <div class="skill-level">
                <div class="skill-bar" :style="{ width: `${skill.level || 80}%` }"></div>
              </div>
              
              <ul v-if="skill.points && skill.points.length > 0" class="skill-points">
                <li v-for="(point, pointIndex) in skill.points" :key="pointIndex">
                  {{ point }}
                </li>
              </ul>
              
              <p v-else-if="skill.description" class="skill-description">{{ skill.description }}</p>
            </div>
          </div>
        </section>

        <section v-if="resumeData.certifications && resumeData.certifications.length > 0" class="resume-section">
          <h2 class="section-title">证书与认证</h2>
          <div class="certifications-list">
            <div v-for="(cert, index) in resumeData.certifications" :key="index" class="certification-item">
              <h3 class="certification-name">{{ cert.name }}</h3>
              <p class="certification-issuer">{{ cert.issuer }}</p>
              <span class="certification-date">{{ cert.date }}</span>
            </div>
          </div>
        </section>
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
  const primaryColor = themeOptions.value.primaryColor || '#3a7bd5';
  const secondaryColor = themeOptions.value.secondaryColor || '#00d2ff';
  
  // 将颜色转换为RGB格式
  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      '58, 123, 213';
  };
  
  return {
    '--primary-color': primaryColor,
    '--primary-color-rgb': hexToRgb(primaryColor),
    '--secondary-color': secondaryColor,
    '--secondary-color-rgb': hexToRgb(secondaryColor),
    '--background-color': themeOptions.value.backgroundColor || '#ffffff',
    '--text-color': themeOptions.value.textColor || '#333333',
    '--accent-color': '#f0f0f0',
    '--heading-font': themeOptions.value.headingFont || 'Roboto, Arial, sans-serif',
    '--body-font': themeOptions.value.bodyFont || 'Open Sans, Arial, sans-serif',
    '--font-size': themeOptions.value.fontSize || '14px',
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
  font-size: var(--font-size, 14px);
  line-height: 1.5;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  aspect-ratio: 1 / 1.414; /* A4纸张长宽比 */
}

/* 头部样式 */
.resume-header {
  background: linear-gradient(135deg, var(--primary-color, #3a7bd5), var(--secondary-color, #00d2ff));
  padding: 25px 30px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.6);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  background: linear-gradient(45deg, #f3f3f3, #e2e2e2);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-size: 40px;
  font-weight: bold;
}

.name-title {
  display: flex;
  flex-direction: column;
}

.name {
  margin: 0 0 5px 0;
  font-family: var(--heading-font, 'Roboto', Arial, sans-serif);
  font-size: 24px;
  letter-spacing: 0.5px;
}

.title {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-end;
  max-width: 40%;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  padding: 4px 10px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 30px;
}

.contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

/* 主体样式 */
.resume-body {
  display: flex;
  flex: 1;
}

.main-column {
  flex: 3;
  padding: 20px;
}

.side-column {
  flex: 1.5;
  background-color: #f7f7f7;
  padding: 20px;
  border-left: 1px solid #e8e8e8;
}

.resume-section {
  margin-bottom: 18px;
  position: relative;
}

.section-title {
  font-family: var(--heading-font, 'Roboto', Arial, sans-serif);
  font-size: 18px;
  color: var(--primary-color, #3a7bd5);
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 8px;
  position: relative;
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: var(--secondary-color, #00d2ff);
}

.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color, #3a7bd5);
  opacity: 0.3;
}

/* 工作经验样式 */
.experience-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.experience-item {
  padding-left: 15px;
  border-left: 2px solid var(--accent-color, #f0f0f0);
  position: relative;
  padding-bottom: 4px;
}

.experience-item::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 9px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--primary-color, #3a7bd5);
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.experience-company-position {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.experience-company {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  line-height: 1.3;
  position: relative;
  display: inline-block;
}

.experience-company::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  transform: scaleX(0);
  background-color: var(--secondary-color, #00d2ff);
  transition: transform 0.3s;
  transform-origin: left;
}

.experience-item:hover .experience-company::after {
  transform: scaleX(1);
}

.experience-position {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: #606266;
  line-height: 1.3;
}

.experience-period {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  background-color: #f0f2f5;
  padding: 0 6px;
  height: 18px;
  line-height: 18px;
  border-radius: 3px;
  margin-top: 2px;
}

.experience-description {
  margin: 6px 0;
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
}

.achievements-list {
  margin: 0;
  padding-left: 14px;
}

.achievements-list li {
  margin-bottom: 2px;
  position: relative;
  font-size: 12px;
  line-height: 1.4;
  color: #606266;
}

/* 项目经验样式 */
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.project-item {
  padding: 12px;
  border-radius: 4px;
  background-color: #f8f9fa;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: all 0.25s ease;
}

.project-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #ebeef5;
}

.project-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.project-role {
  font-size: 12px;
  color: #606266;
}

.project-date {
  font-size: 12px;
  color: #909399;
  background-color: #f0f2f5;
  padding: 0 6px;
  height: 18px;
  line-height: 18px;
  border-radius: 3px;
}

.project-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.project-detail {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: #606266;
  white-space: nowrap;
  min-width: 36px;
}

.detail-content {
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
  flex: 1;
}

.detail-list-container {
  flex: 1;
}

.detail-list {
  margin: 0;
  padding-left: 14px;
}

.detail-list li {
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
  margin-bottom: 2px;
  position: relative;
}

.tech-section {
  align-items: center;
  margin-bottom: 4px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex: 1;
}

.tech-tag {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  font-size: 11px;
  line-height: 1;
  border-radius: 10px;
  white-space: nowrap;
  color: #606266;
  background-color: #f0f2f5;
  box-sizing: border-box;
}

.tech-tag:hover {
  color: #303133;
  background-color: #e4e7ed;
}

/* 技能样式 */
.skills-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-item {
  position: relative;
  background-color: #f9f9f9;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s;
}

.skill-item:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.skill-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  position: relative;
  display: inline-block;
}

.skill-name::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 1px;
  transform: scaleX(0);
  background-color: var(--secondary-color, #00d2ff);
  transition: transform 0.3s;
  transform-origin: left;
}

.skill-item:hover .skill-name::after {
  transform: scaleX(0.8);
}

.skill-level-badge {
  font-size: 11px;
  color: #fff;
  background: linear-gradient(to right, var(--primary-color, #3a7bd5), var(--secondary-color, #00d2ff));
  padding: 1px 6px;
  border-radius: 10px;
  font-weight: 500;
}

.skill-level {
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.skill-bar {
  height: 100%;
  background: linear-gradient(to right, var(--primary-color, #3a7bd5), var(--secondary-color, #00d2ff));
  border-radius: 3px;
  transition: width 0.5s;
}

/* 技能小项列表样式 */
.skill-points {
  margin: 6px 0 0 0;
  padding-left: 15px;
  font-size: 12px;
  color: #555;
  line-height: 1.4;
}

.skill-points li {
  margin-bottom: 2px;
  position: relative;
}

.skill-points li:before {
  content: "";
  position: absolute;
  left: -10px;
  top: 6px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: var(--primary-color, #3a7bd5);
}

.skill-description {
  margin: 5px 0 0 0;
  font-size: 12px;
  color: #555;
  line-height: 1.4;
  font-style: italic;
}

/* 教育背景样式 */
.education-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.education-item {
  padding-bottom: 8px;
  margin-bottom: 0;
  border-bottom: 1px solid #eee;
}

.education-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.education-school-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.education-school {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color, #3a7bd5);
  margin: 0;
  position: relative;
  display: inline-block;
}

.education-school::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  transform: scaleX(0);
  background-color: var(--secondary-color, #00d2ff);
  transition: transform 0.3s;
  transform-origin: left;
}

.education-item:hover .education-school::after {
  transform: scaleX(1);
}

.education-period {
  font-size: 11px;
  color: #888;
  white-space: nowrap;
}

.education-details {
  margin-top: 1px;
}

.education-degree-major {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #333;
  line-height: 1.3;
  margin: 0;
}

.education-degree {
  font-weight: 500;
}

.education-major {
  margin-left: 4px;
  color: #555;
}

.education-description {
  margin: 3px 0 0;
  font-size: 11px;
  color: #666;
  line-height: 1.3;
}

/* 证书样式 */
.certifications-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.certification-item {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid var(--primary-color, #3a7bd5);
}

.certification-item:hover .certification-name::after {
  transform: scaleX(0.8);
}

.certification-name {
  margin: 0 0 3px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  position: relative;
  display: inline-block;
}

.certification-name::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 1px;
  transform: scaleX(0);
  background-color: var(--secondary-color, #00d2ff);
  transition: transform 0.3s;
  transform-origin: left;
}

.certification-issuer {
  margin: 0 0 3px;
  font-size: 12px;
  color: #666;
}

.certification-date {
  font-size: 11px;
  color: #888;
}

/* 个人简介样式 */
.summary {
  font-size: 15px;
  line-height: 1.6;
  color: #555;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  border-left: 3px solid var(--primary-color, #3a7bd5);
}

/* 打印样式 */
@media print {
  .modern-template {
    box-shadow: none;
  }
  
  .resume-header {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .side-column {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  .project-item:hover {
    transform: none;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  .skill-item:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .skill-level-badge {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .skill-bar {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .skill-points li:before {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .experience-item::before {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .experience-period {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  /* 打印时显示hover的下划线效果 */
  .experience-company::after,
  .project-title::after,
  .education-school::after,
  .skill-name::after,
  .certification-name::after {
    transform: scaleX(0.7) !important;
  }
  
  /* 确保section-title渐变在打印时可见 */
  .section-title {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .section-title::before {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .section-title::after {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    opacity: 0.3 !important;
    width: 100% !important; /* 在打印时调整长横线宽度 */
  }
}
</style>