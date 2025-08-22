<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import DynamicFormBuilder from './DynamicFormBuilder.vue'
import type { Company, CompanyFormData } from '@/types/company'
import { useCompaniesStore } from '@/stores/companies'
import { companyService } from '@/services/company'

interface CompanyFormProps {
  visible: boolean
  company?: Company | null
  mode?: 'create' | 'edit'
}

const props = withDefaults(defineProps<CompanyFormProps>(), {
  mode: 'create'
})

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  submit: [company: Company]
  cancel: []
}>()

const companiesStore = useCompaniesStore()

// 表单数据
const formData = ref<CompanyFormData>({
  name: '',
  code: '',
  address: '',
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  businessLicense: '',
  taxNumber: '',
  bankAccount: '',
  bankName: '',
  status: 'active',
  description: ''
})

// 加载状态
const loading = ref(false)

// 监听props变化，初始化表单数据
watch(() => props.visible, (newVisible: boolean) => {
  if (newVisible) {
    initializeForm()
  }
})

watch(() => props.company, (newCompany) => {
  if (newCompany && props.mode === 'edit') {
    initializeForm()
  }
}, { deep: true })

// 初始化表单数据
const initializeForm = () => {
  if (props.mode === 'edit' && props.company) {
    formData.value = {
      name: props.company.name,
      code: props.company.code,
      address: props.company.address,
      contactPerson: props.company.contactPerson,
      contactPhone: props.company.contactPhone,
      contactEmail: props.company.contactEmail,
      businessLicense: props.company.businessLicense,
      taxNumber: props.company.taxNumber,
      bankAccount: props.company.bankAccount,
      bankName: props.company.bankName,
      status: props.company.status,
      description: props.company.description || ''
    }
  } else {
    formData.value = {
      name: '',
      code: companiesStore.generateCompanyCode(),
      address: '',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      businessLicense: '',
      taxNumber: '',
      bankAccount: '',
      bankName: '',
      status: 'active',
      description: ''
    }
  }
}

// 处理表单提交
const handleSubmit = async (data: Record<string, any>) => {
  loading.value = true
  
  try {
    // 转换数据类型
    const companyData = data as CompanyFormData
    
    // 验证数据
    const validation = companiesStore.validateCompanyData(companyData)
    if (!validation.isValid) {
      ElMessage.error(Object.values(validation.errors).join('，'))
      return
    }
    
    let result: Company
    
    if (props.mode === 'create') {
      // 创建公司
      try {
        // 尝试调用真实API
        result = await companyService.createCompany(companyData)
        ElMessage.success('公司创建成功')
      } catch (error) {
        console.warn('API调用失败，使用本地存储:', error)
        
        // 使用本地存储
        const newCompany: Company = {
          ...companyData as Company,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        companiesStore.addCompany(newCompany)
        result = newCompany
        ElMessage.success('公司创建成功（本地模式）')
      }
    } else {
      // 编辑公司
      if (!props.company) {
        throw new Error('编辑模式缺少公司数据')
      }
      
      try {
        // 尝试调用真实API
        result = await companyService.updateCompany(props.company.id, companyData)
        ElMessage.success('公司信息更新成功')
      } catch (error) {
        console.warn('API调用失败，使用本地存储:', error)
        
        // 使用本地存储
        const updatedCompany: Company = {
          ...props.company,
          ...companyData,
          updatedAt: new Date().toISOString()
        }
        companiesStore.updateCompany(updatedCompany)
        result = updatedCompany
        ElMessage.success('公司信息更新成功（本地模式）')
      }
    }
    
    emit('submit', result)
    emit('update:visible', false)
  } catch (error) {
    console.error('提交表单失败:', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    loading.value = false
  }
}

// 处理表单重置
const handleReset = () => {
  initializeForm()
}

// 处理表单取消
const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}

// 处理字段变化
const handleFieldChange = (field: string, value: any) => {
  // 可以在这里添加字段变化逻辑
  console.log(`字段 ${field} 变化为:`, value)
}

// 处理表单验证
const handleValidate = (isValid: boolean) => {
  if (!isValid) {
    console.warn('表单验证失败')
  }
}

// 计算对话框标题
const dialogTitle = computed(() => {
  return props.mode === 'create' ? '创建公司' : '编辑公司'
})
</script>

<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    :title="dialogTitle"
    width="800px"
    :close-on-click-modal="false"
    @close="handleCancel"
  >
    <div class="company-form">
      <DynamicFormBuilder
        form-id="company"
        :model="formData"
        :mode="mode"
        :loading="loading"
        @submit="handleSubmit"
        @reset="handleReset"
        @cancel="handleCancel"
        @field-change="handleFieldChange"
        @validate="handleValidate"
        @update:visible="$emit('update:visible', $event)"
      />
    </div>
  </el-dialog>
</template>

<style scoped>
.company-form {
  max-height: 70vh;
  overflow-y: auto;
}

/* 自定义滚动条 */
.company-form::-webkit-scrollbar {
  width: 6px;
}

.company-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.company-form::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.company-form::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .company-form::-webkit-scrollbar-track {
    background: #2a2a2a;
  }
  
  .company-form::-webkit-scrollbar-thumb {
    background: #555;
  }
  
  .company-form::-webkit-scrollbar-thumb:hover {
    background: #777;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .company-form {
    max-height: 80vh;
  }
}
</style>
