<template>
  <div class="navbar">
    <el-header class="navbar-header">
      <el-row :gutter="20">
        <el-col :span="1" v-if="!isMenuVisibleLocal">
          <vc-button type="primary" class="btn-toggle-code" icon="DArrowLeft"
            :class="['btn-toggle-sidebar', { actived: showNav },]" @click="toogleSidebar" />
        </el-col>

        <el-col :span="isMenuVisibleLocal ? 18 : 17" class="col-left">
          <el-header :style="{ width: `${widthMenu}px` }">
            <vc-menu v-if="isMenuVisibleLocal" mode="horizontal" class="vc-menu-horizontal"></vc-menu>
          </el-header>
        </el-col>

        <el-col :span="6" class="col-right">
          <el-link type="primary" :underline="false" @click="goPage('AccountProfile')">
            <span> {{ userInfo.fullname }} </span>
            <el-icon class="el-icon--right">
              <CaretBottom />
            </el-icon>
          </el-link>
        </el-col>
      </el-row>
    </el-header>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue';

const router = useRouter()
const showNav = ref(false)

const isMenuVisibleLocal = ref<boolean>(false)
const userInfo = ref<any>({})
const widthMenu = ref(window.innerWidth - 200)
const emit = defineEmits(['toogleSidebar'])

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  userInfo.value = JSON.parse(localStorage.getItem('userInfo')) ?? {};
})

const handleResize = () => {
  widthMenu.value = window.innerWidth - 200;
  if (window.matchMedia("(max-width: 768px)").matches) {
    isMenuVisibleLocal.value = true;
  }
  else isMenuVisibleLocal.value = false;
};

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});


const goPage = async (name: string) => {
  router.push({
    name: name,
  })
}

const toogleSidebar = () => {
  showNav.value = !showNav.value
  emit('toogleSidebar', showNav.value)
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/commons/navbar.scss';
</style>
