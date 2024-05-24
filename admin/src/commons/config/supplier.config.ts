export const FUNC_NAME = 'suppliers'
// ========================== ROUTER =============================
export const ROUTER_SUPPLIER = [
  {
    path: '/supplier',
    name: 'SupplierList',
    component: () => import('@master/views/supplier/ListView.vue')
  },
]

// ========================== PATH API =============================
export const API = {
  SUPPLIER: `/${FUNC_NAME}`,
  CREATE: `/${FUNC_NAME}`,
  DETAIL: (id: string) => `${FUNC_NAME}/${id}`,
  UPDATE: (id: string) => `${FUNC_NAME}/${id}`,
  DELETE: (id: string) => `${FUNC_NAME}/${id}`,
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
    key: 'supplier_name',
    title: "Tên nhà cung cấp"
  },
  {
    key: 'contact_info',
    title: "Thông tin liên hệ"
  },
  {
    key: 'created_at',
    title: "Ngày tạo"
  },
]

export default { tableConfig, colConfig }