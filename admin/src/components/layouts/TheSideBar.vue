<template>
  <el-aside :class="['side-bar', { isCollapse: isCollapse }]">
    <el-scrollbar height="100vh">
      <vc-menu :collapse="isCollapse"></vc-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted } from "vue";

const props = defineProps<{
  show?: boolean;
  isCollapse?: boolean;
}>();

const isCollapse = ref(props.isCollapse ?? false);

watchEffect(() => {
  isCollapse.value = props.isCollapse ?? isCollapse.value;
});

</script>

<style lang="scss">
@import "@/assets/styles/commons/sidebar";
</style>


<style lang="scss">
@import "@/assets/styles/commons/sidebar";
</style>
