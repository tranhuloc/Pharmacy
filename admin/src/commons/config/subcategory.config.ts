export const FUNC_NAME = 'subcategories'
// ========================== ROUTER =============================
export const ROUTER_SUBCATEGORY = [
  {
    path: '/subcategory',
    name: 'SubCategoryList',
    component: () => import('@master/views/subcategory/ListView.vue')
  },
]

// ========================== PATH API =============================
export const API = {
  SUBCATEGORY: `/${FUNC_NAME}`,
  CREATE: `/${FUNC_NAME}`,
  DETAIL: (id: string) => `${FUNC_NAME}/getById/${id}`,
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
    title: "Tên danh mục cha"
  },
  {
    key: 'subcategory_name',
    title: "Tên danh mục con"
  },
  {
    key: 'created_at',
    title: "Ngày tạo"
  },
]

export default { tableConfig, colConfig }