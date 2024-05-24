import apiClient from '@/utils/httpClient'
import type {
  AuthRequestLogin,
  AuthResponse,
  AuthChangePassword,
  AuthInfoUserResponse
} from '@auth/interfaces/auth.interface'
import { useToastStore } from '@/stores/toast.store'
import { COOKIE_KEY } from '@/commons/const'
import { API } from '@/commons/config/auth.config'

const authService = {
  async signIn(data: AuthRequestLogin): Promise<AuthResponse> {
    return await apiClient.post(API.SIGN_IN, data)
  },

  async getInfo(): Promise<AuthInfoUserResponse> {
    return await apiClient.get(API.GET_INFO)
  },
  async clearLocalStorage() {
    localStorage.removeItem(COOKIE_KEY.ACCESS_TOKEN)
    localStorage.removeItem(COOKIE_KEY.REFRESH_TOKEN)
    localStorage.removeItem(COOKIE_KEY.AUTH_INFO)
  },
  async updateLocalStorage(data: AuthResponse) {
    localStorage.setItem(COOKIE_KEY.ACCESS_TOKEN, data.token)
    localStorage.setItem(COOKIE_KEY.REFRESH_TOKEN, data.refresh_token)
  },
  async updateLocalStorageAuthInfo(info: AuthInfoUserResponse) {
    localStorage.setItem(COOKIE_KEY.AUTH_INFO, JSON.stringify(info))
  },
  async updateCookies(data: AuthResponse) {
    document.cookie = `${COOKIE_KEY.ACCESS_TOKEN}=${data.token}; ${COOKIE_KEY.REFRESH_TOKEN}=${data.refresh_token}`;
  },
  async clearCookies() {
    document.cookie = '';
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
