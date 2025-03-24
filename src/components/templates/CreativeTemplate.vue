<template>
  <div class="resume-template creative-template" :style="computedStyles">
    <!-- 侧边栏部分 -->
    <aside class="resume-sidebar">
      <div class="sidebar-header">
        <div v-if="resumeData.personalInfo.avatar" class="avatar-container">
          <img :src="resumeData.personalInfo.avatar" alt="头像" class="avatar" />
        </div>
        <h1 class="name">{{ resumeData.personalInfo.name || '你的姓名' }}</h1>
        <p class="title">{{ resumeData.personalInfo.title || '职位头衔' }}</p>
      </div>
      
      <div class="sidebar-content">
        <!-- 联系信息 -->
        <div class="contact-section">
          <h2 class="section-title">联系方式</h2>
          <ul class="contact-list">
            <li v-if="resumeData.personalInfo.email" class="contact-item">
              <span class="icon">✉</span>
              <span>{{ resumeData.personalInfo.email }}</span>
            </li>
            <li v-if="resumeData.personalInfo.phone" class="contact-item">
              <span class="icon">☏</span>
              <span>{{ resumeData.personalInfo.phone }}</span>
            </li>
            <li v-if="resumeData.personalInfo.location" class="contact-item">
              <span class="icon">⌂</span>
              <span>{{ resumeData.personalInfo.location }}</span>
            </li>
            <li v-if="resumeData.personalInfo.website" class="contact-item">
              <span class="icon">🌐</span>
              <span>{{ resumeData.personalInfo.website }}</span>
            </li>
          </ul>
        </div>
        
        <!-- 技能部分 -->
        <div v-if="resumeData.skills.length > 0" class="skills-section">
          <h2 class="section-title">技能专长</h2>
          <div class="skills-groups">
            <template v-for="category in skillCategories" :key="category">
              <div v-if="getSkillsByCategory(category).length > 0" class="skill-category">
                <h3 class="category-title">{{ category }}</h3>
                <div class="skill-bars">
                  <div v-for="(skill, index) in getSkillsByCategory(category)" :key="index" class="skill-item">
                    <div class="skill-info">
                      <span class="skill-name">{{ skill.name }}</span>
                      <span class="skill-level-text">{{ getLevelText(skill.level) }}</span>
                    </div>
                    <div class="skill-level">
                      <div class="skill-level-bar" :style="{ width: `${skill.level * 20}%` }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        
        <!-- 证书部分 -->
        <div v-if="resumeData.certifications.length > 0" class="certifications-section">
          <h2 class="section-title">证书</h2>
          <div class="certifications-list">
            <div v-for="(cert, index) in resumeData.certifications" :key="index" class="certification-item">
              <h3 class="cert-name">{{ cert.name }}</h3>
              <div class="cert-details">
                <span class="cert-issuer">{{ cert.issuer }}</span>
                <span class="cert-date">{{ cert.date }}</span>
              </div>
              <a v-if="cert.url" :href="cert.url" target="_blank" class="cert-link">查看证书</a>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主内容部分 -->
    <main class="resume-main">
      <!-- 个人简介 -->
      <section v-if="resumeData.personalInfo.summary" class="summary-section">
        <div class="section-header">
          <div class="section-icon">📋</div>
          <h2 class="section-title">个人简介</h2>
        </div>
        <div class="section-content">
          <p class="summary-text">{{ resumeData.personalInfo.summary }}</p>
        </div>
      </section>

      <!-- 工作经验 -->
      <section v-if="resumeData.workExperience.length > 0" class="work-section">
        <div class="section-header">
          <div class="section-icon">💼</div>
          <h2 class="section-title">工作经验</h2>
        </div>
        <div class="section-content">
          <div v-for="(job, index) in resumeData.workExperience" :key="index" class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="item-header">
                <h3 class="item-title">{{ job.position }}</h3>
                <div class="item-period">{{ job.startDate }} - {{ job.current ? '至今' : job.endDate }}</div>
              </div>
              <h4 class="item-subtitle">{{ job.company }}</h4>
              <p v-if="job.description" class="item-description">{{ job.description }}</p>
              <ul v-if="job.achievements && job.achievements.length > 0" class="achievements-list">
                <li v-for="(achievement, i) in job.achievements" :key="i">{{ achievement }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 教育背景 -->
      <section v-if="resumeData.education.length > 0" class="education-section">
        <div class="section-header">
          <div class="section-icon">🎓</div>
          <h2 class="section-title">教育背景</h2>
        </div>
        <div class="section-content">
          <div v-for="(edu, index) in resumeData.education" :key="index" class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="item-header">
                <h3 class="item-title">{{ edu.school }}</h3>
                <div class="item-period">{{ edu.startDate }} - {{ edu.endDate }}</div>
              </div>
              <h4 class="item-subtitle">{{ edu.degree }} {{ edu.major ? `· ${edu.major}` : '' }}</h4>
              <p v-if="edu.description" class="item-description">{{ edu.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 项目经验 -->
      <section v-if="resumeData.projects.length > 0" class="projects-section">
        <div class="section-header">
          <div class="section-icon">🚀</div>
          <h2 class="section-title">项目经验</h2>
        </div>
        <div class="section-content projects-grid">
          <div v-for="(project, index) in resumeData.projects" :key="index" class="project-card">
            <div class="project-card-header">
              <h3 class="project-name">{{ project.name }}</h3>
              <div class="project-period">{{ project.startDate }} - {{ project.endDate }}</div>
            </div>
            <p v-if="project.description" class="project-description">{{ project.description }}</p>
            <ul v-if="project.highlights && project.highlights.length > 0" class="project-highlights">
              <li v-for="(highlight, i) in project.highlights" :key="i">{{ highlight }}</li>
            </ul>
            <a v-if="project.url" :href="project.url" target="_blank" class="project-link">
              查看项目 <span class="link-arrow">→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
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

// 获取所有技能类别
const skillCategories = computed(() => {
  const categories = new Set();
  resumeData.value.skills.forEach(skill => {
    if (skill.category) {
      categories.add(skill.category);
    } else {
      categories.add('其他');
    }
  });
  return Array.from(categories);
});

// 根据类别获取技能
const getSkillsByCategory = (category) => {
  return resumeData.value.skills.filter(skill => {
    if (category === '其他') {
      return !skill.category || skill.category === '其他';
    }
    return skill.category === category;
  });
};

// 获取技能等级文本
const getLevelText = (level) => {
  const texts = ['入门', '基础', '熟悉', '精通', '专家'];
  return texts[Math.min(Math.floor(level) - 1, 4)] || '';
};

// 接收缩放比例属性
const props = defineProps({
  scale: {
    type: Number,
    default: 1
  }
});
</script>

<style scoped>
.creative-template {
  width: 210mm; /* A4宽度 */
  min-height: 297mm; /* A4高度 */
  background-color: var(--background-color, #ffffff);
  color: var(--text-color, #333333);
  font-family: var(--body-font, 'Arial, sans-serif');
  font-size: var(--font-size, '14px');
  display: flex;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

/* 侧边栏 */
.resume-sidebar {
  width: 70mm;
  background-color: var(--primary-color, #2c3e50);
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
}

.avatar-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 15px;
  overflow: hidden;
  border: 3px solid white;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-header .name {
  font-size: 24px;
  margin: 10px 0 5px;
  font-family: var(--heading-font, 'Arial, sans-serif');
}

.sidebar-header .title {
  font-size: 16px;
  margin: 0 0 10px;
  color: rgba(255, 255, 255, 0.8);
}

.sidebar-content {
  flex: 1;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.contact-item .icon {
  margin-right: 10px;
  font-size: 18px;
}

.section-title {
  font-size: 18px;
  margin: 20px 0 15px;
  color: white;
  border-bottom: 2px solid var(--secondary-color, #3498db);
  padding-bottom: 5px;
  font-family: var(--heading-font, 'Arial, sans-serif');
}

/* 主内容区 */
.resume-main {
  flex: 1;
  padding: 30px;
  background-color: white;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.section-icon {
  font-size: 24px;
  margin-right: 10px;
  color: var(--secondary-color, #3498db);
}

.resume-main .section-title {
  color: var(--primary-color, #2c3e50);
  border-bottom: none;
  margin: 0;
}

.timeline-item {
  position: relative;
  padding-left: 30px;
  margin-bottom: 25px;
}

.timeline-marker {
  position: absolute;
  left: 0;
  top: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--secondary-color, #3498db);
}

.timeline-marker:before {
  content: '';
  position: absolute;
  left: 5px;
  top: 12px;
  width: 2px;
  height: calc(100% + 13px);
  background-color: var(--secondary-color, #3498db);
  opacity: 0.5;
}

.timeline-item:last-child .timeline-marker:before {
  display: none;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.item-title {
  font-size: 18px;
  color: var(--primary-color, #2c3e50);
  margin: 0;
  font-family: var(--heading-font, 'Arial, sans-serif');
}

.item-period {
  font-size: 14px;
  color: #666;
}

.item-subtitle {
  font-size: 16px;
  color: var(--secondary-color, #3498db);
  margin: 5px 0;
  font-weight: normal;
}

.item-description {
  margin: 10px 0;
}

.achievements-list, .project-highlights {
  padding-left: 20px;
  margin: 10px 0;
}

.achievements-list li, .project-highlights li {
  margin-bottom: 5px;
}

/* 项目卡片 */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.project-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

.project-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.project-card-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.project-name {
  font-size: 16px;
  margin: 0 0 5px;
  color: var(--primary-color, #2c3e50);
}

.project-period {
  font-size: 12px;
  color: #666;
}

.project-description {
  font-size: 14px;
  margin: 10px 0;
}

.project-link {
  display: inline-block;
  margin-top: 10px;
  color: var(--secondary-color, #3498db);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
}

.project-link:hover {
  color: var(--primary-color, #2c3e50);
}

.link-arrow {
  transition: transform 0.2s ease;
  display: inline-block;
}

.project-link:hover .link-arrow {
  transform: translateX(3px);
}

/* 技能部分 */
.skill-category {
  margin-bottom: 15px;
}

.category-title {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 10px 0 5px;
}

.skill-item {
  margin-bottom: 8px;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
}

.skill-name {
  font-size: 13px;
}

.skill-level-text {
  font-size: 12px;
  opacity: 0.8;
}

.skill-level {
  height: 6px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.skill-level-bar {
  height: 100%;
  background-color: var(--secondary-color, #3498db);
  border-radius: 3px;
}

/* 证书部分 */
.certification-item {
  margin-bottom: 15px;
}

.cert-name {
  font-size: 14px;
  margin: 0 0 5px;
  color: white;
}

.cert-details {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
}

.cert-link {
  font-size: 12px;
  color: var(--secondary-color, #3498db);
  text-decoration: none;
}

.cert-link:hover {
  text-decoration: underline;
}

/* 添加打印样式 */
@media print {
  .creative-template {
    width: 210mm !important;
    min-height: 297mm !important;
    box-shadow: none !important;
    transform: none !important;
    zoom: 100% !important;
  }
  
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style> 