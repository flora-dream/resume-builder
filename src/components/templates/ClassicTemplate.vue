<template>
  <div class="resume-template classic-template" :style="computedStyles">
    <!-- 顶部个人信息 -->
    <header class="resume-header">
      <div class="header-main">
        <h1 class="name">{{ resumeData.personalInfo.name || '你的姓名' }}</h1>
        <p class="title">{{ resumeData.personalInfo.title || '职位头衔' }}</p>
      </div>
      <div class="contact-info">
        <div v-if="resumeData.personalInfo.email" class="contact-item">
          <span class="icon">✉</span>
          <span>{{ resumeData.personalInfo.email }}</span>
        </div>
        <div v-if="resumeData.personalInfo.phone" class="contact-item">
          <span class="icon">☏</span>
          <span>{{ resumeData.personalInfo.phone }}</span>
        </div>
        <div v-if="resumeData.personalInfo.location" class="contact-item">
          <span class="icon">⌂</span>
          <span>{{ resumeData.personalInfo.location }}</span>
        </div>
        <div v-if="resumeData.personalInfo.website" class="contact-item">
          <span class="icon">🌐</span>
          <span>{{ resumeData.personalInfo.website }}</span>
        </div>
      </div>
    </header>

    <!-- 简介部分 -->
    <section v-if="resumeData.personalInfo.summary" class="summary-section">
      <h2 class="section-title">个人简介</h2>
      <div class="section-content">
        <p>{{ resumeData.personalInfo.summary }}</p>
      </div>
    </section>

    <!-- 正文内容 -->
    <div class="resume-body">
      <!-- 左栏 -->
      <div class="left-column">
        <!-- 工作经验 -->
        <section v-if="resumeData.workExperience.length > 0" class="work-section">
          <h2 class="section-title">工作经验</h2>
          <div v-for="(job, index) in resumeData.workExperience" :key="index" class="work-item">
            <div class="work-header">
              <div class="work-title-company">
                <h3>{{ job.position }}</h3>
                <h4>{{ job.company }}</h4>
              </div>
              <div class="work-date">
                {{ job.startDate }} - {{ job.current ? '至今' : job.endDate }}
              </div>
            </div>
            <p v-if="job.description" class="work-description">{{ job.description }}</p>
            <ul v-if="job.achievements && job.achievements.length > 0" class="achievements-list">
              <li v-for="(achievement, i) in job.achievements" :key="i">{{ achievement }}</li>
            </ul>
          </div>
        </section>

        <!-- 项目经验 -->
        <section v-if="resumeData.projects.length > 0" class="projects-section">
          <h2 class="section-title">项目经验</h2>
          <div v-for="(project, index) in resumeData.projects" :key="index" class="project-item">
            <div class="project-header">
              <div class="project-title">
                <h3>{{ project.name }}</h3>
                <a v-if="project.url" :href="project.url" target="_blank" class="project-link">项目链接</a>
              </div>
              <div class="project-date">
                {{ project.startDate }} - {{ project.endDate }}
              </div>
            </div>
            <p v-if="project.description" class="project-description">{{ project.description }}</p>
            <ul v-if="project.highlights && project.highlights.length > 0" class="highlights-list">
              <li v-for="(highlight, i) in project.highlights" :key="i">{{ highlight }}</li>
            </ul>
          </div>
        </section>
      </div>

      <!-- 右栏 -->
      <div class="right-column">
        <!-- 教育背景 -->
        <section v-if="resumeData.education.length > 0" class="education-section">
          <h2 class="section-title">教育背景</h2>
          <div v-for="(edu, index) in resumeData.education" :key="index" class="education-item">
            <div class="education-header">
              <div class="education-degree-school">
                <h3>{{ edu.school }}</h3>
                <h4>{{ edu.degree }} {{ edu.major ? `· ${edu.major}` : '' }}</h4>
              </div>
              <div class="education-date">
                {{ edu.startDate }} - {{ edu.endDate }}
              </div>
            </div>
            <p v-if="edu.description" class="education-description">{{ edu.description }}</p>
          </div>
        </section>

        <!-- 技能 -->
        <section v-if="resumeData.skills.length > 0" class="skills-section">
          <h2 class="section-title">技能</h2>
          <div class="skills-content">
            <div v-for="(skill, index) in resumeData.skills" :key="index" class="skill-item">
              <span class="skill-name">{{ skill.name }}</span>
              <div class="skill-level">
                <div class="skill-level-bar" :style="{ width: `${skill.level * 20}%` }"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 证书 -->
        <section v-if="resumeData.certifications.length > 0" class="certifications-section">
          <h2 class="section-title">证书</h2>
          <div v-for="(cert, index) in resumeData.certifications" :key="index" class="certification-item">
            <div class="certification-header">
              <h3>{{ cert.name }}</h3>
              <div class="certification-issuer-date">
                <span>{{ cert.issuer }}</span>
                <span>{{ cert.date }}</span>
              </div>
            </div>
            <a v-if="cert.url" :href="cert.url" target="_blank" class="certification-link">查看证书</a>
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
    '--primary-color': themeOptions.value.primaryColor,
    '--secondary-color': themeOptions.value.secondaryColor,
    '--background-color': themeOptions.value.backgroundColor,
    '--text-color': themeOptions.value.textColor,
    '--heading-font': themeOptions.value.headingFont,
    '--body-font': themeOptions.value.bodyFont,
    '--font-size': themeOptions.value.fontSize,
  };
});
</script>

<style scoped>
.resume-template {
  width: 100%;
  min-height: 100%;
  background-color: var(--background-color, #ffffff);
  color: var(--text-color, #333333);
  font-family: var(--body-font, Arial, sans-serif);
  padding: 30px;
  box-sizing: border-box;
}

.classic-template {
  display: flex;
  flex-direction: column;
}

.resume-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-main .name {
  font-family: var(--heading-font, Arial, sans-serif);
  color: var(--primary-color, #2c3e50);
  font-size: 32px;
  margin: 0 0 5px 0;
}

.header-main .title {
  font-size: 18px;
  margin: 0;
  color: var(--secondary-color, #3498db);
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.section-title {
  color: var(--primary-color, #2c3e50);
  font-family: var(--heading-font, Arial, sans-serif);
  border-bottom: 1px solid var(--secondary-color, #3498db);
  padding-bottom: 5px;
  margin-top: 0;
}

.summary-section {
  margin-bottom: 20px;
}

.resume-body {
  display: flex;
  gap: 30px;
}

.left-column {
  flex: 3;
}

.right-column {
  flex: 2;
}

.work-item, .education-item, .project-item, .certification-item {
  margin-bottom: 15px;
}

.work-header, .education-header, .project-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.work-title-company h3, .education-degree-school h3, .project-title h3 {
  color: var(--primary-color, #2c3e50);
  margin: 0;
  font-size: 18px;
}

.work-title-company h4, .education-degree-school h4 {
  color: var(--secondary-color, #3498db);
  margin: 5px 0 0 0;
  font-size: 16px;
  font-weight: normal;
}

.work-date, .education-date, .project-date {
  font-size: 14px;
  color: #666;
}

.achievements-list, .highlights-list {
  padding-left: 20px;
  margin-top: 5px;
}

.achievements-list li, .highlights-list li {
  margin-bottom: 3px;
}

.skill-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.skill-name {
  flex: 1;
}

.skill-level {
  flex: 1;
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.skill-level-bar {
  height: 100%;
  background-color: var(--secondary-color, #3498db);
}

.certification-header {
  margin-bottom: 5px;
}

.certification-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--primary-color, #2c3e50);
}

.certification-issuer-date {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

.certification-link {
  color: var(--secondary-color, #3498db);
  text-decoration: none;
  font-size: 14px;
}

.certification-link:hover {
  text-decoration: underline;
}
</style> 