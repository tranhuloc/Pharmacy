<template>
  <el-row class="vc-collapse">
    <el-col :span="24">
      <el-collapse v-model="props.activeNames">
        <el-collapse-item name="1">
          <slot></slot>
        </el-collapse-item>
      </el-collapse>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">

const props = defineProps<{
  activeNames: string[];
}>();

</script>

<style lang="scss">
.vc-collapse .el-collapse-item__header {
  display: none !important;
}
</style>
