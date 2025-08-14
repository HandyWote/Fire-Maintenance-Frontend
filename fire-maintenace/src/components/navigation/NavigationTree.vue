<script setup lang="ts">
import { ElTree } from 'element-plus'
import type { NavigationItem, NavigationTreeProps, NavigationTreeEmits } from '@/types/navigation'

// 接收props，定义emits
const props = withDefaults(defineProps<NavigationTreeProps>(), {
  highlightCurrent: true,
  expandOnClickNode: false,
  defaultExpandedKeys: () => []
})

const emit = defineEmits<NavigationTreeEmits>()

// 导航树配置
const treeProps = {
  children: 'children',
  label: 'label'
}

// 处理节点点击
const handleNodeClick = (data: NavigationItem) => {
  emit('node-click', data)
}
</script>

<template>
  <ElTree
    :data="props.data"
    :props="treeProps"
    :node-key="'id'"
    :expand-on-click-node="props.expandOnClickNode"
    :default-expanded-keys="props.defaultExpandedKeys"
    :current-node-key="props.currentNode"
    :highlight-current="props.highlightCurrent"
    @node-click="handleNodeClick"
    class="navigation-tree"
  />
</template>

<style scoped>
/* 导入外部样式文件 */
@import '@/styles/navigation.scss';
</style>
