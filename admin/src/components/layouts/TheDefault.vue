<template>
  <el-container class="v-application">
    <!-- <TheSideBar :isCollapse="isCollapse" v-if="loggedIn" /> -->
    <div class="page-container is-vertical">
      <TheNavBar @toogleSidebar="onCollapse" v-show="loggedIn" />
      <!-- <TheMenu /> -->
      <el-main>
        <RouterView />
      </el-main>
    </div>
    <vc-toast />
  </el-container>
</template>

<script setup lang="ts">
// import { useRouter } from "vue-router";
import TheNavBar from './TheNavBar.vue'
import { onMounted, ref } from 'vue'
import router from '@/modules/router';

const isCollapse = ref<boolean>(false)

onMounted(() => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") ?? false
  if (!isLoggedIn) {
    router.push({
      name: 'Login',
    })
  }
})

const onCollapse = (value: any) => {
  isCollapse.value = value
}
</script>

<style lang="scss">
@import '@/assets/styles/main.scss';
</style>
