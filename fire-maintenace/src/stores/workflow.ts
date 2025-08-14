import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'

export interface WorkflowStep {
  id: string
  name: string
  title: string
  description: string
  completed: boolean
  enabled: boolean
  order: number
  icon?: string
  path?: string
}

export interface WorkflowState {
  currentStep: string
  steps: WorkflowStep[]
  completedSteps: string[]
  data: Record<string, any>
}

export const useWorkflowStore = defineStore('workflow', () => {
  // 状态定义
  const currentStep = ref<string>('companies')
  const steps = ref<WorkflowStep[]>([
    {
      id: 'companies',
      name: 'companies',
      title: '企业管理',
      description: '管理企业基本信息',
      completed: false,
      enabled: true,
      order: 1,
      icon: 'OfficeBuilding',
      path: '/companies'
    },
    {
      id: 'personnel',
      name: 'personnel', 
      title: '人员管理',
      description: '管理人员信息',
      completed: false,
      enabled: true,
      order: 2,
      icon: 'User',
      path: '/personnel'
    },
    {
      id: 'buildings',
      name: 'buildings',
      title: '建筑管理', 
      description: '管理建筑物信息',
      completed: false,
      enabled: true,
      order: 3,
      icon: 'House',
      path: '/buildings'
    },
    {
      id: 'projects',
      name: 'projects',
      title: '项目管理',
      description: '管理项目信息',
      completed: false,
      enabled: true,
      order: 4,
      icon: 'Document',
      path: '/projects'
    },
    {
      id: 'contracts',
      name: 'contracts',
      title: '合同管理',
      description: '管理合同信息',
      completed: false,
      enabled: true,
      order: 5,
      icon: 'Files',
      path: '/contracts'
    },
    {
      id: 'maintenance-plans',
      name: 'maintenance-plans',
      title: '维保计划',
      description: '制定维保计划',
      completed: false,
      enabled: true,
      order: 6,
      icon: 'Calendar',
      path: '/maintenance-plans'
    },
    {
      id: 'operation-monitor',
      name: 'operation-monitor',
      title: '执行监控',
      description: '监控执行状态',
      completed: false,
      enabled: true,
      order: 7,
      icon: 'Monitor',
      path: '/operation-monitor'
    },
    {
      id: 'report-generation',
      name: 'report-generation',
      title: '报告生成',
      description: '生成维保报告',
      completed: false,
      enabled: true,
      order: 8,
      icon: 'DocumentCopy',
      path: '/report-generation'
    }
  ])
  const completedSteps = ref<string[]>([])
  const data = ref<Record<string, any>>({})

  // 计算属性
  const currentStepInfo = computed(() => {
    return steps.value.find(step => step.id === currentStep.value)
  })

  const progress = computed(() => {
    const totalSteps = steps.value.filter(step => step.enabled).length
    const completedCount = completedSteps.value.length
    return totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0
  })

  const isCurrentStepCompleted = computed(() => {
    return completedSteps.value.includes(currentStep.value)
  })

  const nextStep = computed(() => {
    const currentIndex = steps.value.findIndex(step => step.id === currentStep.value)
    const nextSteps = steps.value.slice(currentIndex + 1)
    return nextSteps.find(step => step.enabled)
  })

  const previousStep = computed(() => {
    const currentIndex = steps.value.findIndex(step => step.id === currentStep.value)
    const previousSteps = steps.value.slice(0, currentIndex)
    return previousSteps.reverse().find(step => step.enabled)
  })

  const canGoToNext = computed(() => {
    return isCurrentStepCompleted.value && nextStep.value !== undefined
  })

  const canGoToPrevious = computed(() => {
    return previousStep.value !== undefined
  })

  // 动作
  function setCurrentStep(stepId: string) {
    const step = steps.value.find(s => s.id === stepId)
    if (step && step.enabled) {
      currentStep.value = stepId
    }
  }

  function completeStep(stepId: string) {
    if (!completedSteps.value.includes(stepId)) {
      completedSteps.value.push(stepId)
      // 更新步骤状态
      const step = steps.value.find(s => s.id === stepId)
      if (step) {
        step.completed = true
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
        step.completed = false
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
    currentStep.value = 'companies'
    completedSteps.value = []
    data.value = {}
    steps.value.forEach(step => {
      step.completed = false
    })
  }

  function enableStep(stepId: string) {
    const step = steps.value.find(s => s.id === stepId)
    if (step) {
      step.enabled = true
    }
  }

  function disableStep(stepId: string) {
    const step = steps.value.find(s => s.id === stepId)
    if (step) {
      step.enabled = false
    }
  }

  function updateStepOrder(stepId: string, newOrder: number) {
    const step = steps.value.find(s => s.id === stepId)
    if (step) {
      step.order = newOrder
      // 重新排序
      steps.value.sort((a, b) => a.order - b.order)
    }
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
    
    // 动作
    setCurrentStep,
    completeStep,
    uncompleteStep,
    goToNextStep,
    goToPreviousStep,
    saveStepData,
    getStepData,
    resetWorkflow,
    enableStep,
    disableStep,
    updateStepOrder,
    $reset
  }
})

// 热模块替换支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWorkflowStore, import.meta.hot))
}
