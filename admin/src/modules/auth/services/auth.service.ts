import apiClient from '@/utils/httpClient'
import type {
  AuthRequestLogin,
  AuthResponse,
  AuthChangePassword,
  AuthInfoUserResponse
} from '@auth/interfaces/auth.interface'
import { useToastStore } from '@/stores/toast.store'
import { API } from '@/commons/config/auth.config'

const authService = {
  async signIn(data: AuthRequestLogin): Promise<AuthResponse> {
    return await apiClient.post(API.SIGN_IN, data)
  },

  async getInfo(): Promise<AuthInfoUserResponse> {
    return await apiClient.get(API.GET_INFO)
  },
  async changePassword(data: AuthChangePassword) {
    const toastStore = useToastStore()
    return await apiClient
      .put(API.CHANGE_PASSWORD, data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },
}

export default authService
