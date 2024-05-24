/**
 * Dependencies injection library
 */
import apiClient from '@/utils/httpClient'
import type { APIResponse } from '@/interfaces/response.interface'
import { useToastStore } from '@/stores/toast.store'
import { API } from '@/commons/config/product.config'

const productService = {
  /**
  * Function
  */
  // Get list product
  async getList(params?: unknown): Promise<APIResponse<any[]>> {
    return await apiClient.get(API.PRODUCT, {
      params: params,
    })
  },
  
  // Get list image
  async getListImage(_id: string): Promise<APIResponse<any[]>> {
    return await apiClient.get(API.LIST_IMAGE(_id))
  },

  // Get detail
  async detail(_id: string): Promise<APIResponse<any>> {
    return await apiClient.get(API.DETAIL(_id))
  },

  // Create product
  async create(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .post(API.CREATE, data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Update product
  async update(_id: any, data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .put(API.UPDATE(_id), data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Delete product
  async delete(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .delete(API.DELETE(data._id))
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Delete image
  async deleteImage(_id: any) {
    const toastStore = useToastStore()
    return await apiClient
      .delete(API.DELETE_IMAGE(_id))
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },
}

export default productService
