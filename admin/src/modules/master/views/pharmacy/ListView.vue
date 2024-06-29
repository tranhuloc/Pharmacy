<template>
  <div class="vc-page page-pharmacy-list">
    <!-- breadcrumb block-->
    <vc-row>
      <vc-col :md="12" class="align-center">
        <el-breadcrumb :separator-icon="'ArrowRight'">
          <el-breadcrumb-item :to="{ path: '/' }">Quản trị hệ thống</el-breadcrumb-item>
          <el-breadcrumb-item>
            Quản lý nhà thuốc
          </el-breadcrumb-item>
        </el-breadcrumb>
      </vc-col>
    </vc-row>
    <!-- header block-->
    <vc-card class="mt-4 mb-4">
      <vc-button type="primary" :icon="'Plus'" @click="onAddNew">Thêm mới</vc-button>
      <vc-row class="mt-4">
        <vc-col :span="5" class="mr-2">
          <vc-input placeholder="Nhập từ khóa tìm kiếm" v-model="search" />
        </vc-col>
        <vc-col :span="2">
          <vc-button type="primary" :icon="'Search'" @click="onSearch" />
        </vc-col>
      </vc-row>
    </vc-card>
    <!-- detail block-->
    <vc-card class="mt-4 mb-4">
      <vc-table :datas="dataGrid" :tableConfig="tableConfig" :colConfigs="colConfig" :page="pageConfig"
        :loading="loading" @dbClick="onEdit" @pageChanged="onPageChanged">
        <template #action="{ data }">
          <div class="d-flex flex-center">
            <el-tooltip class="box-item" effect="dark" content="Danh sách sản phẩm" placement="bottom">
              <vc-button type="success" size="small" class="btn-acttion" @click="onListProduct(data)" :icon="'Finished'"></vc-button>
            </el-tooltip>
            <vc-button type="warning" size="small" class="btn-acttion" @click="onView(data)" :icon="'View'"></vc-button>
            <vc-button type="primary" size="small" class="btn-acttion" @click="onEdit(data)" :icon="'Edit'"></vc-button>
            <vc-button type="danger" size="small" class="btn-acttion" @click="onDeleteItem(data)"
              :icon="'Delete'"></vc-button>
          </div>
        </template>
      </vc-table>
    </vc-card>
  </div>
  <vc-confirm ref="confirmDialog"></vc-confirm>
  <detail-modal ref="detailRef" :type="popupType"></detail-modal>
  <list-product-modal ref="listProductRef"></list-product-modal>
</template>
<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { colConfig, tableConfig } from '@/commons/config/pharmacy.config'
import { usePharmacyStore } from '@master/stores/pharmacy.store'
import { useRouter } from 'vue-router'
import DetailModal from './DetailView.vue'
import ListProductModal from './ListProductModal.vue'
import { POPUP_TYPE } from "@/commons/const";
import pharmacyService from '@master/services/pharmacy.service';

/**
 * Life circle vue js
 */
// onMounted function
onMounted(async () => {
  await store.getList()
})

/**
 * Variable define
 */
const store = usePharmacyStore()
const {
  dataGrid,
  pageConfig,
  loading,
  search,
} = storeToRefs(store)
const router = useRouter()
const projectList = ref<any>([])
const popupType = ref<POPUP_TYPE>(POPUP_TYPE.CREATE);
const detailRef = ref<any>(null);
const listProductRef = ref<any>(null);
const confirmDialog = ref<any>(null);

/**
 * Function
 */
// onSearch
const onSearch = async () => {
  await store.getList()
}

// onPageChanged
const onPageChanged = async (page: any) => {
  pageConfig.value = { ...page };
  onSearch()
};

// onAddNew
const onAddNew = () => {
  popupType.value = POPUP_TYPE.CREATE
  detailRef.value.open("Thêm mới", null, async (res: any) => {
    if (res) await onSearch()
  })
};

// onEdit
const onEdit = (item: any) => {
  popupType.value = POPUP_TYPE.EDIT;
  detailRef.value.open("Chỉnh sửa", item._id, async (res: any) => {
    if (res) await onSearch()
  })
};

// onView
const onView = (item: any) => {
  popupType.value = POPUP_TYPE.VIEW;
  detailRef.value.open("Chi tiết", item._id)
};

// onView
const onListProduct = (item: any) => {
  listProductRef.value.open(item)
};

// onDeleteItem
const onDeleteItem = (item: any) => {
  confirmDialog.value.confirm(
    "Xác nhận xóa",
    "Bạn muốn xóa dữ liệu?",
    async (res: any) => {
      if (res) {
        await pharmacyService.delete(item);
        await onSearch()
      }
    }
  );
};

</script>

<style>
.page-pharmacy-list .inline-flex-container {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}
</style>
