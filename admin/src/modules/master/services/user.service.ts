import apiClient from '@/utils/httpClient'
import type { APIResponse } from '@/interfaces/response.interface'
import { useToastStore } from '@/stores/toast.store'
import { API } from '@/commons/config/user.config'

const userService = {
  async getList(params?: unknown): Promise<any> {
    return await apiClient.get(API.LIST, {
      params: params,
    })
  },

  async getListRole(): Promise<any> {
    return await apiClient.get(API.LIST_ROLE)
  },

  async detail(_id: string): Promise<APIResponse<any>> {
    return await apiClient.get(API.DETAIL(_id))
  },

  async create(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .post(API.CREATE, data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  async update(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .put(API.UPDATE(data._id || ''), data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  async delete(_id: string) {
    const toastStore = useToastStore()
    return await apiClient
      .delete(API.DELETE(_id))
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },
}

export default userService
