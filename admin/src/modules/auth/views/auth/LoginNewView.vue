<template>
  <div class="page page-login">
    <div class="container header">
      <h1 class="title-district">Description</h1>
    </div>
    <div class="box-login">
      <div class="logo"><img src="/images/logo.png" /></div>
      <div class="title">Title</div>
      <div class="login-form">
        <vc-notify></vc-notify>
        <el-form ref="loginFormRef" @submit="onLogin(loginFormRef)" :model="request" :rules="rules">
          <vc-input-group required prop="username">
            <el-input class="input h-50" v-model="request.username" placeholder="UserName"
              autocomplete="off">
              <template #append>
                <span class="input-group-text">
                  <img src="/images/user.svg" width="20" height="20" /></span>
              </template>
            </el-input>
          </vc-input-group>

          <vc-input-group required prop="password" class="mt-10">
            <el-input class="input h-50" v-model="request.password" placeholder="Password" type="password"
              autocomplete="off" show-password>
              <template #append>
                <span>
                  <img src="/images/lock.svg" width="20" height="20" /></span>
              </template>
            </el-input>
          </vc-input-group>

          <vc-row :gutter="12" v-if="enableCaptcha" class="mt-10">
            <vc-col :span="24" :md="{ span: 12 }">
              <vc-input-group required prop="captChaText">
                <el-input v-model="request.captChaText" class="vc-input-cap" placeholder="Captcha"
                  type="text" />
              </vc-input-group>
            </vc-col>
            <vc-col :span="24" :md="{ span: 12 }">
              <div class="captcha">
                <div class="captcha-content">
                  <div class="np-captcha-container">
                    <div class="np-captcha" v-if="captcha && captcha.length">
                      <div v-for="(c, i) in captcha" :key="i" :style="{
                        fontSize: getFontSize() + 'px',
                        fontWeight: 800,
                        transform: 'rotate(' + getRotationAngle() + 'deg)',
                        color: getRandomColor(),
                      }" class="np-captcha-character protected-text">
                        {{ c }}
                      </div>
                    </div>
                  </div>
                  <div class="d-flex justify-content-center align-items-center">
                    <img src="/images/sync.png" style="cursor: pointer" @click="createCaptcha()" width="18" height="18" />
                  </div>
                </div>
              </div>
            </vc-col>
            <vc-col>
              <vc-input-group class="mt-4 mb-0s">
                <vc-checkbox v-model="request.remember" label="Remember"></vc-checkbox>
              </vc-input-group>
            </vc-col>
          </vc-row>
        </el-form>
      </div>
    </div>
    <vc-button type="primary" class="btn-login mt-5" native-type="submit" :loading="isLoading"
      @click="onLogin(loginFormRef)">
      BtnLogin
    </vc-button>
    <div class="custom-footer-login">
      <footer class="text-center">
        <vc-row :gutter="12" class="align-items-center">
          <vc-col :span="24" :md="{ span: 12 }">
            <span class="custom-text-footer text-uppercase">TitleFooter</span>
          </vc-col>
          <vc-col :span="24" :md="{ span: 12 }" class="d-flex justify-content-center  align-items-center">
            <span class="mr-1 bold">Thông tin liên hệ: PhoneFooter</span> |
            <span class="ml-1 bold">Email: EmailFooter
            </span>
          </vc-col>
        </vc-row>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import { useAuthStore } from "@auth/stores/auth.store";
import { useRouter } from 'vue-router'
import validate from '@/utils/validate_elp'
import type { FormInstance } from 'element-plus'
import { storeToRefs } from 'pinia'
const env = import.meta.env

const isLoading = ref<boolean>(false)
const authStore = useAuthStore()
const { loggedIn } = storeToRefs(authStore)
const router = useRouter()
const loginFormRef = ref<FormInstance>()
const captChaText = ref('')
const enableCaptcha = ref(false)

const request = reactive({
  username: null,
  password: null,
  remember: true,
  captChaText: '',
})

const captcha = ref()

const validateCapcha = (rule: any, value: any, callback: any) => {
  if (enableCaptcha.value) {
    if (value.toUpperCase() === captChaText.value.toUpperCase()) {
      callback()
    } else {
      callback(new Error('Mã xác nhận không chính xác.'))
    }
  }
}

const rules = reactive({
  username: [
    {
      required: true,
      validator: validate.required,
      trigger: 'blur',
      label: 'UserName',
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
  captChaText: [
    {
      required: true,
      validator: validate.required,
      trigger: 'blur',
      label: 'Capcha',
    },
    {
      validator: validateCapcha,
      trigger: 'blur',
    },
  ],
})

onMounted(() => {
  enableCaptcha.value = env.VITE_ENABLE_CAPTCHA == 'true'

  if (enableCaptcha.value) {
    createCaptcha()
  }

  authStore.refresh().then((isLoggedIn) => {
    if (isLoggedIn) {
      router.push({
        name: 'Dashboard',
      })
    }else{
      router.push({
        name: 'Login',
      })
    }
  })
})

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (!valid) return

    isLoading.value = true

    await authStore
      .login(request)
      .then((isLogged) => {
        if (isLogged)
          router.push({
            name: 'Dashboard',
          })
      })
      .finally(() => {
        isLoading.value = false
      })
  })
}

const createCaptcha = () => {
  let tempCaptcha = ''
  for (let i = 0; i < 5; i++) {
    tempCaptcha += getRandomCharacter()
  }
  captChaText.value = tempCaptcha
  captcha.value = tempCaptcha.split('')
}

const getRandomCharacter = () => {
  const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const randomNumber = Math.floor(Math.random() * 26)
  return symbols[randomNumber]
}

const getFontSize = () => {
  const fontVariations = [22, 18, 18, 25, 20]
  return fontVariations[Math.floor(Math.random() * 5)]
}

const getRotationAngle = () => {
  const rotationVariations = [5, 10, 15, 20, -5, -10, -15, -20]
  return rotationVariations[Math.floor(Math.random() * 8)]
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
</script>

<style lang="scss">
@import '@/assets/styles/page/login_new';
</style>
