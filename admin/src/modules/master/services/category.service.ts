/**
 * Dependencies injection library
 */
import apiClient from '@/utils/httpClient'
import type { APIResponse } from '@/interfaces/response.interface'
import { useToastStore } from '@/stores/toast.store'
import { API } from '@/commons/config/category.config'

const categoryService = {
  /**
  * Function
  */
  // Get list category
  async getList(params?: unknown): Promise<APIResponse<any[]>> {
    return await apiClient.get(API.CATEGORY, {
      params: params,
    })
  },

  // Get detail
  async detail(_id: string): Promise<APIResponse<any>> {
    return await apiClient.get(API.DETAIL(_id))
  },

  // Create category
  async create(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .post(API.CREATE, data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Update category
  async update(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .put(API.UPDATE(data._id), data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Delete category
  async delete(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .delete(API.DELETE(data._id))
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },
}

export default categoryService
