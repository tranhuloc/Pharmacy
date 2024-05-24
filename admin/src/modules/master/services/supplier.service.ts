/**
 * Dependencies injection library
 */
import apiClient from '@/utils/httpClient'
import type { APIResponse } from '@/interfaces/response.interface'
import { useToastStore } from '@/stores/toast.store'
import { API } from '@/commons/config/supplier.config'

const supplierService = {
  /**
  * Function
  */
  // Get list supplier
  async getList(params?: unknown): Promise<APIResponse<any[]>> {
    return await apiClient.get(API.SUPPLIER, {
      params: params,
    })
  },

  // Get detail
  async detail(_id: string): Promise<APIResponse<any>> {
    return await apiClient.get(API.DETAIL(_id))
  },

  // Create supplier
  async create(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .post(API.CREATE, data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Update supplier
  async update(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .put(API.UPDATE(data._id), data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Delete supplier
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

export default supplierService
