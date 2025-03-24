<template>
  <div class="resume-template minimal-template" :style="computedStyles">
    <!-- 头部个人信息 -->
    <header class="resume-header">
      <h1 class="name">{{ resumeData.personalInfo.name || '你的姓名' }}</h1>
      <p class="title">{{ resumeData.personalInfo.title || '职位头衔' }}</p>
      
      <div class="contact-info">
        <span v-if="resumeData.personalInfo.email" class="contact-item">
          {{ resumeData.personalInfo.email }}
        </span>
        <span class="separator" v-if="resumeData.personalInfo.email && resumeData.personalInfo.phone">|</span>
        <span v-if="resumeData.personalInfo.phone" class="contact-item">
          {{ resumeData.personalInfo.phone }}
        </span>
        <span class="separator" v-if="(resumeData.personalInfo.email || resumeData.personalInfo.phone) && resumeData.personalInfo.location">|</span>
        <span v-if="resumeData.personalInfo.location" class="contact-item">
          {{ resumeData.personalInfo.location }}
        </span>
        <span class="separator" v-if="(resumeData.personalInfo.email || resumeData.personalInfo.phone || resumeData.personalInfo.location) && resumeData.personalInfo.website">|</span>
        <span v-if="resumeData.personalInfo.website" class="contact-item">
          {{ resumeData.personalInfo.website }}
        </span>
      </div>
    </header>

    <!-- 简历内容区 -->
    <div class="resume-content">
      <!-- 个人简介 -->
      <section v-if="resumeData.personalInfo.summary" class="summary-section">
        <p class="summary-text">{{ resumeData.personalInfo.summary }}</p>
      </section>

      <!-- 分割线 -->
      <div class="divider"></div>

      <!-- 工作经验 -->
      <section v-if="resumeData.workExperience.length > 0" class="section">
        <h2 class="section-title">工作经验</h2>
        <div v-for="(job, index) in resumeData.workExperience" :key="index" class="item">
          <div class="item-header">
            <div class="header-left">
              <h3 class="item-title">{{ job.position }}</h3>
              <h4 class="item-subtitle">{{ job.company }}</h4>
            </div>
            <div class="header-right">
              <span class="item-date">{{ job.startDate }} - {{ job.current ? '至今' : job.endDate }}</span>
            </div>
          </div>
          <p v-if="job.description" class="item-description">{{ job.description }}</p>
          <ul v-if="job.achievements && job.achievements.length > 0" class="item-list">
            <li v-for="(achievement, i) in job.achievements" :key="i">{{ achievement }}</li>
          </ul>
        </div>
      </section>

      <!-- 教育经历 -->
      <section v-if="resumeData.education.length > 0" class="section">
        <h2 class="section-title">教育经历</h2>
        <div v-for="(edu, index) in resumeData.education" :key="index" class="item">
          <div class="item-header">
            <div class="header-left">
              <h3 class="item-title">{{ edu.school }}</h3>
              <h4 class="item-subtitle">{{ edu.degree }} {{ edu.major ? `· ${edu.major}` : '' }}</h4>
            </div>
            <div class="header-right">
              <span class="item-date">{{ edu.startDate }} - {{ edu.endDate }}</span>
            </div>
          </div>
          <p v-if="edu.description" class="item-description">{{ edu.description }}</p>
        </div>
      </section>

      <!-- 技能部分 -->
      <section v-if="resumeData.skills.length > 0" class="section">
        <h2 class="section-title">技能</h2>
        <div class="skills-container">
          <div v-for="(skill, index) in resumeData.skills" :key="index" class="skill-tag">
            {{ skill.name }}
          </div>
        </div>
      </section>

      <!-- 项目经验 -->
      <section v-if="resumeData.projects.length > 0" class="section">
        <h2 class="section-title">项目经验</h2>
        <div v-for="(project, index) in resumeData.projects" :key="index" class="item">
          <div class="item-header">
            <div class="header-left">
              <h3 class="item-title">{{ project.name }}</h3>
              <a v-if="project.url" :href="project.url" target="_blank" class="project-url">{{ project.url }}</a>
            </div>
            <div class="header-right">
              <span class="item-date">{{ project.startDate }} - {{ project.endDate }}</span>
            </div>
          </div>
          <p v-if="project.description" class="item-description">{{ project.description }}</p>
          <ul v-if="project.highlights && project.highlights.length > 0" class="item-list">
            <li v-for="(highlight, i) in project.highlights" :key="i">{{ highlight }}</li>
          </ul>
        </div>
      </section>

      <!-- 证书 -->
      <section v-if="resumeData.certifications.length > 0" class="section">
        <h2 class="section-title">证书</h2>
        <div class="certifications-grid">
          <div v-for="(cert, index) in resumeData.certifications" :key="index" class="certification-item">
            <div class="cert-header">
              <h3 class="cert-name">{{ cert.name }}</h3>
              <span class="cert-date">{{ cert.date }}</span>
            </div>
            <div class="cert-issuer">{{ cert.issuer }}</div>
            <a v-if="cert.url" :href="cert.url" target="_blank" class="cert-url">查看证书</a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useResumeStore } from '../../stores/resumeStore';

const resumeStore = useResumeStore();
const resumeData = computed(() => resumeStore.resumeData);
const themeOptions = computed(() => resumeStore.themeOptions);

// 计算CSS变量
const computedStyles = computed(() => {
  return {
    '--primary-color': themeOptions.value.primaryColor,
    '--secondary-color': themeOptions.value.secondaryColor,
    '--background-color': themeOptions.value.backgroundColor,
    '--text-color': themeOptions.value.textColor,
    '--heading-font': themeOptions.value.headingFont,
    '--body-font': themeOptions.value.bodyFont,
    '--font-size': themeOptions.value.fontSize,
    transform: props.scale ? `scale(${props.scale})` : 'scale(1)',
    transformOrigin: 'top left'
  };
});

// 接收缩放比例属性
const props = defineProps({
  scale: {
    type: Number,
    default: 1
  }
});
</script>

<style scoped>
.minimal-template {
  width: 210mm; /* A4宽度 */
  min-height: 297mm; /* A4高度 */
  background-color: var(--background-color, #ffffff);
  color: var(--text-color, #333333);
  font-family: var(--body-font, 'Helvetica, Arial, sans-serif');
  font-size: var(--font-size, '14px');
  padding: 40px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.3px;
  line-height: 1.5;
}

/* 头部样式 */
.resume-header {
  text-align: center;
  margin-bottom: 30px;
}

.name {
  font-size: 28px;
  font-weight: 400;
  margin: 0 0 5px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--primary-color, #2c3e50);
  font-family: var(--heading-font, 'Helvetica, Arial, sans-serif');
}

.title {
  font-size: 16px;
  color: var(--secondary-color, #3498db);
  margin: 0 0 15px;
  font-weight: 300;
}

.contact-info {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  font-size: 13px;
  color: #666;
}

.separator {
  margin: 0 8px;
  color: #ccc;
}

/* 内容区样式 */
.resume-content {
  max-width: 700px;
  margin: 0 auto;
}

.summary-section {
  margin-bottom: 30px;
  text-align: center;
}

.summary-text {
  font-size: 15px;
  color: #555;
  line-height: 1.6;
  font-weight: 300;
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 20px 0;
}

/* 章节样式 */
.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 400;
  margin: 0 0 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
  color: var(--primary-color, #2c3e50);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: var(--heading-font, 'Helvetica, Arial, sans-serif');
}

.item {
  margin-bottom: 20px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.item-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 2px;
  color: var(--primary-color, #2c3e50);
}

.item-subtitle {
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  color: var(--secondary-color, #3498db);
}

.item-date {
  font-size: 13px;
  color: #888;
}

.item-description {
  font-size: 14px;
  margin: 8px 0;
  color: #555;
}

.item-list {
  list-style-type: square;
  padding-left: 20px;
  margin: 8px 0;
}

.item-list li {
  font-size: 14px;
  margin-bottom: 5px;
  color: #555;
}

/* 技能标签 */
.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  display: inline-block;
  padding: 4px 12px;
  border: 1px solid #eee;
  border-radius: 15px;
  font-size: 13px;
  color: #555;
  background-color: #f9f9f9;
}

/* 证书样式 */
.certifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.certification-item {
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 4px;
}

.cert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.cert-name {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  color: var(--primary-color, #2c3e50);
}

.cert-date {
  font-size: 12px;
  color: #888;
}

.cert-issuer {
  font-size: 13px;
  color: #555;
  margin-bottom: 5px;
}

.cert-url, .project-url {
  font-size: 12px;
  color: var(--secondary-color, #3498db);
  text-decoration: none;
}

.cert-url:hover, .project-url:hover {
  text-decoration: underline;
}

/* 针对印刷的样式 */
@media print {
  .minimal-template {
    box-shadow: none;
    padding: 0;
  }
}
</style> 