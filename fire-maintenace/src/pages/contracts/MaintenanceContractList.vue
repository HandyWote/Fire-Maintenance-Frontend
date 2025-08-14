<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import Empty from '@/components/common/Empty.vue'
</script>

<template>
  <div class="maintenance-contract-list">
    <Card title="维保合同管理">
      <Empty 
        title="页面开发中"
        description="维保合同管理页面正在开发中，敬请期待..."
        :size="'large'"
      />
    </Card>
  </div>
</template>

<style scoped>
.maintenance-contract-list {
  padding: 20px;
}
</style>
