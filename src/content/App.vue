<template>
  <el-popover placement="top-end" :width="400" trigger="click" class="py-5" :teleported="false">
    <template #reference>
      <div
        class="fixed bottom-[100px] right-10 w-10 h-10 cursor-pointer bg-white shadow-2xl p-2 rounded-full overflow-hidden"
      >
        <img src="./assets/icon-logo.png" alt="" srcset="" class="object-cover" />
      </div>
    </template>

    <!-- 上传按钮 -->
    <upload-file tips="请上传对应本网页的json文件" @upload="uploadJSON" @remove="handleRemove" />

    <!-- 导出按钮 -->
    <el-button type="primary" class="w-full" @click="exportJSON">导出</el-button>

    <!-- 分割线 -->
    <el-divider />

    <!--编辑网页开关  -->
    <div class="w-full flex justify-between">
      <span class="text-[#999] text-sm">编辑网页开关</span>
      <el-switch v-model="isBodyEdit" :disabled="!langs" />
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import UploadFile from '@/content/components/UplaodFile.vue'
import type { UploadRawFile } from 'element-plus'
import { getAllTextNodes, keyArrEqual } from '@/helpers/node'

// 文件名
const fileName = ref<string>('')
// 上传语言列表
const langs = ref<{ [key: string]: string } | null>(null)
// 网页编辑开关
const isBodyEdit = ref<boolean>(false)

/**
 * 读取上传的 json 文件
 * @param file
 */
function uploadJSON(file: UploadRawFile) {
  fileName.value = file.name
  const render = new FileReader()
  render.readAsText(file)

  render.onload = (e) => {
    if (e.target) {
      const text = e.target.result || ''
      langs.value = JSON.parse(text as string)
    }
    console.log('uploadJSON', langs.value)

    // 上传成功后把当前页面元素映射到 pagepageText
    const nodes = getAllTextNodes(document.body)

    console.log('nodes', nodes)

    // 映射上传代码我文本给到 pageText，绑定位置
    nodes.forEach((node) => {
      const parentElement = node.parentElement as HTMLElement
      const text = node.textContent?.replace(/\n/g, '').trim()
      if (!text) return
      if (!parentElement) {
        // 给 node 添加父元素
        // 如果没有父节点，创建一个新的 div 元素作为父节点
        const span = document.createElement('span')

        span.textContent = text
          // 将原始节点移动到新的父节点下
          // newParentElement.appendChild(node.cloneNode(true))

        console.dir(node)
        // console.log("replaceWith",node!.replaceWith);
        console.log("nodeType",node.nodeType, node.nodeValue);
        
        // node.replaceWith(span)
        // node!.appendChild(newParentElement)
      }
      let newKey = ''
      // 给 node 加 id
      const keys = []
      // 寻找合适的 key
      for (const key in langs.value || {}) {
        if (text === langs.value![key].trim()) {
          keys.push(key)
          newKey = key
          if (keys.length > 1) {
            newKey = keyArrEqual(keys, text)
          }
        }
      }
      if (newKey) {
        // 给找到对应key的元素标记
        const html = parentElement?.innerHTML
        parentElement!.innerHTML = html?.replace(
          new RegExp(`${text}`, 'g'),
          `<font data-key="${newKey}">${text}</font>`
        )
      }
    })
  }
}

/**
 * 移除上传的 json 文件
 */
function handleRemove() {
  langs.value = null
  fileName.value = ''
  isBodyEdit.value = false
}

/**
 * 导出页面内容 json
 */
function exportJSON() {
  if (!langs.value) return ElMessage({ message: '请先上传文件', type: 'warning' })
  const nodes = getAllTextNodes(document.body)

  // 记录 已经替换过的 key
  const replacedKeys: string[] = []

  // 替换上传的 json 文件内容
  nodes.forEach((node) => {
    // console.log(node, node.data)
    const parentElement = node.parentElement as HTMLElement
    const key = parentElement?.getAttribute('data-key')
    if (key && !replacedKeys.includes(key)) {
      const text = node.textContent?.replace(/\n/g, '').trim() || ''
      langs.value![key] = text
      replacedKeys.push(key)
    }
  })

  // 导出 json
  const blob = new Blob([JSON.stringify(langs.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${fileName.value}`
  a.click()
  URL.revokeObjectURL(url)
  a.remove()
  ElMessage({ message: '导出成功', type: 'success' })
}

// 监听上传
watchEffect(() => {
  if (langs.value) {
    ElMessage({ message: '上传成功,编辑模式已打开', type: 'success' })
    isBodyEdit.value = true
  }
})

// 网页编辑开关
watchEffect(() => {
  document.body.contentEditable = isBodyEdit.value ? 'true' : 'false'
})
</script>

<style scoped></style>
