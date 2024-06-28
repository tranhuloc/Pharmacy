export const FUNC_NAME = 'orders'
// ========================== ROUTER =============================
export const ROUTER_ORDER = [
  {
    path: '/order',
    name: 'OrderList',
    component: () => import('@master/views/order/ListView.vue')
  },
]

// ========================== PATH API =============================
export const API = {
  ORDER: (status: string) => `/${FUNC_NAME}/${status}`,
  CREATE: `/${FUNC_NAME}`,
  DETAIL: (id: string) => `${FUNC_NAME}/${id}/order_by_id`,
  ORDER_DETAIL: (id: string) => `${FUNC_NAME}/${id}/items`,
  CHANGE_STATUS: (id: string, status: string) => `${FUNC_NAME}/${id}/${status}`,
  UPDATE: (id: string) => `${FUNC_NAME}/${id}`,
  DELETE: (id: string) => `${FUNC_NAME}/${id}`,
  STATISTICAL: `/revenues/get-revenue`,
}

// ========================== CONFIG TABLE ==========================
export const tableConfig = {
  checkbox: false,
  action: true,
  index: true,
  showPaging: true,
  dbClick: false
}

export const colConfig = [
  {
    key: 'receiver',
    title: "Tên người nhận"
  },
  {
    key: 'created_at',
    title: "Ngày mua"
  },
  {
    key: 'status',
    title: "Trạng thái"
  },
  {
    key: 'total_price',
    title: "Tổng tiền"
  },
  {
    key: 'note',
    title: "Ghi chú"
  },
]

export default { tableConfig, colConfig }