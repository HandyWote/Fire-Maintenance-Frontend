<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/common/DataTable.vue'
import Card from '@/components/common/Card.vue'

// 表格列定义
const columns = ref([
  {
    prop: 'id',
    label: '合同编号',
    width: '140'
  },
  {
    prop: 'name',
    label: '合同名称',
    width: '200'
  },
  {
    prop: 'type',
    label: '合同类型',
    width: '120'
  },
  {
    prop: 'company',
    label: '签约企业',
    width: '180'
  },
  {
    prop: 'amount',
    label: '合同金额',
    width: '120'
  },
  {
    prop: 'startDate',
    label: '开始日期',
    width: '120'
  },
  {
    prop: 'endDate',
    label: '结束日期',
    width: '120'
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
    label: '查看',
    type: 'primary' as const,
    size: 'small' as const,
    onClick: (row: any, index: number) => {
      console.log('查看合同:', row, index)
    }
  },
  {
    label: '编辑',
    type: 'warning' as const,
    size: 'small' as const,
    onClick: (row: any, index: number) => {
      console.log('编辑合同:', row, index)
    }
  },
  {
    label: '删除',
    type: 'danger' as const,
    size: 'small' as const,
    onClick: (row: any, index: number) => {
      console.log('删除合同:', row, index)
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
        id: 'CON001',
        name: '北京科技维保合同',
        type: '维保合同',
        company: '北京科技有限公司',
        amount: '100,000',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: '执行中',
        createdAt: '2024-01-01 10:00:00'
      },
      {
        id: 'CON002',
        name: '上海商贸检测合同',
        type: '检测合同',
        company: '上海商贸有限公司',
        amount: '50,000',
        startDate: '2024-02-01',
        endDate: '2024-08-31',
        status: '执行中',
        createdAt: '2024-01-02 10:00:00'
      },
      {
        id: 'CON003',
        name: '广州制造评估合同',
        type: '评估合同',
        company: '广州制造有限公司',
        amount: '30,000',
        startDate: '2024-03-01',
        endDate: '2024-06-30',
        status: '已完成',
        createdAt: '2024-01-03 10:00:00'
      }
    ]
    
    tableData.value = mockData
    pagination.value.total = mockData.length
  } catch (err) {
    error.value = err as Error | string
    console.error('加载合同数据失败:', err)
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
  <div class="contract-list">
    <Card title="合同管理">
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
.contract-list {
  padding: 20px;
}
</style>
