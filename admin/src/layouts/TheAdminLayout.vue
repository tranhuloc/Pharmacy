<template>
  <el-container class="v-application">
    <el-container>
      <TheSideBar v-if="isMenuVisibleLocal" :isCollapse="isCollapse" />
      <el-main>
        <TheNavBar @toogleSidebar="onCollapse" @isMenuVisible="isMenuVisibleLocal" />
        <slot></slot>
      </el-main>
    </el-container>
    <vc-confirm ref="logoutPopup"></vc-confirm>
    <!-- <vc-toast /> -->
  </el-container>
</template>

<script setup lang="ts">
import TheNavBar from '@/components/layouts/TheNavBar.vue'
import TheSideBar from '@/components/layouts/TheSideBar.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isCollapse = ref<boolean>(false)
const isMenuVisibleLocal = ref<boolean>(true)
const logoutPopup = ref<any>(null)

const getCurrentURL = () => {
  return window.location.pathname
}

onMounted(async () => {
  handleResize();
  window.addEventListener('resize', handleResize);
  const loggedIn = localStorage.getItem("isLoggedIn") ?? false
  if (!loggedIn)
    gotoLogin()

})

const handleResize = () => {
  if (window.matchMedia("(max-width: 768px)").matches) {
    isMenuVisibleLocal.value = false;
  }
  else {
    isMenuVisibleLocal.value = true;
  }
};

const onCollapse = (value: any) => {
  isCollapse.value = value
}

const gotoLogin = () => {
  // oidcAuth.signinRedirect()

  router.push({
    name: "Login",
  });
}

</script>

<style lang="scss">
@import '@/assets/styles/main.scss';
@import '@/assets/styles/page/client/_footerClient.scss';
</style>
