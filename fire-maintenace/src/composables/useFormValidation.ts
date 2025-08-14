import { ref, computed, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * 验证规则接口
 */
export interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
  message?: string
}

/**
 * 验证错误接口
 */
export interface ValidationError {
  field: string
  message: string
  value: any
}

/**
 * 表单字段配置接口
 */
export interface FormFieldConfig {
  name: string
  label?: string
  type?: 'text' | 'number' | 'email' | 'phone' | 'url' | 'date' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'array' | 'object'
  defaultValue?: any
  rules?: ValidationRule[]
  dependsOn?: string[]
  visible?: boolean | ((formData: any) => boolean)
  disabled?: boolean | ((formData: any) => boolean)
}

/**
 * 表单配置接口
 */
export interface FormConfig {
  fields: FormFieldConfig[]
  autoValidate?: boolean
  validateOnBlur?: boolean
  validateOnChange?: boolean
  validateOnSubmit?: boolean
}

/**
 * 表单验证Composable
 * @param config 表单配置
 * @returns 表单验证方法和状态
 */
export function useFormValidation(config: FormConfig) {
  // 默认配置
  const defaultOptions = {
    autoValidate: true,
    validateOnBlur: true,
    validateOnChange: false,
    validateOnSubmit: true
  }
  
  const options = { ...defaultOptions, ...config }
  
  // 响应式状态
  const formData = reactive<Record<string, any>>({})
  const errors = ref<ValidationError[]>([])
  const isDirty = ref(false)
  const isValid = ref(true)
  const isValidating = ref(false)
  
  // 初始化表单数据
  const initializeFormData = () => {
    options.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        formData[field.name] = field.defaultValue
      } else {
        switch (field.type) {
          case 'checkbox':
            formData[field.name] = false
            break
          case 'number':
            formData[field.name] = 0
            break
          case 'array':
            formData[field.name] = []
            break
          case 'object':
            formData[field.name] = {}
            break
          default:
            formData[field.name] = ''
        }
      }
    })
  }
  
  // 获取字段配置
  const getFieldConfig = (fieldName: string) => {
    return options.fields.find(field => field.name === fieldName)
  }
  
  // 检查字段是否可见
  const isFieldVisible = (fieldName: string) => {
    const fieldConfig = getFieldConfig(fieldName)
    if (!fieldConfig) return false
    
    if (typeof fieldConfig.visible === 'function') {
      return fieldConfig.visible(formData)
    }
    
    return fieldConfig.visible !== false
  }
  
  // 检查字段是否禁用
  const isFieldDisabled = (fieldName: string) => {
    const fieldConfig = getFieldConfig(fieldName)
    if (!fieldConfig) return false
    
    if (typeof fieldConfig.disabled === 'function') {
      return fieldConfig.disabled(formData)
    }
    
    return fieldConfig.disabled === true
  }
  
  // 验证单个字段
  const validateField = (fieldName: string, value: any): ValidationError | null => {
    const fieldConfig = getFieldConfig(fieldName)
    if (!fieldConfig || !fieldConfig.rules) return null
    
    const rules = fieldConfig.rules
    
    for (const rule of rules) {
      // 必填验证
      if (rule.required && (value === undefined || value === null || value === '')) {
        return {
          field: fieldName,
          message: rule.message || `${fieldConfig.label || fieldName}是必填项`,
          value
        }
      }
      
      // 如果值不为空，继续其他验证
      if (value !== undefined && value !== null && value !== '') {
        // 最小长度验证
        if (rule.min !== undefined && String(value).length < rule.min) {
          return {
            field: fieldName,
            message: rule.message || `${fieldConfig.label || fieldName}长度不能少于${rule.min}个字符`,
            value
          }
        }
        
        // 最大长度验证
        if (rule.max !== undefined && String(value).length > rule.max) {
          return {
            field: fieldName,
            message: rule.message || `${fieldConfig.label || fieldName}长度不能超过${rule.max}个字符`,
            value
          }
        }
        
        // 正则表达式验证
        if (rule.pattern && !rule.pattern.test(String(value))) {
          return {
            field: fieldName,
            message: rule.message || `${fieldConfig.label || fieldName}格式不正确`,
            value
          }
        }
        
        // 自定义验证
        if (rule.custom) {
          const result = rule.custom(value)
          if (result !== true) {
            return {
              field: fieldName,
              message: typeof result === 'string' ? result : rule.message || `${fieldConfig.label || fieldName}验证失败`,
              value
            }
          }
        }
      }
    }
    
    return null
  }
  
  // 验证整个表单
  const validateForm = async (): Promise<boolean> => {
    isValidating.value = true
    errors.value = []
    
    try {
      const newErrors: ValidationError[] = []
      
      // 验证所有可见字段
      for (const field of options.fields) {
        if (isFieldVisible(field.name)) {
          const error = validateField(field.name, formData[field.name])
          if (error) {
            newErrors.push(error)
          }
        }
      }
      
      errors.value = newErrors
      isValid.value = newErrors.length === 0
      
      return isValid.value
    } catch (err) {
      console.error('表单验证失败:', err)
      errors.value = [{
        field: 'form',
        message: '表单验证失败',
        value: null
      }]
      isValid.value = false
      return false
    } finally {
      isValidating.value = false
    }
  }
  
  // 验证特定字段
  const validateFields = async (fieldNames: string[]): Promise<boolean> => {
    isValidating.value = true
    
    try {
      const newErrors: ValidationError[] = []
      
      // 移除这些字段的现有错误
      errors.value = errors.value.filter(error => !fieldNames.includes(error.field))
      
      // 验证指定字段
      for (const fieldName of fieldNames) {
        if (isFieldVisible(fieldName)) {
          const error = validateField(fieldName, formData[fieldName])
          if (error) {
            newErrors.push(error)
          }
        }
      }
      
      errors.value = [...errors.value, ...newErrors]
      isValid.value = errors.value.length === 0
      
      return newErrors.length === 0
    } catch (err) {
      console.error('字段验证失败:', err)
      return false
    } finally {
      isValidating.value = false
    }
  }
  
  // 获取字段错误
  const getFieldError = (fieldName: string): string | null => {
    const error = errors.value.find(e => e.field === fieldName)
    return error ? error.message : null
  }
  
  // 检查字段是否有错误
  const hasFieldError = (fieldName: string): boolean => {
    return errors.value.some(e => e.field === fieldName)
  }
  
  // 清除字段错误
  const clearFieldError = (fieldName: string) => {
    errors.value = errors.value.filter(e => e.field !== fieldName)
  }
  
  // 清除所有错误
  const clearErrors = () => {
    errors.value = []
    isValid.value = true
  }
  
  // 设置字段值
  const setFieldValue = (fieldName: string, value: any) => {
    const oldValue = formData[fieldName]
    formData[fieldName] = value
    
    // 标记表单为已修改
    if (oldValue !== value) {
      isDirty.value = true
    }
    
    // 自动验证
    if (options.autoValidate && options.validateOnChange) {
      validateFields([fieldName])
    }
  }
  
  // 获取字段值
  const getFieldValue = (fieldName: string) => {
    return formData[fieldName]
  }
  
  // 重置表单
  const resetForm = () => {
    initializeFormData()
    clearErrors()
    isDirty.value = false
    isValid.value = true
  }
  
  // 提交表单
  const submitForm = async (onSubmit: (data: any) => Promise<void> | void): Promise<boolean> => {
    let isFormValid = true
    
    // 如果配置为提交时验证
    if (options.validateOnSubmit) {
      isFormValid = await validateForm()
    }
    
    if (!isFormValid) {
      ElMessage.error('请检查表单填写是否正确')
      return false
    }
    
    try {
      await onSubmit({ ...formData })
      isDirty.value = false
      return true
    } catch (err) {
      console.error('表单提交失败:', err)
      ElMessage.error('表单提交失败')
      return false
    }
  }
  
  // 获取表单数据
  const getFormData = () => {
    return { ...formData }
  }
  
  // 设置表单数据
  const setFormData = (data: Record<string, any>) => {
    Object.keys(data).forEach(key => {
      if (formData.hasOwnProperty(key)) {
        setFieldValue(key, data[key])
      }
    })
  }
  
  // 检查表单是否已修改
  const checkDirty = () => {
    return isDirty.value
  }
  
  // 标记表单为已保存
  const markAsSaved = () => {
    isDirty.value = false
  }
  
  // 获取可见字段
  const getVisibleFields = () => {
    return options.fields.filter(field => isFieldVisible(field.name))
  }
  
  // 获取必填字段
  const getRequiredFields = () => {
    return options.fields.filter(field => 
      isFieldVisible(field.name) && 
      field.rules?.some(rule => rule.required)
    )
  }
  
  // 检查必填字段是否都已填写
  const checkRequiredFields = () => {
    const requiredFields = getRequiredFields()
    return requiredFields.every(field => {
      const value = formData[field.name]
      return value !== undefined && value !== null && value !== ''
    })
  }
  
  // 计算属性
  const visibleFields = computed(() => getVisibleFields())
  const requiredFields = computed(() => getRequiredFields())
  const hasErrors = computed(() => errors.value.length > 0)
  const errorSummary = computed(() => {
    return errors.value.map(error => error.message)
  })
  
  // 监听表单数据变化
  watch(formData, () => {
    if (options.autoValidate && options.validateOnChange) {
      validateForm()
    }
  }, { deep: true })
  
  // 初始化
  initializeFormData()
  
  return {
    // 状态
    formData,
    errors,
    isDirty,
    isValid,
    isValidating,
    visibleFields,
    requiredFields,
    hasErrors,
    errorSummary,
    
    // 方法
    validateField,
    validateForm,
    validateFields,
    getFieldError,
    hasFieldError,
    clearFieldError,
    clearErrors,
    setFieldValue,
    getFieldValue,
    resetForm,
    submitForm,
    getFormData,
    setFormData,
    checkDirty,
    markAsSaved,
    isFieldVisible,
    isFieldDisabled,
    checkRequiredFields
  }
}

// 预定义验证规则
export const ValidationRules = {
  // 必填
  required: (message?: string): ValidationRule => ({
    required: true,
    message: message || '此字段为必填项'
  }),
  
  // 邮箱
  email: (message?: string): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: message || '请输入有效的邮箱地址'
  }),
  
  // 手机号
  phone: (message?: string): ValidationRule => ({
    pattern: /^1[3-9]\d{9}$/,
    message: message || '请输入有效的手机号码'
  }),
  
  // URL
  url: (message?: string): ValidationRule => ({
    pattern: /^https?:\/\/.+/,
    message: message || '请输入有效的URL地址'
  }),
  
  // 最小长度
  minLength: (min: number, message?: string): ValidationRule => ({
    min,
    message: message || `长度不能少于${min}个字符`
  }),
  
  // 最大长度
  maxLength: (max: number, message?: string): ValidationRule => ({
    max,
    message: message || `长度不能超过${max}个字符`
  }),
  
  // 数字范围
  range: (min: number, max: number, message?: string): ValidationRule => ({
    custom: (value: number) => value >= min && value <= max,
    message: message || `数值必须在${min}和${max}之间`
  }),
  
  // 正则表达式
  pattern: (regex: RegExp, message?: string): ValidationRule => ({
    pattern: regex,
    message: message || '格式不正确'
  }),
  
  // 自定义验证
  custom: (validator: (value: any) => boolean, message?: string): ValidationRule => ({
    custom: validator,
    message: message || '验证失败'
  })
}

export default useFormValidation
