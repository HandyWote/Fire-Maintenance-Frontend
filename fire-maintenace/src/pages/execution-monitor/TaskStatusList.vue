<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import Empty from '@/components/common/Empty.vue'
</script>

<template>
  <div class="task-status-list">
    <Card title="任务状态">
      <Empty 
        title="页面开发中"
        description="任务状态页面正在开发中，敬请期待..."
        :size="'large'"
      />
    </Card>
  </div>
</template>

<style scoped>
.task-status-list {
  padding: 20px;
}
</style>
