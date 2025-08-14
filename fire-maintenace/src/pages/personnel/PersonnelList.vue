<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/common/DataTable.vue'
import Card from '@/components/common/Card.vue'

// 表格列定义
const columns = ref([
  {
    prop: 'id',
    label: '员工编号',
    width: '100'
  },
  {
    prop: 'name',
    label: '姓名',
    width: '120'
  },
  {
    prop: 'department',
    label: '部门',
    width: '120'
  },
  {
    prop: 'position',
    label: '职位',
    width: '120'
  },
  {
    prop: 'phone',
    label: '联系电话',
    width: '140'
  },
  {
    prop: 'email',
    label: '邮箱',
    width: '200'
  },
  {
    prop: 'status',
    label: '状态',
    width: '100'
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    width: '160'
  }
])

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const error = ref<Error | string | null>(null)

// 分页配置
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
  small: false,
  background: true
})

// 操作按钮
const actions = [
  {
    label: '编辑',
    type: 'primary' as const,
    size: 'small' as const,
    onClick: (row: any, index: number) => {
      console.log('编辑员工:', row, index)
    }
  },
  {
    label: '删除',
    type: 'danger' as const,
    size: 'small' as const,
    onClick: (row: any, index: number) => {
      console.log('删除员工:', row, index)
    }
  }
]

// 加载数据
const loadData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    const mockData = [
      {
        id: 'EMP001',
        name: '张三',
        department: '技术部',
        position: '工程师',
        phone: '13800138001',
        email: 'zhangsan@example.com',
        status: '在职',
        createdAt: '2024-01-01 10:00:00'
      },
      {
        id: 'EMP002',
        name: '李四',
        department: '市场部',
        position: '经理',
        phone: '13800138002',
        email: 'lisi@example.com',
        status: '在职',
        createdAt: '2024-01-02 10:00:00'
      },
      {
        id: 'EMP003',
        name: '王五',
        department: '财务部',
        position: '会计',
        phone: '13800138003',
        email: 'wangwu@example.com',
        status: '离职',
        createdAt: '2024-01-03 10:00:00'
      }
    ]
    
    tableData.value = mockData
    pagination.value.total = mockData.length
  } catch (err) {
    error.value = err as Error | string
    console.error('加载员工数据失败:', err)
  } finally {
    loading.value = false
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
  <div class="personnel-list">
    <Card title="员工管理">
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
  </div>
</template>

<style scoped>
.personnel-list {
  padding: 20px;
}
</style>
