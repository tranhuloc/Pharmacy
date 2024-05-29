<template>
  <div class="vc-page page-home"></div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import userService from '@master/services/user.service'
  import { useAuthStore } from '@auth/stores/auth.store'
  import { useToastStore } from '@/stores/toast.store'

  const loading = ref<boolean>(false)
  const confirmDialog = ref<any>(null)
  const authStore = useAuthStore()
  const router = useRouter()

  const onLogout = () => {
    authStore.logout()
    router.push({
      name: 'Login',
    })
  }

  const getApi = async () => {
    loading.value = true
    await userService
      .getList()
      .then((data: any) => {
        console.log(data)
      })
      .finally(() => {
        loading.value = false
      })
  }

  const toastStore = useToastStore()

  const pushToast = (type: string) => {
    toastStore.push({
      type: type,
      message: '123123123123123',
    })
  }

  const confirms = () => {
    confirmDialog.value.confirm('Logout', 'Are your sure ?', (res: any) => {
      console.log(res)
    })
  }

  const onAlert = () => {
    confirmDialog.value.alert('Logout', 'Are your sure ?', (res: any) => {
      console.log(res)
    })
  }
</script>
