export const FUNC_NAME = 'products'
// ========================== ROUTER =============================
export const ROUTER_PRODUCT = [
  {
    path: '/product',
    name: 'ProductList',
    component: () => import('@master/views/product/ListView.vue')
  },
]

// ========================== PATH API =============================
export const API = {
  PRODUCT: `/${FUNC_NAME}`,
  CREATE: `/${FUNC_NAME}`,
  DETAIL: (id: string) => `${FUNC_NAME}/${id}`,
  UPDATE: (id: string) => `${FUNC_NAME}/${id}`,
  DELETE: (id: string) => `${FUNC_NAME}/${id}`,
  DELETE_IMAGE: (id: string) => `images/${id}`,
  LIST_IMAGE: (id: string) => `${FUNC_NAME}/${id}/images`,
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
    key: 'product_name',
    title: "Tên sản phẩm"
  },
  {
    key: 'subcategory_name',
    title: "Tên danh mục"
  },
  {
    key: 'supplier_name',
    title: "Tên nhà cung cấp"
  },
  {
    key: 'price',
    title: "Giá"
  },
  {
    key: 'stock_quantity',
    title: "Số lượng"
  },
  {
    key: 'created_at',
    title: "Ngày tạo"
  },
]

export default { tableConfig, colConfig }