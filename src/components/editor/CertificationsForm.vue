<template>
  <div class="certifications-form">
    <div class="section-header">
      <h3>证书</h3>
      <el-button type="primary" @click="addCertification" size="small">添加证书</el-button>
    </div>

    <div v-if="certificationsList.length === 0" class="empty-tip">
      <p>暂无证书，点击"添加证书"按钮添加</p>
    </div>

    <div v-else class="certifications-list">
      <div v-for="(cert, index) in certificationsList" :key="index" class="certification-item">
        <el-row :gutter="10">
          <el-col :span="22">
            <el-form :model="cert" label-width="100px">
              <el-form-item label="证书名称">
                <el-input v-model="cert.name" placeholder="请输入证书名称" />
              </el-form-item>
              
              <el-form-item label="发证机构">
                <el-input v-model="cert.issuer" placeholder="请输入发证机构" />
              </el-form-item>
              
              <el-form-item label="获得日期">
                <el-input v-model="cert.date" placeholder="例如：2022年5月" />
              </el-form-item>
              
              <el-form-item label="证书链接">
                <el-input v-model="cert.url" placeholder="证书URL（可选）" />
              </el-form-item>
            </el-form>
          </el-col>
          
          <el-col :span="2" class="action-column">
            <el-button 
              type="danger" 
              icon="Delete" 
              circle 
              @click="removeCertification(index)"
              size="small"
            />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue';
import { useResumeStore } from '../../stores/resumeStore';

const resumeStore = useResumeStore();

// 证书列表
const certificationsList = reactive([]);

// 添加证书
const addCertification = () => {
  const newCert = {
    name: '',
    issuer: '',
    date: '',
    url: ''
  };
  
  certificationsList.push(newCert);
};

// 删除证书
const removeCertification = (index) => {
  certificationsList.splice(index, 1);
};

// 监听证书变化
watch(certificationsList, (newValue) => {
  resumeStore.updateCertifications([...newValue]);
}, { deep: true });

// 组件挂载时初始化数据
onMounted(() => {
  const storeData = resumeStore.resumeData.certifications;
  
  if (storeData && storeData.length > 0) {
    storeData.forEach(item => {
      certificationsList.push({...item});
    });
  } else {
    // 如果没有数据，添加一个空的表单
    addCertification();
  }
});
</script>

<style scoped>
.certifications-form {
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
}

.empty-tip {
  text-align: center;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 4px;
  color: #999;
}

.certifications-list {
  margin-top: 15px;
}

.certification-item {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fafafa;
}

.action-column {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 