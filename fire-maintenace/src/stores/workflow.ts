import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'
import { workflowSteps } from '@/config/workflowConfig'
import type { WorkflowStep, WorkflowStatus } from '@/types/workflow'
import { 
  getWorkflowStep, 
  getNextWorkflowStep, 
  getPreviousWorkflowStep,
  canNavigateToStep,
  getWorkflowProgress,
  getAvailableSteps,
  isWorkflowCompleted,
  getWorkflowNavigation
} from '@/config/workflowConfig'

export interface WorkflowState {
  currentStep: string
  steps: WorkflowStep[]
  completedSteps: string[]
  data: Record<string, any>
}

export const useWorkflowStore = defineStore('workflow', () => {
  // 状态定义
  const currentStep = ref<string>(workflowSteps[0]?.id || 'basic-info')
  const steps = ref<WorkflowStep[]>(workflowSteps.map(step => ({
    ...step,
    isCompleted: false
  })))
  const completedSteps = ref<string[]>([])
  const data = ref<Record<string, any>>({})

  // 计算属性
  const currentStepInfo = computed(() => {
    return getWorkflowStep(currentStep.value)
  })

  const progress = computed(() => {
    return getWorkflowProgress(completedSteps.value)
  })

  const isCurrentStepCompleted = computed(() => {
    return completedSteps.value.includes(currentStep.value)
  })

  const nextStep = computed(() => {
    return getNextWorkflowStep(currentStep.value)
  })

  const previousStep = computed(() => {
    return getPreviousWorkflowStep(currentStep.value)
  })

  const canGoToNext = computed(() => {
    return isCurrentStepCompleted.value && nextStep.value !== undefined
  })

  const canGoToPrevious = computed(() => {
    return previousStep.value !== undefined
  })

  const workflowStatus = computed((): WorkflowStatus => {
    return {
      currentStep: currentStep.value,
      completedSteps: completedSteps.value,
      availableSteps: getAvailableSteps(completedSteps.value),
      progress: progress.value,
      data: data.value
    }
  })

  const workflowNavigation = computed(() => {
    return getWorkflowNavigation(currentStep.value, completedSteps.value)
  })

  // 动作
  function setCurrentStep(stepId: string) {
    if (canNavigateToStep(stepId, completedSteps.value)) {
      currentStep.value = stepId
    }
  }

  function completeStep(stepId: string) {
    if (!completedSteps.value.includes(stepId)) {
      completedSteps.value.push(stepId)
      // 更新步骤状态
      const step = steps.value.find(s => s.id === stepId)
      if (step) {
        step.isCompleted = true
      }
    }
  }

  function uncompleteStep(stepId: string) {
    const index = completedSteps.value.indexOf(stepId)
    if (index > -1) {
      completedSteps.value.splice(index, 1)
      // 更新步骤状态
      const step = steps.value.find(s => s.id === stepId)
      if (step) {
        step.isCompleted = false
      }
    }
  }

  function goToNextStep() {
    if (canGoToNext.value && nextStep.value) {
      setCurrentStep(nextStep.value.id)
    }
  }

  function goToPreviousStep() {
    if (canGoToPrevious.value && previousStep.value) {
      setCurrentStep(previousStep.value.id)
    }
  }

  function saveStepData(stepId: string, stepData: any) {
    data.value[stepId] = stepData
  }

  function getStepData(stepId: string) {
    return data.value[stepId] || {}
  }

  function resetWorkflow() {
    currentStep.value = workflowSteps[0]?.id || 'basic-info'
    completedSteps.value = []
    data.value = {}
    steps.value.forEach(step => {
      step.isCompleted = false
    })
  }

  function isStepCompleted(stepId: string): boolean {
    return completedSteps.value.includes(stepId)
  }

  function isStepAvailable(stepId: string): boolean {
    return canNavigateToStep(stepId, completedSteps.value)
  }

  function isWorkflowComplete(): boolean {
    return isWorkflowCompleted(completedSteps.value)
  }

  function getStepNavigation(stepId: string) {
    return getWorkflowNavigation(stepId, completedSteps.value)
  }

  // 重置方法
  function $reset() {
    resetWorkflow()
  }

  return {
    // 状态
    currentStep,
    steps,
    completedSteps,
    data,
    
    // 计算属性
    currentStepInfo,
    progress,
    isCurrentStepCompleted,
    nextStep,
    previousStep,
    canGoToNext,
    canGoToPrevious,
    workflowStatus,
    workflowNavigation,
    
    // 动作
    setCurrentStep,
    completeStep,
    uncompleteStep,
    goToNextStep,
    goToPreviousStep,
    saveStepData,
    getStepData,
    resetWorkflow,
    isStepCompleted,
    isStepAvailable,
    isWorkflowComplete,
    getStepNavigation,
    $reset
  }
})

// 热模块替换支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWorkflowStore, import.meta.hot))
}
