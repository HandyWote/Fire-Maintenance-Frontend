<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import Empty from '@/components/common/Empty.vue'
</script>

<template>
  <div class="inspection-plan-list">
    <Card title="检测计划管理">
      <Empty 
        title="页面开发中"
        description="检测计划管理页面正在开发中，敬请期待..."
        :size="'large'"
      />
    </Card>
  </div>
</template>

<style scoped>
.inspection-plan-list {
  padding: 20px;
}
</style>
