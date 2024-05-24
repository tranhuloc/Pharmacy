/**
 * Dependencies injection library
 */
import { defineStore } from 'pinia'
import userService from '@master/services/user.service'

export const useUserStore = defineStore('useUserStore', {
  state: () => ({
    dataGrid: <any>[],
    formData: <any>{},
    search: <any>[],
    pageConfig: <any>[],
    loading: <any>[],
  }),
  actions: {
    /**
    * Action
    */
    // Get list user
    async getList() {
      this.loading = true
      await userService
        .getList({
          search: this.search,
          ...this.pageConfig,
        })
        .then((data) => {
          this.dataGrid = data.data ?? []
          this.pageConfig.total = data.total
        })
        .finally(() => {
          this.loading = false
        })
    },
    async getDetail(id: any) : Promise<any> {
      this.loading = true
      let data : any
      await userService.detail(id)
          .then((response) => {
              data = response?.data
          })
          .finally(() => {
              this.loading = false
          })
      return data
    },

    async delete(data: any) {
      await userService.delete(data.id).then(() => {
        this.getList()
      })
    },

    async getByKey(key: any) {
      this.loading = true
      await userService
        .detail(key)
        .then((data) => {
          this.formData = data.data ?? {}
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
})
