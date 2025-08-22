<template>
  <div class="workflow-layout">
    <!-- 工作流导航 -->
    <div class="workflow-navigation-container">
      <WorkflowNavigation
        :steps="workflowStore.steps"
        :current-step-id="workflowStore.currentStep"
        :completed-steps="workflowStore.completedSteps"
        :can-navigate-to-next-step="workflowStore.canGoToNext"
        :can-complete="workflowStore.isWorkflowComplete()"
        @step-change="handleStepChange"
        @step-complete="handleStepComplete"
        @workflow-complete="handleWorkflowComplete"
      />
    </div>

    <!-- 页面内容 -->
    <div class="workflow-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import WorkflowNavigation from '@/components/navigation/WorkflowNavigation.vue'
import { useWorkflowStore } from '@/stores/workflow'
import { useNavigationStore } from '@/stores/navigation'

const router = useRouter()
const route = useRoute()
const workflowStore = useWorkflowStore()
const navigationStore = useNavigationStore()

// 处理步骤变化
const handleStepChange = (step: any) => {
  workflowStore.setCurrentStep(step.id)
  
  // 如果步骤有路由，则导航到该路由
  if (step.route) {
    router.push(step.route)
  }
}

// 处理步骤完成
const handleStepComplete = (stepId: string) => {
  workflowStore.completeStep(stepId)
  ElMessage.success(`步骤"${workflowStore.getStepData(stepId)?.title || stepId}"已完成`)
}

// 处理工作流完成
const handleWorkflowComplete = () => {
  ElMessage.success('恭喜！工作流已完成')
  // 可以在这里添加完成后的逻辑，比如生成报告或跳转到总结页面
}

// 监听路由变化，更新当前步骤
watch(() => route.path, (newPath) => {
  // 查找与当前路径匹配的工作流步骤
  const matchingStep = workflowStore.steps.find(step => step.route === newPath)
  if (matchingStep && workflowStore.isStepAvailable(matchingStep.id)) {
    workflowStore.setCurrentStep(matchingStep.id)
  }
}, { immediate: true })

// 组件挂载时初始化工作流状态
onMounted(() => {
  // 检查当前路由是否对应某个工作流步骤
  const currentPath = route.path
  const matchingStep = workflowStore.steps.find(step => step.route === currentPath)
  
  if (matchingStep) {
    workflowStore.setCurrentStep(matchingStep.id)
  }
  
  // 同步导航状态
  if (matchingStep) {
    const navItem = navigationStore.findNavigationItemByPath(currentPath)
    if (navItem) {
      navigationStore.setCurrentNavigation(navItem)
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.workflow-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: $background-color-base;
  
  .workflow-navigation-container {
    background-color: white;
    border-bottom: 1px solid $border-color-lighter;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: $box-shadow-sm;
  }
  
  .workflow-content {
    flex: 1;
    padding: $spacing-lg;
    
    // 响应式设计
    @media (max-width: $breakpoint-md) {
      padding: $spacing-md;
    }
    
    @media (max-width: $breakpoint-sm) {
      padding: $spacing-sm;
    }
  }
}
</style>