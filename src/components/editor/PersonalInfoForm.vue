<template>
  <div class="personal-info-form">
    <h3>个人信息</h3>
    
    <div class="avatar-section">
      <div class="avatar-preview" v-if="showAvatar">
        <img :src="currentAvatar" alt="头像预览" />
        <div class="avatar-controls">
          <el-button type="primary" size="small" circle @click="triggerUpload">
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button type="danger" size="small" circle @click="removeAvatar">
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </div>
      <div v-else class="upload-placeholder" @click="triggerUpload">
        <el-icon><Plus /></el-icon>
        <span>点击上传头像</span>
      </div>
      
      <!-- 隐藏的文件输入框 -->
      <input 
        type="file" 
        ref="fileInput" 
        style="display: none;" 
        accept="image/*" 
        @change="onFileSelected"
      />
    </div>
    
    <!-- 裁剪对话框 -->
    <el-dialog 
      v-model="showCropper" 
      title="裁剪头像" 
      width="500px"
      destroy-on-close
      center
    >
      <div class="cropper-container" v-if="showCropper">
        <Cropper
          ref="cropperRef"
          :src="cropImageSrc"
          :stencil-props="{aspectRatio: 1}"
          :resize-image="{adjustStencil: true}"
          image-restriction="stencil"
          :canvas="{width: 500, height: 300}"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCropper = false">取消</el-button>
          <el-button type="primary" @click="cropImage">确认</el-button>
        </span>
      </template>
    </el-dialog>
    
    <el-form label-position="top">
      <el-form-item label="姓名">
        <el-input v-model="personalInfo.name" placeholder="请输入姓名" />
      </el-form-item>
      
      <el-form-item label="职位头衔">
        <el-input v-model="personalInfo.title" placeholder="例如：高级前端开发工程师" />
      </el-form-item>
      
      <el-form-item label="电子邮箱">
        <el-input v-model="personalInfo.email" placeholder="例如：your.email@example.com" />
      </el-form-item>
      
      <el-form-item label="电话">
        <el-input v-model="personalInfo.phone" placeholder="例如：+86 138 8888 8888" />
      </el-form-item>
      
      <el-form-item label="所在地">
        <el-input v-model="personalInfo.location" placeholder="例如：北京市朝阳区" />
      </el-form-item>
      
      <el-form-item label="个人网站">
        <el-input v-model="personalInfo.website" placeholder="例如：https://yourwebsite.com" />
      </el-form-item>
      
      <el-form-item label="个人简介">
        <el-input
          v-model="personalInfo.summary"
          type="textarea"
          :rows="4"
          placeholder="简要介绍自己，包括专业领域、工作年限和核心技能等"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useResumeStore } from '../../stores/resumeStore';
import { Edit, Delete, Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import 'cropperjs/dist/cropper.css';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const resumeStore = useResumeStore();
const personalInfo = computed(() => resumeStore.resumeData.personalInfo);

// 头像相关状态
const fileInput = ref(null);
const currentAvatar = ref('');
const showAvatar = ref(false);
const showCropper = ref(false);
const cropImageSrc = ref('');
const cropperRef = ref(null);

// 初始化时检查是否有头像
onMounted(() => {
  if (personalInfo.value.avatar) {
    currentAvatar.value = personalInfo.value.avatar;
    showAvatar.value = true;
  }
});

// 触发文件上传
const triggerUpload = () => {
  fileInput.value.click();
};

// 文件选择处理
const onFileSelected = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  // 文件类型验证
  if (!file.type.includes('image/')) {
    ElMessage.error('请选择图片文件');
    return;
  }
  
  // 文件大小验证 (2MB)
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过2MB');
    return;
  }
  
  // 读取文件并显示裁剪器
  const reader = new FileReader();
  reader.onload = (event) => {
    cropImageSrc.value = event.target.result;
    showCropper.value = true;
  };
  reader.readAsDataURL(file);
  
  // 清空文件输入，允许重复选择同一文件
  e.target.value = '';
};

// 确认裁剪
const cropImage = () => {
  if (!cropperRef.value) {
    ElMessage.error('裁剪器未初始化');
    return;
  }
  
  const { coordinates, canvas } = cropperRef.value.getResult();
  
  if (canvas) {
    // 获取裁剪后的图片
    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
    
    // 更新头像
    currentAvatar.value = croppedImage;
    personalInfo.value.avatar = croppedImage;
    showAvatar.value = true;
    showCropper.value = false;
    
    // 保存到本地存储
    resumeStore.saveToLocalStorage();
    ElMessage.success('头像已更新');
  } else {
    ElMessage.error('裁剪失败，请重试');
  }
};

// 删除头像
const removeAvatar = () => {
  currentAvatar.value = '';
  personalInfo.value.avatar = '';
  showAvatar.value = false;
  resumeStore.saveToLocalStorage();
  ElMessage.success('头像已删除');
};
</script>

<style scoped>
.personal-info-form {
  padding: 10px 0;
}

.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.avatar-preview {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-controls {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-preview:hover .avatar-controls {
  opacity: 1;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  color: #8c939d;
  font-size: 14px;
  transition: border-color 0.3s;
}

.upload-placeholder:hover {
  border-color: #409EFF;
  color: #409EFF;
}

.upload-placeholder .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.cropper-container {
  height: 400px;
  width: 100%;
}

/* 修复裁剪对话框样式 */
:deep(.el-dialog__body) {
  padding: 10px 20px;
}

:deep(.vue-advanced-cropper) {
  height: 400px !important;
  max-height: 400px !important;
}
</style> 