export interface TableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  fixed?: 'left' | 'right'
  sortable?: boolean
  sortMethod?: (a: any, b: any) => number
  formatter?: (row: any, column: TableColumn, cellValue: any, index: number) => string | any
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
