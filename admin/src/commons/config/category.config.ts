export const FUNC_NAME = 'categories'
// ========================== ROUTER =============================
export const ROUTER_CATEGORY = [
  {
    path: '/category',
    name: 'CategoryList',
    component: () => import('@master/views/category/ListView.vue')
  },
]

// ========================== PATH API =============================
export const API = {
  CATEGORY: `/${FUNC_NAME}`,
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
    key: 'category_name',
    title: "Tên danh mục"
  },
  {
    key: 'created_at',
    title: "Ngày tạo"
  },
]

export default { tableConfig, colConfig }