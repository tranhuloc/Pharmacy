import { storeToRefs } from 'pinia'
import { useAuthStore } from '@auth/stores/auth.store'

export default {
  install(app: any) {
    app.directive('permission', {
      mounted(el: any, binding: any) {
        const authStore = useAuthStore()
        const { account } = storeToRefs(authStore)
        const checkPermission = account.value.permissions?.find((x: any) => x == binding.value) ? true : false;
        if (!checkPermission) {
           if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        }
      }
    })
  }
}
