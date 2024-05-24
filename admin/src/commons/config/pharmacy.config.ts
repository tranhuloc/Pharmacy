export const FUNC_NAME = 'pharmacies'
// ========================== ROUTER =============================
export const ROUTER_PHARMACY = [
  {
    path: '/pharmacy',
    name: 'PharmacyList',
    component: () => import('@master/views/pharmacy/ListView.vue')
  },
]

// ========================== PATH API =============================
export const API = {
  PHARMACY: `/${FUNC_NAME}`,
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
    key: 'pharmacy_name',
    title: "Tên nhà thuốc"
  },
  {
    key: 'address',
    title: "Địa chỉ"
  },
  {
    key: 'created_at',
    title: "Ngày tạo"
  },
]

export default { tableConfig, colConfig }