/**
 * Dependencies injection library
 */
import { defineStore } from 'pinia'
import supplierService from '@master/services/supplier.service'
import dateTime from "@/utils/dateTime";

export const useSupplierStore = defineStore('useSupplierStore', {
  state: () => ({
    dataGrid: <any>[],
    formData: <any>{},
    pageConfig: <any>[],
    loading: <any>[],
    search: ''
  }),
  actions: {
    /**
    * Action
    */
    // Get list supplier
    async getList() {
      this.loading = true
      await supplierService
        .getList({
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
