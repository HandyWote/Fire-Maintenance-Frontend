<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DataTable from '@/components/common/DataTable.vue'
import Card from '@/components/common/Card.vue'
import CompanyForm from '@/components/forms/CompanyForm.vue'
import { companyService } from '@/services/company'
import type { TableColumn, TableAction, TablePagination } from '@/types/table'
import type { Company } from '@/types/company'
import { useCompaniesStore } from '@/stores/companies'

// 表格列定义
const columns = ref<TableColumn[]>([
  {
    prop: 'id',
    label: '企业编号',
    width: '120'
  },
  {
    prop: 'name',
    label: '企业名称',
    width: '180'
  },
  {
    prop: 'address',
    label: '企业地址',
    width: '200'
  },
  {
    prop: 'contactPerson',
    label: '联系人',
    width: '100'
  },
  {
    prop: 'contactPhone',
    label: '联系电话',
    width: '140'
  },
  {
    prop: 'contactEmail',
    label: '邮箱',
    width: '180'
  },
  {
    prop: 'businessLicense',
    label: '营业执照号',
    width: '160'
  },
  {
    prop: 'status',
    label: '状态',
    width: '100',
    formatter: (row: Company) => {
      const status = statusMap[row.status as keyof typeof statusMap]
      return status ? status.label : row.status
    }
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    width: '160',
    formatter: (row: Company) => {
      return new Date(row.createdAt).toLocaleString()
    }
  }
])

// 表格数据
const tableData = ref<Company[]>([])
const loading = ref(false)
const error = ref<Error | string | null>(null)

// 分页配置
const pagination = ref<TablePagination>({
  page: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
  small: false,
  background: true
})

// 公司表单相关
const showCompanyForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const currentCompany = ref<Company | null>(null)
const companiesStore = useCompaniesStore()

// 状态映射
const statusMap = {
  active: { label: '正常', type: 'success' },
  inactive: { label: '停用', type: 'danger' },
  pending: { label: '待审核', type: 'warning' }
}

// 操作按钮
const actions = ref<TableAction[]>([
  {
    label: '编辑',
    type: 'primary',
    size: 'small',
    onClick: (row: Company, index: number) => {
      handleEdit(row, index)
    }
  },
  {
    label: '删除',
    type: 'danger',
    size: 'small',
    onClick: (row: Company, index: number) => {
      handleDelete(row, index)
    }
  },
  {
    label: '启用',
    type: 'success',
    size: 'small',
    visible: (row: Company) => row.status === 'inactive',
    onClick: (row: Company, index: number) => {
      handleEnable(row, index)
    }
  },
  {
    label: '禁用',
    type: 'warning',
    size: 'small',
    visible: (row: Company) => row.status === 'active',
    onClick: (row: Company, index: number) => {
      handleDisable(row, index)
    }
  }
])

// 加载数据
const loadData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await companyService.getAllCompanies({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    })
    
    tableData.value = result.data
    pagination.value.total = result.total
  } catch (err) {
    error.value = err as Error | string
    console.error('加载企业数据失败:', err)
    ElMessage.error('加载企业数据失败')
  } finally {
    loading.value = false
  }
}

// 创建企业
const handleCreate = () => {
  formMode.value = 'create'
  currentCompany.value = null
  showCompanyForm.value = true
}

// 编辑企业
const handleEdit = (row: Company, _index: number) => {
  formMode.value = 'edit'
  currentCompany.value = row
  showCompanyForm.value = true
}

// 处理表单提交
const handleFormSubmit = (company: Company) => {
  ElMessage.success(`${formMode.value === 'create' ? '创建' : '编辑'}企业成功`)
  loadData() // 重新加载数据
  showCompanyForm.value = false
}

// 处理表单取消
const handleFormCancel = () => {
  showCompanyForm.value = false
}

// 删除企业
const handleDelete = async (row: any, _index: number) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除企业 "${row.name}" 吗？此操作不可撤销。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await companyService.deleteCompany(row.id)
    ElMessage.success('删除成功')
    loadData() // 重新加载数据
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除企业失败:', error)
      ElMessage.error('删除企业失败')
    }
  }
}

// 启用企业
const handleEnable = async (row: any, _index: number) => {
  try {
    await companyService.enableCompany(row.id)
    ElMessage.success('启用成功')
    loadData() // 重新加载数据
  } catch (error) {
    console.error('启用企业失败:', error)
    ElMessage.error('启用企业失败')
  }
}

// 禁用企业
const handleDisable = async (row: any, _index: number) => {
  try {
    await companyService.disableCompany(row.id)
    ElMessage.success('禁用成功')
    loadData() // 重新加载数据
  } catch (error) {
    console.error('禁用企业失败:', error)
    ElMessage.error('禁用企业失败')
  }
}

// 页面变化处理
const handlePageChange = (page: number) => {
  pagination.value.page = page
  loadData()
}

// 每页条数变化处理
const handlePageSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize
  pagination.value.page = 1
  loadData()
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="company-list">
    <Card title="企业管理">
      <!-- 操作按钮区域 -->
      <div class="table-actions">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          新建企业
        </el-button>
      </div>
      
      <DataTable
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :error="error"
        :actions="actions"
        :pagination="pagination"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </Card>
    
    <!-- 公司表单对话框 -->
    <CompanyForm
      v-model:visible="showCompanyForm"
      :company="currentCompany"
      :mode="formMode"
      @submit="handleFormSubmit"
      @cancel="handleFormCancel"
    />
  </div>
</template>

<style scoped>
.company-list {
  padding: 20px;
}

.table-actions {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.table-actions .el-button {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .company-list {
    padding: 12px;
  }
  
  .table-actions {
    margin-bottom: 12px;
  }
  
  .table-actions .el-button {
    width: 100%;
    justify-content: center;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .table-actions .el-button {
    border-color: #4a4a4a;
    background-color: #2a2a2a;
    color: #e0e0e0;
  }
  
  .table-actions .el-button:hover {
    border-color: #5a5a5a;
    background-color: #3a3a3a;
  }
}
</style>
