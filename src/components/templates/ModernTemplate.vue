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
                <span class="project-date">{{ project.startDate }}{{ project.endDate ? ` - ${project.endDate}` : '' }}</span>
              </div>
              
              <p class="project-description">{{ project.description }}</p>
              
              <div v-if="project.value" class="project-value">
                <span class="value-label">项目价值：</span>
                <span class="value-content">{{ project.value }}</span>
              </div>
              
              <div v-if="project.technologies && project.technologies.length > 0" class="project-technologies">
                <span class="tech-label">技术栈：</span>
                <div class="tech-tags">
                  <span v-for="(tech, techIndex) in project.technologies" :key="techIndex" class="tech-tag">
                    {{ tech }}
                  </span>
                </div>
              </div>
              
              <div v-if="project.highlights && project.highlights.length > 0" class="project-highlights">
                <span class="highlights-label">项目亮点：</span>
                <ul class="highlights-list">
                  <li v-for="(highlight, highlightIndex) in project.highlights" :key="highlightIndex">
                    {{ highlight }}
                  </li>
                </ul>
              </div>
              
              <div v-if="project.outcomes && project.outcomes.length > 0" class="project-outcomes">
                <span class="outcomes-label">项目成果：</span>
                <ul class="outcomes-list">
                  <li v-for="(outcome, outcomeIndex) in project.outcomes" :key="outcomeIndex">
                    {{ outcome }}
                  </li>
                </ul>
              </div>
              
              <div v-if="project.url" class="project-link">
                <a :href="project.url" target="_blank">项目链接</a>
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
  return {
    '--primary-color': themeOptions.value.primaryColor || '#3a7bd5',
    '--secondary-color': themeOptions.value.secondaryColor || '#00d2ff',
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
}

.section-title {
  font-family: var(--heading-font, 'Roboto', Arial, sans-serif);
  font-size: 16px;
  color: var(--primary-color, #3a7bd5);
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--secondary-color, #00d2ff);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 工作经验样式 */
.experience-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.experience-item {
  padding-left: 15px;
  border-left: 2px solid var(--accent-color, #f0f0f0);
  position: relative;
  padding-bottom: 6px;
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
  margin-bottom: 8px;
}

.experience-company-position {
  display: flex;
  flex-direction: column;
}

.experience-company {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--primary-color, #3a7bd5);
  line-height: 1.3;
}

.experience-position {
  margin: 3px 0 0;
  font-size: 13px;
  font-weight: 500;
  color: #444;
  line-height: 1.3;
}

.experience-period {
  font-size: 12px;
  color: #777;
  white-space: nowrap;
  background-color: rgba(0,0,0,0.03);
  padding: 2px 6px;
  border-radius: 3px;
  margin-top: 2px;
}

.experience-description {
  margin: 6px 0;
  font-size: 13px;
  color: #555;
  line-height: 1.4;
}

.achievements-list {
  margin: 8px 0 0;
  padding-left: 18px;
}

.achievements-list li {
  margin-bottom: 4px;
  position: relative;
  font-size: 13px;
  line-height: 1.4;
  color: #555;
}

/* 项目经验样式 */
.projects-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.project-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.project-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-color, #3a7bd5);
}

.project-date {
  font-size: 12px;
  color: #888;
}

.project-description {
  margin: 8px 0 12px;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}

.project-link {
  margin-top: 8px;
}

.project-link a {
  color: var(--primary-color, #3a7bd5);
  font-size: 13px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.project-link a:hover {
  text-decoration: underline;
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

.certification-name {
  margin: 0 0 3px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
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
}

/* 项目展示样式 */
.project-value {
  margin: 8px 0;
  font-size: 13px;
  line-height: 1.4;
  color: #555;
}

.value-label {
  font-weight: 600;
  color: #444;
  margin-right: 5px;
}

.project-technologies {
  margin: 8px 0;
  display: flex;
  align-items: flex-start;
}

.tech-label {
  font-weight: 600;
  color: #444;
  font-size: 13px;
  margin-right: 5px;
  white-space: nowrap;
  padding-top: 2px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tech-tag {
  font-size: 11px;
  background-color: rgba(var(--primary-color-rgb, 58, 123, 213), 0.1);
  color: var(--primary-color, #3a7bd5);
  padding: 2px 8px;
  border-radius: 10px;
  white-space: nowrap;
}

.project-outcomes {
  margin: 8px 0;
}

.outcomes-label {
  font-weight: 600;
  color: #444;
  font-size: 13px;
  display: block;
  margin-bottom: 4px;
}

.outcomes-list {
  margin: 4px 0 0 0;
  padding-left: 18px;
}

.outcomes-list li {
  font-size: 13px;
  color: #555;
  line-height: 1.4;
  margin-bottom: 3px;
}

/* 添加项目亮点的样式 */
.project-highlights {
  margin: 8px 0;
}

.highlights-label {
  font-weight: 600;
  color: #444;
  font-size: 13px;
  display: block;
  margin-bottom: 4px;
}

.highlights-list {
  margin: 4px 0 0 0;
  padding-left: 18px;
}

.highlights-list li {
  font-size: 13px;
  color: #555;
  line-height: 1.4;
  margin-bottom: 3px;
}
</style>