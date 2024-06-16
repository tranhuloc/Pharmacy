<template>
  <div class="page page-login">
    <div class="container header">
      <h1 class="title-district">MDS Management</h1>
    </div>
    <div class="box-login">
      <div class="title">Chào mừng bạn đến với hệ thống quản lí</div>
      <div class="login-form">
        <vc-notify></vc-notify>
        <el-form ref="loginFormRef" @submit="onLogin(loginFormRef)" :model="request" :rules="rules">
          <vc-input-group required prop="email">
            <el-input class="input h-50" v-model="request.email" placeholder="Địa chỉ email" type="email"
              autocomplete="off">
              <template #append>
                <span class="input-group-text">
                  <img src="/images/user.svg" width="20" height="20" /></span>
              </template>
            </el-input>
          </vc-input-group>

          <vc-input-group required prop="password" class="mt-10">
            <el-input class="input h-50" v-model="request.password" placeholder="Mật khẩu" type="password"
              autocomplete="off" show-password>
              <template #append>
                <span>
                  <img src="/images/lock.svg" width="20" height="20" /></span>
              </template>
            </el-input>
          </vc-input-group>

        </el-form>
      </div>
    </div>
    <vc-button type="primary" class="btn-login mt-5" native-type="submit" :loading="isLoading"
      @click="onLogin(loginFormRef)">
      Đăng nhập
    </vc-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import validate from '@/utils/validate_elp'
import type { FormInstance } from 'element-plus'
import authService from '@auth/services/auth.service'

const isLoading = ref<boolean>(false)
const router = useRouter()
const loginFormRef = ref<FormInstance>()

const request = reactive({
  email: null,
  password: null,
  isAdmin: true,
})

const rules = reactive({
  email: [
    {
      required: true,
      validator: validate.required,
      trigger: 'blur',
      label: 'Địa chỉ email',
    },
  ],
  password: [
    {
      required: true,
      validator: validate.required,
      trigger: 'blur',
      label: 'Password',
    },
  ],
})

onMounted(() => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") ?? false
  if (isLoggedIn) {
    router.push({
      name: 'Dashboard',
    })
  } else {
    router.push({
      name: 'Login',
    })
  }
})

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (!valid) return

    isLoading.value = true

    await authService
      .signIn(request)
      .then((response: any) => {
        if (response.success == true) {
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem('roleName', response.data.role_name)
          localStorage.setItem("userInfo", JSON.stringify(response.data.user));
          router.push({
            name: 'Dashboard',
          })
        }
      })
      .finally(() => {
        isLoading.value = false
      })
  })
}

</script>

<style lang="scss">
@import '@/assets/styles/page/login_new';
</style>
