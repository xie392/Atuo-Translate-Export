<template>
  <div class="w-[300px] px-5 py-3">
    <div class="w-full flex justify-between">
      <span class="text-[#999] text-sm">插入网页开关</span>
      <el-switch v-model="visable" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'

const visable = ref<boolean>(true)

chrome.storage.local.get(['visable'], function (item) {
   visable.value = item.visable
})

// 存储显示隐藏开关
watchEffect(() => {
  chrome.storage.local.set({ visable: visable.value })
})
</script>

<style scoped></style>
