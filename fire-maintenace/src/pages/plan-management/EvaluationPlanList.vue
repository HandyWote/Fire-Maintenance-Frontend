<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import Empty from '@/components/common/Empty.vue'
</script>

<template>
  <div class="evaluation-plan-list">
    <Card title="评估计划管理">
      <Empty 
        title="页面开发中"
        description="评估计划管理页面正在开发中，敬请期待..."
        :size="'large'"
      />
    </Card>
  </div>
</template>

<style scoped>
.evaluation-plan-list {
  padding: 20px;
}
</style>
