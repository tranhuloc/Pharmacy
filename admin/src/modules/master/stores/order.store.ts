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
    status: 'Tất cả',
    dateRange: [
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    ],
    chartData: <any>{
      labels: <any>[],
      datasets: [
        {
          label: 'Doanh thu bán hàng',
          backgroundColor: '#205995',
          data: <any>[]
        }
      ]
    }
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
    async getStatistical() {
      this.loading = true

      await orderService
        .getStatistical({
          startDate: this.dateRange[0],
          endDate: this.dateRange[1],
        })
        .then((data: any) => {          
          const result = data.data ?? []
          this.chartData = {
            labels: result.labels,
            datasets: [
              {
                label: 'Doanh thu bán hàng',
                backgroundColor: '#205995',
                data: result.datasets
              }
            ]
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
})
