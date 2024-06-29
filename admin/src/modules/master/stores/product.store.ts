/**
 * Dependencies injection library
 */
import { defineStore } from 'pinia'
import productService from '@master/services/product.service'
import dateTime from "@/utils/dateTime";

export const useProductStore = defineStore('useProductStore', {
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
    // Get list product
    async getList(fillterSelect?: any, pharmacyId?: any) {
      this.loading = true
      await productService
        .getList({
          search: this.search,
          pageNumber: this.pageConfig.page ?? 1,
          pageSize: this.pageConfig.size ?? 10,
          fillterSelect: fillterSelect,
          pharmacyId: pharmacyId
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
