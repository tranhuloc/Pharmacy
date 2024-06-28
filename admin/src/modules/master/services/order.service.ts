/**
 * Dependencies injection library
 */
import apiClient from '@/utils/httpClient'
import type { APIResponse } from '@/interfaces/response.interface'
import { useToastStore } from '@/stores/toast.store'
import { API } from '@/commons/config/order.config'

const orderService = {
  /**
  * Function
  */
  // Get list order
  async getList(status: any, params?: unknown): Promise<APIResponse<any[]>> {
    return await apiClient.get(API.ORDER(status), {
      params: params,
    })
  },

  // Get detail
  async detail(_id: string): Promise<APIResponse<any>> {
    return await apiClient.get(API.DETAIL(_id))
  },

  // Get order detail
  async order_detail(_id: string): Promise<APIResponse<any>> {
    return await apiClient.get(API.ORDER_DETAIL(_id))
  },

  // Create order
  async create(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .post(API.CREATE, data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Update order
  async update(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .put(API.UPDATE(data._id), data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // change status order
  async changeStatus(_id: any, status: any) {
    const toastStore = useToastStore()
    return await apiClient
      .put(API.CHANGE_STATUS(_id, status))
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Delete order
  async delete(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .delete(API.DELETE(data._id))
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },
   // getStatistical
  async getStatistical(params?: unknown): Promise<APIResponse<any[]>> {
    return await apiClient.post(API.STATISTICAL, params)
  },
}

export default orderService
