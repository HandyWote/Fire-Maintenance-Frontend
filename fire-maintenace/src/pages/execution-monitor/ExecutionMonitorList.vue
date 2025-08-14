<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import Empty from '@/components/common/Empty.vue'
</script>

<template>
  <div class="execution-monitor-list">
    <Card title="执行监控">
      <Empty 
        title="页面开发中"
        description="执行监控页面正在开发中，敬请期待..."
        :size="'large'"
      />
    </Card>
  </div>
</template>

<style scoped>
.execution-monitor-list {
  padding: 20px;
}
</style>
