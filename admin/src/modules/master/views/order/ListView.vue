<template>
  <div class="vc-page page-order-list">
    <!-- breadcrumb block-->
    <vc-row>
      <vc-col :md="12" class="align-center">
        <el-breadcrumb :separator-icon="'ArrowRight'">
          <el-breadcrumb-item :to="{ path: '/' }">Quản trị hệ thống</el-breadcrumb-item>
          <el-breadcrumb-item>
            Quản lý đơn hàng
          </el-breadcrumb-item>
        </el-breadcrumb>
      </vc-col>
    </vc-row>
    <!-- header block-->
    <vc-card class="mt-4 mb-4">
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
        :loading="loading" @pageChanged="onPageChanged">
        <template #action="{ data }">
          <div class="d-flex flex-center">
            <vc-button type="warning" size="small" class="btn-acttion" @click="onView(data)" :icon="'View'"></vc-button>
            <vc-button type="success" size="small" class="btn-acttion" @click="onOrderDetail(data)" :icon="'List'"></vc-button>
            <vc-button type="danger" size="small" class="btn-acttion" @click="onDeleteItem(data)"
              :icon="'Delete'"></vc-button>
          </div>
        </template>
      </vc-table>
    </vc-card>
  </div>
  <vc-confirm ref="confirmDialog"></vc-confirm>
  <detail-modal ref="detailRef"></detail-modal>
</template>
<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { colConfig, tableConfig } from '@/commons/config/order.config'
import { useOrderStore } from '@master/stores/order.store'
import DetailModal from './DetailView.vue'
import orderService from '@master/services/order.service';

/**
 * Variable define
 */
const store = useOrderStore()
const {
  dataGrid,
  pageConfig,
  loading,
  search,
} = storeToRefs(store)
const detailRef = ref<any>(null);
const confirmDialog = ref<any>(null);

/**
 * Life circle vue js
 */
// onMounted function
onMounted(async () => {
  await store.getList()
})

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

// onView
const onView = (item: any) => {
  detailRef.value.open("Chi tiết", item._id, false)
};

// onOrderDetail
const onOrderDetail = (item: any) => {
  detailRef.value.open("Đơn hàng chi tiết", item._id, true)
};

// onDeleteItem
const onDeleteItem = (item: any) => {
  confirmDialog.value.confirm(
    "Xác nhận xóa",
    "Bạn muốn xóa dữ liệu?",
    async (res: any) => {
      if (res) {
        await orderService.delete(item);
        await onSearch()
      }
    }
  );
};

</script>

<style>
.page-order-list .inline-flex-container {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}
</style>
