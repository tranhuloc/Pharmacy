import { SCREEN_CODE } from '@/commons/const'

export default [
  {
    routerName: 'Dashboard',
    path: '/',
    text: 'Trang chủ',
    icon: 'HomeFilled',
  },
  {
    routerName: 'ManageUser',
    path: '/user',
    text: 'Quản lí người dùng',
    icon: 'UserFilled',
  },
  {
    routerName: 'ManageCategory',
    path: '/category',
    text: 'Quản lí danh mục',
    icon: 'Menu',
  },
  {
    routerName: 'ManageSubCategory',
    path: '/subcategory',
    text: 'Quản lí danh mục con',
    icon: 'Grid',
  },
  {
    routerName: 'ManageSupplier',
    path: '/supplier',
    text: 'Quản lí nhà cung cấp',
    icon: 'OfficeBuilding',
  },
  {
    routerName: 'ManageProduct',
    path: '/product',
    text: 'Quản lí sản phẩm',
    icon: 'Box',
  },
  {
    routerName: 'ManagePharmacy',
    path: '/pharmacy',
    text: 'Quản lí nhà thuốc',
    icon: 'Box',
  }
]
