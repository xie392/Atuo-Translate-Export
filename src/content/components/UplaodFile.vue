<template>
  <el-upload
    action="#"
    :accept="accept"
    :limit="1"
    ref="upload"
    :on-exceed="handleExceed"
    size="small"
    :auto-upload="false"
    :on-change="handleChange"
    drag
    class="mb-3"
    :before-remove="handleRemove"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">拖动或<em>点击上传</em></div>
    <template #tip>
      <div class="el-upload__tip">
        {{ tips }}
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadUserFile, UploadRawFile, UploadFile } from 'element-plus'

interface UploadFileProps {
  tips?: string
  accept?: string
}

withDefaults(defineProps<UploadFileProps>(), {
  accept: '.json'
})

// 事件
const emit = defineEmits(['upload', 'remove'])
// Upload 实例
const upload = ref<UploadInstance>()

/**
 * 替换上一次的内容
 * @param files
 */
function handleExceed(files: UploadUserFile[]) {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

/**
 * 上传改变时
 * @param file
 */
function handleChange(file: UploadFile) {
  emit('upload', file.raw)
}

/**
 * 移除文件
 * @param file
 */
function handleRemove() {
  emit('remove')
  return true
}
</script>
