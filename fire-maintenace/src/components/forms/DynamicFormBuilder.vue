<script setup lang="ts">
import { ref, computed, watch, h } from 'vue'
import { ElForm, ElFormItem, ElButton, ElRow, ElCol, ElMessage } from 'element-plus'
import type { FormConfig, FormField } from '@/config/formConfig'
import { formConfigManager } from '@/config/formConfig'
import { useFormValidation } from '@/composables/useFormValidation'
import { debounce } from '@/utils/common'

interface DynamicFormBuilderProps {
  formId: string
  model: Record<string, any>
  visible?: boolean
  mode?: 'create' | 'edit' | 'view'
  loading?: boolean
  showActions?: boolean
  layout?: 'horizontal' | 'vertical' | 'inline'
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  readonly?: boolean
}

const props = withDefaults(defineProps<DynamicFormBuilderProps>(), {
  visible: true,
  mode: 'create',
  loading: false,
  showActions: true,
  layout: 'horizontal',
  size: 'default',
  disabled: false,
  readonly: false
})

const emit = defineEmits<{
  submit: [model: Record<string, any>]
  reset: []
  cancel: []
  fieldChange: [field: string, value: any]
  validate: [isValid: boolean]
  'update:visible': [visible: boolean]
}>()

// 获取表单配置
const formConfig = computed(() => formConfigManager.getConfig(props.formId))
const formFields = computed(() => formConfig.value?.fields || [])
const formRules = computed(() => formConfigManager.getValidationRules(props.formId))

// 使用表单验证
const formValidation = useFormValidation(
  formConfig.value ? formConfigManager.toUseFormValidationConfig(props.formId) : {
    fields: [],
    autoValidate: true,
    validateOnBlur: true,
    validateOnChange: false,
    validateOnSubmit: true
  }
)

// 表单引用
const formRef = ref<InstanceType<typeof ElForm>>()

// 本地数据模型
const localModel = ref<Record<string, any>>({})

// 初始化本地模型
const initializeModel = () => {
  localModel.value = {}
  
  if (formConfig.value) {
    formConfig.value.fields.forEach((field: FormField) => {
      if (field.defaultValue !== undefined) {
        localModel.value[field.prop] = field.defaultValue
      } else if (props.model[field.prop] !== undefined) {
        localModel.value[field.prop] = props.model[field.prop]
      } else {
        // 根据字段类型设置默认值
        switch (field.type) {
          case 'checkbox':
            localModel.value[field.prop] = false
            break
          case 'number':
            localModel.value[field.prop] = 0
            break
          case 'switch':
            localModel.value[field.prop] = false
            break
          default:
            localModel.value[field.prop] = ''
        }
      }
    })
  }
}

// 监听外部模型变化
watch(() => props.model, (newModel: Record<string, any>) => {
  Object.keys(newModel).forEach(key => {
    if (localModel.value[key] !== newModel[key]) {
      localModel.value[key] = newModel[key]
    }
  })
}, { deep: true })

// 监听表单配置变化
watch(() => props.formId, initializeModel, { immediate: true })

// 处理字段依赖关系
const handleFieldDependencies = (field: FormField, value: any) => {
  if (!field.dependencies) return
  
  field.dependencies.forEach(dependency => {
    const targetField = formFields.value.find(f => f.prop === dependency.field)
    if (!targetField) return
    
    const shouldMatch = dependency.value
    const isMatch = Array.isArray(shouldMatch) 
      ? shouldMatch.includes(value)
      : value === shouldMatch
    
    switch (dependency.action) {
      case 'show':
      case 'hide':
        // 这里可以实现动态显示/隐藏逻辑
        break
      case 'enable':
      case 'disable':
        // 这里可以实现动态启用/禁用逻辑
        break
    }
  })
}

// 获取字段类型组件
const renderField = (field: FormField) => {
  const isDisabled = props.disabled || props.readonly || field.disabled || props.mode === 'view'
  const isReadonly = props.readonly || field.readonly || props.mode === 'view'
  
  const commonProps = {
    modelValue: localModel.value[field.prop],
    'onUpdate:modelValue': (value: any) => handleFieldChange(field.prop, value),
    placeholder: field.placeholder || `请输入${field.label}`,
    disabled: isDisabled,
    readonly: isReadonly,
    size: props.size,
    clearable: field.type === 'select'
  }

  switch (field.type) {
    case 'textarea':
      return h('el-input', {
        ...commonProps,
        type: 'textarea',
        rows: 4,
        resize: 'vertical'
      })
    
    case 'select':
      return h('el-select', {
        ...commonProps,
        clearable: true,
        filterable: true
      }, {
        default: () => field.options?.map(option => 
          h('el-option', {
            key: option.value,
            label: option.label,
            value: option.value
          })
        )
      })
    
    case 'date':
      return h('el-date-picker', {
        ...commonProps,
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD'
      })
    
    case 'switch':
      return h('el-switch', {
        ...commonProps,
        inlinePrompt: true,
        activeText: '是',
        inactiveText: '否'
      })
    
    case 'checkbox':
      return h('el-checkbox-group', {
        ...commonProps
      }, {
        default: () => field.options?.map(option => 
          h('el-checkbox', {
            key: option.value,
            label: option.value
          }, () => option.label)
        )
      })
    
    case 'radio':
      return h('el-radio-group', {
        ...commonProps
      }, {
        default: () => field.options?.map(option => 
          h('el-radio', {
            key: option.value,
            label: option.value
          }, () => option.label)
        )
      })
    
    default:
      return h('el-input', {
        ...commonProps,
        type: field.type,
        showPassword: field.type === 'password',
        maxlength: field.type === 'text' ? 100 : undefined
      })
  }
}

// 处理字段变化（使用防抖优化性能）
const handleFieldChange = debounce((field: string, value: any) => {
  const oldValue = localModel.value[field]
  localModel.value[field] = value
  
  // 处理字段依赖关系
  const fieldConfig = formFields.value.find(f => f.prop === field)
  if (fieldConfig) {
    handleFieldDependencies(fieldConfig, value)
  }
  
  emit('fieldChange', field, value)
}, 300)

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    const valid = await formRef.value.validate()
    emit('validate', valid)
    
    if (valid) {
      emit('submit', { ...localModel.value })
    } else {
      ElMessage.error('请检查表单填写是否正确')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
    emit('validate', false)
    ElMessage.error('表单验证失败')
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
    initializeModel()
    emit('reset')
  }
}

// 取消表单
const cancelForm = () => {
  emit('cancel')
  emit('update:visible', false)
}

// 获取布局类
const getLayoutClass = () => {
  return `form-layout-${props.layout}`
}

// 获取字段span
const getFieldSpan = (field: FormField) => {
  return field.span || (props.layout === 'inline' ? 6 : 24)
}

// 检查字段是否可见
const isFieldVisible = (field: FormField) => {
  // 这里可以实现复杂的可见性逻辑
  return true
}

// 检查字段是否禁用
const isFieldDisabled = (field: FormField) => {
  return props.disabled || props.readonly || field.disabled || props.mode === 'view'
}

// 获取表单标题
const formTitle = computed(() => {
  if (!formConfig.value) return ''
  
  switch (props.mode) {
    case 'create':
      return `创建${formConfig.value.name}`
    case 'edit':
      return `编辑${formConfig.value.name}`
    case 'view':
      return `查看${formConfig.value.name}`
    default:
      return formConfig.value.name
  }
})

// 获取操作按钮文本
const actionText = computed(() => {
  const defaultText = {
    submit: '提交',
    reset: '重置',
    cancel: '取消'
  }
  
  if (formConfig.value?.actionText) {
    return { ...defaultText, ...formConfig.value.actionText }
  }
  
  // 根据模式调整按钮文本
  if (props.mode === 'edit') {
    return { ...defaultText, submit: '保存' }
  } else if (props.mode === 'view') {
    return { ...defaultText, submit: '确定', reset: undefined }
  }
  
  return defaultText
})
</script>

<template>
  <div class="dynamic-form-builder" :class="getLayoutClass()">
    <!-- 表单标题 -->
    <div v-if="formConfig && formConfig.name" class="form-header">
      <h2 class="form-title">{{ formTitle }}</h2>
      <p v-if="formConfig.description" class="form-description">
        {{ formConfig.description }}
      </p>
    </div>

    <ElForm
      ref="formRef"
      :model="localModel"
      :rules="formRules"
      :label-width="formConfig?.labelWidth || '120px'"
      :label-position="formConfig?.labelPosition || 'right'"
      :size="formConfig?.size || size"
      :disabled="disabled"
      :inline="layout === 'inline'"
    >
      <ElRow :gutter="20">
        <ElCol
          v-for="field in formFields"
          :key="field.prop"
          :span="getFieldSpan(field)"
          v-show="isFieldVisible(field)"
        >
          <ElFormItem
            :label="field.label"
            :prop="field.prop"
            :required="field.required"
            :rules="field.validation?.rules"
          >
            <component :is="() => renderField(field)" />
            
            <div v-if="field.description" class="field-description">
              {{ field.description }}
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>
      
      <!-- 操作按钮 -->
      <div v-if="showActions" class="form-actions">
        <ElButton
          v-if="actionText.submit && mode !== 'view'"
          type="primary"
          :loading="loading"
          @click="submitForm"
        >
          {{ actionText.submit }}
        </ElButton>
        
        <ElButton 
          v-if="actionText.reset && mode !== 'view'"
          @click="resetForm"
        >
          {{ actionText.reset }}
        </ElButton>
        
        <ElButton 
          v-if="actionText.cancel"
          @click="cancelForm"
        >
          {{ actionText.cancel }}
        </ElButton>
      </div>
    </ElForm>
  </div>
</template>

<style scoped>
.dynamic-form-builder {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.form-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.form-description {
  margin: 0;
  font-size: 14px;
  color: #909399;
  line-height: 1.6;
}

.form-layout-horizontal {
  /* 水平布局样式 */
}

.form-layout-vertical {
  /* 垂直布局样式 */
}

.form-layout-vertical :deep(.el-form-item) {
  flex-direction: column;
  align-items: flex-start;
}

.form-layout-vertical :deep(.el-form-item__label) {
  width: 100% !important;
  text-align: left;
  margin-bottom: 8px;
}

.form-layout-inline {
  /* 内联布局样式 */
}

.field-description {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}

.form-actions :deep(.el-button) {
  min-width: 80px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dynamic-form-builder {
    padding: 16px;
  }
  
  .form-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
  }
  
  .form-title {
    font-size: 18px;
  }
  
  .form-layout-horizontal :deep(.el-form-item__label) {
    width: 100% !important;
    text-align: left;
    margin-bottom: 8px;
  }
  
  .form-layout-horizontal :deep(.el-form-item) {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .form-actions :deep(.el-button) {
    width: 100%;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .dynamic-form-builder {
    background: #1a1a1a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .form-header {
    border-bottom-color: #3a3a3a;
  }
  
  .form-title {
    color: #e0e0e0;
  }
  
  .form-description {
    color: #a0a0a0;
  }
  
  .field-description {
    color: #a0a0a0;
  }
}

/* 动画效果 */
.dynamic-form-builder {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 加载状态 */
.dynamic-form-builder.loading {
  pointer-events: none;
  opacity: 0.7;
}

/* 只读模式 */
.dynamic-form-builder.readonly :deep(.el-input__wrapper) {
  background-color: #f5f7fa;
  cursor: not-allowed;
}

.dynamic-form-builder.readonly :deep(.el-select .el-input__wrapper) {
  background-color: #f5f7fa;
  cursor: not-allowed;
}
</style>
