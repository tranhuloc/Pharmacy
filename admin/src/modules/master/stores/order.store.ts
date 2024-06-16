/**
 * Dependencies injection library
 */
import { defineStore } from 'pinia'
import orderService from '@master/services/order.service'
import dateTime from "@/utils/dateTime";

export const useOrderStore = defineStore('useOrderStore', {
  state: () => ({
    dataGrid: <any>[],
    formData: <any>{},
    pageConfig: <any>[],
    loading: <any>[],
    search: '',
    status: 'Tất cả'
  }),
  actions: {
    /**
    * Action
    */
    // Get list order
    async getList() {
      this.loading = true
      await orderService
        .getList(this.status, {
          search: this.search,
          pageNumber: this.pageConfig.page ?? 1,
          pageSize: this.pageConfig.size ?? 10
        })
        .then((data: any) => {
          this.dataGrid = data.data ?? []
          this.dataGrid = this.dataGrid.map((item: any) => {
            if (item.created_at) {
              const formatted = dateTime.formatDateTimeNew(
                item.created_at
              );
              item.created_at = formatted;
            }
            return item;
          });
          this.loading = false
        })
    },
  },
})
