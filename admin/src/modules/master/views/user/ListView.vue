<template>
  <div class="vc-page page-user">
    <!-- breadcrumb block-->
    <vc-row>
      <vc-col :md="12" class="align-center">
        <el-breadcrumb :separator-icon="'ArrowRight'">
          <el-breadcrumb-item :to="{ path: '/' }">Quản trị hệ thống</el-breadcrumb-item>
          <el-breadcrumb-item>
            Quản lý người dùng
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
            <vc-button type="warning" size="small" class="btn-acttion" @click="onView(data)" :icon="'View'"></vc-button>
            <vc-button type="primary" size="small" class="btn-acttion" @click="onEdit(data)" :icon="'Edit'"></vc-button>
            <vc-button type="danger" code="F00015" size="small" class="btn-acttion" @click="onDeleteItem(data)"
              :icon="'Delete'">
            </vc-button>
          </div>
        </template>
      </vc-table>
    </vc-card>
    <vc-confirm ref="confirmDialog"></vc-confirm>
    <detail-modal ref="detailRef" :type="popupType"></detail-modal>
  </div>
</template>

<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import DetailModal from './DetailModal.vue'
import { colConfig, tableConfig } from "@/commons/config/user.config";
import { useUserStore } from '@master/stores/user.store'
import { POPUP_TYPE } from "@/commons/const";
import userService from '@master/services/user.service';

/**
 * Life circle vue js
 */
const store = useUserStore()
const { dataGrid, pageConfig, search, loading } = storeToRefs(store);
const popupType = ref<POPUP_TYPE>(POPUP_TYPE.CREATE);
const confirmDialog = ref<any>(null);
const detailRef = ref<any>(null);

/**
 * Life circle vue js
 */
// onMounted function
onMounted(async () => {
  await onSearch();
});

/**
 * Function
 */
// onSearch
const onSearch = async () => {
  await store.getList()
}

const onPageChanged = async (page: any) => {
  pageConfig.value = { ...page };
  store.getList()
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

// onDeleteItem
const onDeleteItem = (item: any) => {
  confirmDialog.value.confirm(
    "Xác nhận xóa",
    "Bạn muốn xóa dữ liệu?",
    async (res: any) => {
      if (res) {
        await userService.delete(item._id);
        await onSearch()
      }
    }
  );
};

</script>

<style lang="scss">
.box-search {
  background-color: #fff;
  padding: 12px
}
</style>