<script setup>
import { useRouter } from 'vue-router'
import { ElResult, ElButton } from 'element-plus'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found-container">
    <ElResult
      icon="error"
      title="404"
      sub-title="抱歉，您访问的页面不存在"
    >
      <template #extra>
        <ElButton type="primary" @click="goHome">返回首页</ElButton>
      </template>
    </ElResult>
  </div>
</template>

<style scoped>
.not-found-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}
</style>
