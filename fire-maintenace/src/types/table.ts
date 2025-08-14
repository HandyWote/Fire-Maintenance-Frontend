export interface TableColumn {
  prop?: string
  label?: string
  width?: string | number
  minWidth?: string | number
  fixed?: 'left' | 'right' | boolean
  sortable?: boolean
  sortMethod?: (a: any, b: any) => number
  formatter?: (row: any, column: any, cellValue: any, index: number) => string | any
  showOverflowTooltip?: boolean
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  className?: string
  labelClassName?: string
  type?: 'selection' | 'index' | 'expand'
  selectable?: (row: any, index: number) => boolean
  reserveSelection?: boolean
  filters?: Array<{ text: string; value: any }>
  filterMethod?: (value: any, row: any) => boolean
  filterMultiple?: boolean
  filterPlacement?: string
}

export interface TableAction {
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  icon?: string
  size?: 'small' | 'default' | 'large'
  disabled?: boolean | ((row: any, index: number) => boolean)
  visible?: boolean | ((row: any, index: number) => boolean)
  onClick: (row: any, index: number) => void
  tooltip?: string
  confirm?: boolean
  confirmText?: string
  confirmTitle?: string
}

export interface TablePagination {
  page: number
  pageSize: number
  total: number
  pageSizes?: number[]
  layout?: string
  small?: boolean
  background?: boolean
}

export interface TableProps {
  data: any[]
  columns: TableColumn[]
  loading?: boolean
  error?: Error | string | null
  emptyText?: string
  actions?: TableAction[]
  showPagination?: boolean
  pagination?: TablePagination
  height?: string | number
  maxHeight?: string | number
}

export interface TableEmits {
  'update:pagination': [pagination: TablePagination]
  'selection-change': [selection: any[]]
  'select': [selection: any, row: any]
  'select-all': [selection: any[]]
  'sort-change': [sort: any]
  'filter-change': [filters: any]
  'current-change': [currentRow: any]
  'row-click': [row: any, column: TableColumn, event: Event]
  'row-dblclick': [row: any, column: TableColumn, event: Event]
  'row-contextmenu': [row: any, column: TableColumn, event: Event]
  'cell-click': [row: any, column: TableColumn, cell: any, event: Event]
  'cell-dblclick': [row: any, column: TableColumn, cell: any, event: Event]
  'header-click': [column: TableColumn, event: Event]
  'header-contextmenu': [column: TableColumn, event: Event]
  'expand-change': [row: any, expanded: boolean]
  'page-change': [page: number]
  'page-size-change': [pageSize: number]
}
