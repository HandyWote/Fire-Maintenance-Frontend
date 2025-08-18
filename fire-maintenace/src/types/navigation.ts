export interface NavigationItem {
  id: string
  label: string
  icon?: string
  path?: string
  children?: NavigationItem[]
  visible?: boolean
}

export interface NavigationTreeProps {
  data: NavigationItem[]
  currentNode?: string
  highlightCurrent?: boolean
  expandOnClickNode?: boolean
  defaultExpandedKeys?: string[]
}

export interface NavigationTreeEmits {
  'node-click': [data: NavigationItem]
  'current-change': [data: NavigationItem | null]
}
