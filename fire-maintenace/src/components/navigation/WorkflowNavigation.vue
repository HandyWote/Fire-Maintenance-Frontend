<template>
  <div class="workflow-navigation">
    <div class="workflow-steps">
      <div 
        v-for="(step, index) in workflowSteps" 
        :key="step.id"
        :class="['workflow-step', { 
          'active': isStepActive(step.id),
          'completed': isStepCompleted(step.id),
          'current': isCurrentStep(step.id)
        }]"
        @click="handleStepClick(step)"
      >
        <div class="step-number">
          <el-icon v-if="isStepCompleted(step.id)" class="step-icon">
            <Check />
          </el-icon>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="step-content">
          <div class="step-title">{{ step.title }}</div>
          <div class="step-description">{{ step.description }}</div>
        </div>
        <div class="step-connector" v-if="index < workflowSteps.length - 1"></div>
      </div>
    </div>
    
    <div class="workflow-actions" v-if="showActions">
      <el-button 
        v-if="hasPreviousStep" 
        @click="navigateToPreviousStep"
        :disabled="loading"
      >
        <el-icon><ArrowLeft /></el-icon>
        上一步
      </el-button>
      
      <el-button 
        v-if="hasNextStep" 
        type="primary" 
        @click="navigateToNextStep"
        :disabled="loading || !canNavigateToNextStep"
      >
        下一步
        <el-icon><ArrowRight /></el-icon>
      </el-button>
      
      <el-button 
        v-if="isLastStep && canComplete" 
        type="success" 
        @click="completeWorkflow"
        :disabled="loading"
      >
        <el-icon><Check /></el-icon>
        完成工作流
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight, Check } from '@element-plus/icons-vue'
import { useNavigationStore } from '@/stores/navigation'
import type { WorkflowStep } from '@/types/workflow'

interface WorkflowNavigationProps {
  steps: WorkflowStep[]
  currentStepId?: string
  completedSteps?: string[]
  showActions?: boolean
  canNavigateToNextStep?: boolean
  canComplete?: boolean
  loading?: boolean
}

interface WorkflowNavigationEmits {
  'step-change': [step: WorkflowStep]
  'step-complete': [stepId: string]
  'workflow-complete': []
}

const props = withDefaults(defineProps<WorkflowNavigationProps>(), {
  showActions: true,
  canNavigateToNextStep: true,
  canComplete: true,
  loading: false,
  completedSteps: () => []
})

const emit = defineEmits<WorkflowNavigationEmits>()

const router = useRouter()
const navigationStore = useNavigationStore()

// 内部状态
const internalCurrentStep = ref<string>(props.currentStepId || props.steps[0]?.id || '')
const internalCompletedSteps = ref<string[]>([...props.completedSteps])

// 监听props变化
watch(() => props.currentStepId, (newVal) => {
  if (newVal) {
    internalCurrentStep.value = newVal
  }
})

watch(() => props.completedSteps, (newVal) => {
  internalCompletedSteps.value = [...newVal]
})

// 计算属性
const workflowSteps = computed(() => props.steps)

const currentStep = computed(() => {
  return workflowSteps.value.find(step => step.id === internalCurrentStep.value)
})

const currentStepIndex = computed(() => {
  return workflowSteps.value.findIndex(step => step.id === internalCurrentStep.value)
})

const hasPreviousStep = computed(() => {
  return currentStepIndex.value > 0
})

const hasNextStep = computed(() => {
  return currentStepIndex.value < workflowSteps.value.length - 1
})

const isLastStep = computed(() => {
  return currentStepIndex.value === workflowSteps.value.length - 1
})

// 方法
const isStepActive = (stepId: string) => {
  return internalCurrentStep.value === stepId
}

const isStepCompleted = (stepId: string) => {
  return internalCompletedSteps.value.includes(stepId)
}

const isCurrentStep = (stepId: string) => {
  return internalCurrentStep.value === stepId
}

const handleStepClick = (step: WorkflowStep) => {
  // 只有已完成的步骤或当前步骤可以点击
  if (isStepCompleted(step.id) || isStepActive(step.id)) {
    navigateToStep(step)
  }
}

const navigateToStep = (step: WorkflowStep) => {
  internalCurrentStep.value = step.id
  emit('step-change', step)
  
  // 如果步骤有路径，则导航到该路径
  if (step.route) {
    router.push(step.route)
  }
}

const navigateToPreviousStep = () => {
  if (hasPreviousStep.value) {
    const previousStep = workflowSteps.value[currentStepIndex.value - 1]
    navigateToStep(previousStep)
  }
}

const navigateToNextStep = () => {
  if (hasNextStep.value && props.canNavigateToNextStep) {
    // 标记当前步骤为已完成
    if (!isStepCompleted(internalCurrentStep.value)) {
      internalCompletedSteps.value.push(internalCurrentStep.value)
      emit('step-complete', internalCurrentStep.value)
    }
    
    const nextStep = workflowSteps.value[currentStepIndex.value + 1]
    navigateToStep(nextStep)
  }
}

const completeWorkflow = () => {
  if (isLastStep.value && props.canComplete) {
    // 标记最后一步为已完成
    if (!isStepCompleted(internalCurrentStep.value)) {
      internalCompletedSteps.value.push(internalCurrentStep.value)
      emit('step-complete', internalCurrentStep.value)
    }
    
    emit('workflow-complete')
    ElMessage.success('工作流已完成')
  }
}

// 暴露方法给父组件
defineExpose({
  navigateToStep,
  navigateToPreviousStep,
  navigateToNextStep,
  completeWorkflow,
  currentStep: internalCurrentStep,
  completedSteps: internalCompletedSteps
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.workflow-navigation {
  padding: $spacing-lg;
  background: white;
  border-radius: $border-radius-lg;
  box-shadow: $box-shadow-sm;
  
  .workflow-steps {
    display: flex;
    justify-content: space-between;
    margin-bottom: $spacing-lg;
    position: relative;
    
    .workflow-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      flex: 1;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover:not(.completed):not(.active) {
        .step-number {
          background-color: $background-color-base;
        }
      }
      
      &.active {
        .step-number {
          background-color: $primary-color;
          color: white;
          border-color: $primary-color;
        }
        
        .step-title {
          color: $primary-color;
          font-weight: 600;
        }
      }
      
      &.completed {
        .step-number {
          background-color: $success-color;
          color: white;
          border-color: $success-color;
        }
        
        .step-title {
          color: $success-color;
        }
      }
      
      .step-number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: white;
        border: 2px solid $border-color-base;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin-bottom: $spacing-sm;
        transition: all 0.3s ease;
        z-index: 2;
        
        .step-icon {
          font-size: 20px;
        }
      }
      
      .step-content {
        text-align: center;
        max-width: 120px;
        
        .step-title {
          font-size: $font-size-sm;
          font-weight: 500;
          color: $text-primary;
          margin-bottom: 4px;
          transition: color 0.3s ease;
        }
        
        .step-description {
          font-size: $font-size-xs;
          color: $text-secondary;
          line-height: 1.2;
        }
      }
      
      .step-connector {
        position: absolute;
        top: 20px;
        left: 50%;
        width: 100%;
        height: 2px;
        background-color: $border-color-base;
        z-index: 1;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: $success-color;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
      }
      
      &.completed .step-connector::before {
        transform: scaleX(1);
      }
    }
  }
  
  .workflow-actions {
    display: flex;
    justify-content: center;
    gap: $spacing-md;
    padding-top: $spacing-md;
    border-top: 1px solid $border-color-lighter;
  }
}

@media (max-width: $breakpoint-md) {
  .workflow-navigation {
    padding: $spacing-md;
    
    .workflow-steps {
      flex-direction: column;
      gap: $spacing-lg;
      
      .workflow-step {
        flex-direction: row;
        align-items: flex-start;
        text-align: left;
        
        .step-number {
          margin-bottom: 0;
          margin-right: $spacing-md;
        }
        
        .step-content {
          max-width: none;
          
          .step-title {
            margin-bottom: 4px;
          }
        }
        
        .step-connector {
          display: none;
        }
      }
    }
  }
}
</style>