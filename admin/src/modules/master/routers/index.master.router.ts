import { ROUTER_USER } from '@/commons/config/user.config'
import { ROUTER_CATEGORY } from '@/commons/config/category.config'
import { ROUTER_SUBCATEGORY } from '@/commons/config/subcategory.config'
import { ROUTER_SUPPLIER } from '@/commons/config/supplier.config'
import { ROUTER_PRODUCT } from '@/commons/config/product.config'
import { ROUTER_PHARMACY } from '@/commons/config/pharmacy.config'

export default [
  ...ROUTER_USER,
  ...ROUTER_CATEGORY,
  ...ROUTER_SUBCATEGORY,
  ...ROUTER_SUPPLIER,
  ...ROUTER_PRODUCT,
  ...ROUTER_PHARMACY,
]
