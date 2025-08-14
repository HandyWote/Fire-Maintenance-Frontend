import { ref, computed, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { 
  WorkflowStep, 
  WorkflowStatus, 
  WorkflowNavigation, 
  PrefillData, 
  StepValidation 
} from '@/types/workflow'

/**
 * 工作流管理Composable
 * @param steps 工作流步骤
 * @param options 配置选项
 * @returns 工作流管理方法和状态
 */
export function useWorkflow(steps: WorkflowStep[], options = {}) {
  const router = useRouter()
  const route = useRoute()
  
  // 默认配置
  const defaultOptions = {
    enableRouteNavigation: true,
    enableDataPersistence: true,
    enableValidation: true,
    autoSave: true,
    storageKey: 'workflow-data'
  }
  
  const config = { ...defaultOptions, ...options }
  
  // 响应式状态
  const currentStepId = ref<string>(steps[0]?.id || '')
  const workflowData = reactive<Record<string, any>>({})
  const completedSteps = ref<string[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // 计算属性
  const currentStep = computed(() => {
    return steps.find(step => step.id === currentStepId.value)
  })
  
  const workflowStatus = computed<WorkflowStatus>(() => {
    const totalSteps = steps.length
    const completedCount = completedSteps.value.length
    const progress = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0
    
    const availableSteps = steps.filter(step => {
      if (step.dependsOn && step.dependsOn.length > 0) {
        return step.dependsOn.every(depId => completedSteps.value.includes(depId))
      }
      return true
    }).map(step => step.id)
    
    return {
      currentStep: currentStepId.value,
      completedSteps: completedSteps.value,
      availableSteps,
      progress,
      data: workflowData
    }
  })
  
  const workflowNavigation = computed<WorkflowNavigation>(() => {
    const currentIndex = steps.findIndex(step => step.id === currentStepId.value)
    const nextStep = steps[currentIndex + 1]
    const previousStep = steps[currentIndex - 1]
    
    const canGoNext = nextStep && workflowStatus.value.availableSteps.includes(nextStep.id)
    const canGoPrevious = previousStep && completedSteps.value.includes(previousStep.id)
    
    const canGoToStep = (stepId: string) => {
      const step = steps.find(s => s.id === stepId)
      if (!step) return false
      
      // 如果步骤已完成，可以跳转
      if (completedSteps.value.includes(stepId)) return true
      
      // 如果步骤可用，可以跳转
      if (workflowStatus.value.availableSteps.includes(stepId)) return true
      
      return false
    }
    
    return {
      canGoNext,
      canGoPrevious,
      canGoToStep,
      nextStep: nextStep?.id,
      previousStep: previousStep?.id
    }
  })
  
  // 方法
  const goToStep = (stepId: string) => {
    if (!workflowNavigation.value.canGoToStep(stepId)) {
      ElMessage.warning('无法跳转到该步骤')
      return
    }
    
    currentStepId.value = stepId
    
    // 如果启用了路由导航
    if (config.enableRouteNavigation && currentStep.value?.route) {
      router.push(currentStep.value.route)
    }
  }
  
  const goToNextStep = () => {
    if (!workflowNavigation.value.canGoNext) {
      ElMessage.warning('无法进入下一步')
      return
    }
    
    const nextStepId = workflowNavigation.value.nextStep
    if (nextStepId) {
      goToStep(nextStepId)
    }
  }
  
  const goToPreviousStep = () => {
    if (!workflowNavigation.value.canGoPrevious) {
      ElMessage.warning('无法返回上一步')
      return
    }
    
    const previousStepId = workflowNavigation.value.previousStep
    if (previousStepId) {
      goToStep(previousStepId)
    }
  }
  
  const completeStep = async (stepId: string, data: any, validation?: StepValidation) => {
    if (config.enableValidation && validation && !validation.isValid) {
      error.value = validation.errors.join(', ')
      ElMessage.error('请完成当前步骤的必填项')
      return false
    }
    
    try {
      isLoading.value = true
      error.value = null
      
      // 保存步骤数据
      workflowData[stepId] = data
      
      // 标记步骤为已完成
      if (!completedSteps.value.includes(stepId)) {
        completedSteps.value.push(stepId)
      }
      
      // 自动保存
      if (config.autoSave && config.enableDataPersistence) {
        await saveWorkflowData()
      }
      
      ElMessage.success('步骤已完成')
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '保存失败'
      ElMessage.error(error.value)
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  const resetStep = (stepId: string) => {
    delete workflowData[stepId]
    completedSteps.value = completedSteps.value.filter(id => id !== stepId)
    error.value = null
  }
  
  const resetWorkflow = () => {
    currentStepId.value = steps[0]?.id || ''
    Object.keys(workflowData).forEach(key => {
      delete workflowData[key]
    })
    completedSteps.value = []
    error.value = null
    
    if (config.enableDataPersistence) {
      clearWorkflowData()
    }
  }
  
  const saveWorkflowData = async () => {
    if (!config.enableDataPersistence) return
    
    try {
      const dataToSave = {
        currentStepId: currentStepId.value,
        completedSteps: completedSteps.value,
        workflowData,
        timestamp: new Date().toISOString()
      }
      
      localStorage.setItem(config.storageKey, JSON.stringify(dataToSave))
    } catch (err) {
      console.error('保存工作流数据失败:', err)
    }
  }
  
  const loadWorkflowData = () => {
    if (!config.enableDataPersistence) return
    
    try {
      const savedData = localStorage.getItem(config.storageKey)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        
        currentStepId.value = parsedData.currentStepId || steps[0]?.id || ''
        completedSteps.value = parsedData.completedSteps || []
        Object.assign(workflowData, parsedData.workflowData || {})
        
        return true
      }
    } catch (err) {
      console.error('加载工作流数据失败:', err)
    }
    
    return false
  }
  
  const clearWorkflowData = () => {
    if (!config.enableDataPersistence) return
    
    try {
      localStorage.removeItem(config.storageKey)
    } catch (err) {
      console.error('清除工作流数据失败:', err)
    }
  }
  
  const getStepData = (stepId: string) => {
    return workflowData[stepId] || {}
  }
  
  const updateStepData = (stepId: string, data: any) => {
    workflowData[stepId] = { ...workflowData[stepId], ...data }
    
    if (config.autoSave && config.enableDataPersistence) {
      saveWorkflowData()
    }
  }
  
  const getPrefillData = (stepId: string): PrefillData[] => {
    const prefillData: PrefillData[] = []
    const step = steps.find(s => s.id === stepId)
    
    if (!step) return prefillData
    
    // 从前置步骤获取数据
    if (step.dependsOn && step.dependsOn.length > 0) {
      step.dependsOn.forEach(depId => {
        const depData = workflowData[depId]
        if (depData) {
          prefillData.push({
            stepId: depId,
            data: depData,
            source: 'previous',
            timestamp: new Date()
          })
        }
      })
    }
    
    return prefillData
  }
  
  const validateStep = (stepId: string): StepValidation => {
    const step = steps.find(s => s.id === stepId)
    if (!step) {
      return {
        isValid: false,
        errors: ['步骤不存在'],
        warnings: [],
        data: {}
      }
    }
    
    const errors: string[] = []
    const warnings: string[] = []
    const data = getStepData(stepId)
    
    // 基础验证
    if (!data || Object.keys(data).length === 0) {
      errors.push('请填写必要信息')
    }
    
    // 这里可以添加更多自定义验证逻辑
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data
    }
  }
  
  const exportWorkflowData = () => {
    const exportData = {
      steps,
      currentStepId: currentStepId.value,
      completedSteps: completedSteps.value,
      workflowData,
      status: workflowStatus.value,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `workflow-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  
  const importWorkflowData = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string)
          
          // 验证导入的数据格式
          if (!importedData.steps || !importedData.workflowData) {
            ElMessage.error('导入的数据格式不正确')
            resolve(false)
            return
          }
          
          // 恢复工作流状态
          currentStepId.value = importedData.currentStepId || steps[0]?.id || ''
          completedSteps.value = importedData.completedSteps || []
          Object.assign(workflowData, importedData.workflowData)
          
          if (config.autoSave && config.enableDataPersistence) {
            saveWorkflowData()
          }
          
          ElMessage.success('工作流数据导入成功')
          resolve(true)
        } catch (err) {
          ElMessage.error('导入数据失败')
          resolve(false)
        }
      }
      
      reader.onerror = () => {
        ElMessage.error('读取文件失败')
        resolve(false)
      }
      
      reader.readAsText(file)
    })
  }
  
  // 监听路由变化
  if (config.enableRouteNavigation) {
    watch(() => route.path, (newPath) => {
      const currentStepRoute = currentStep.value?.route
      if (currentStepRoute && newPath !== currentStepRoute) {
        // 如果路由变化且当前步骤有路由配置，尝试找到匹配的步骤
        const matchingStep = steps.find(step => step.route === newPath)
        if (matchingStep && matchingStep.id !== currentStepId.value) {
          goToStep(matchingStep.id)
        }
      }
    })
  }
  
  // 自动保存
  if (config.autoSave && config.enableDataPersistence) {
    watch(workflowData, () => {
      saveWorkflowData()
    }, { deep: true })
    
    watch(completedSteps, () => {
      saveWorkflowData()
    }, { deep: true })
  }
  
  // 初始化时加载数据
  if (config.enableDataPersistence) {
    loadWorkflowData()
  }
  
  return {
    // 状态
    currentStepId,
    currentStep,
    workflowData,
    completedSteps,
    isLoading,
    error,
    workflowStatus,
    workflowNavigation,
    
    // 方法
    goToStep,
    goToNextStep,
    goToPreviousStep,
    completeStep,
    resetStep,
    resetWorkflow,
    saveWorkflowData,
    loadWorkflowData,
    clearWorkflowData,
    getStepData,
    updateStepData,
    getPrefillData,
    validateStep,
    exportWorkflowData,
    importWorkflowData
  }
}

export default useWorkflow
