<template>
    <vc-modal ref="modal" title="Danh sách sản phẩm trong kho" @close="close" width="80%">
        <template #content>
            <el-select class="mb-2" v-model="fillterSelect" @change="onChangeSelect" placeholder="Select" style="width: 240px">
                <el-option v-for="item in options" :key="item" :label="item" :value="item" />
            </el-select>
            <vc-button class="mb-2 ml-2" type="primary" :icon="'Plus'" @click="onAddNew">Thêm mới</vc-button>
            <vc-table :datas="dataGrid" :tableConfig="tableConfig" :colConfigs="colConfig" :page="pageConfig"
                :loading="loading" @dbClick="onEdit" @pageChanged="onPageChanged">
                <template #action="{ data }">
                    <div class="d-flex flex-center">
                        <vc-button type="warning" size="small" class="btn-acttion" @click="onView(data)"
                            :icon="'View'"></vc-button>
                        <vc-button type="primary" size="small" class="btn-acttion" @click="onEdit(data)"
                            :icon="'Edit'"></vc-button>
                        <vc-button type="danger" size="small" class="btn-acttion" @click="onDeleteItem(data)"
                            :icon="'Delete'"></vc-button>
                    </div>
                </template>
            </vc-table>
        </template>
    </vc-modal>
    <vc-confirm ref="confirmDialog"></vc-confirm>
    <detail-modal ref="detailRef" :type="popupType"></detail-modal>
</template>
<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { colConfig, tableConfig } from '@/commons/config/product.config'
import { useProductStore } from '@master/stores/product.store'
import DetailModal from '../product/DetailView.vue'
import { POPUP_TYPE } from "@/commons/const";
import productService from '@master/services/product.service';

/**
 * Life circle vue js
 */

/**
 * Variable define
 */
const pharmacyId = ref<any>('');
const fillterSelect = ref<any>('Tất cả');
const options = ref<any>(['Tất cả', 'Còn hàng', 'Hết hàng']);
const modal = ref<any>(null);
const store = useProductStore()
const {
    dataGrid,
    pageConfig,
    loading,
} = storeToRefs(store)
const popupType = ref<POPUP_TYPE>(POPUP_TYPE.CREATE);
const detailRef = ref<any>(null);
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

// onDeleteItem
const onDeleteItem = (item: any) => {
    confirmDialog.value.confirm(
        "Xác nhận xóa",
        "Bạn muốn xóa dữ liệu?",
        async (res: any) => {
            if (res) {
                await productService.delete(item);
                await onSearch()
            }
        }
    );
};

const open = async (pharmacy: any) => {
    pharmacyId.value = pharmacy._id;
    await store.getList(fillterSelect.value, pharmacyId.value)
    modal.value.open();
};

const onChangeSelect = async () => {
    await store.getList(fillterSelect.value, pharmacyId.value)
};

const close = () => {
    modal.value.close()
};

defineExpose({
    open,
    close,
});

</script>
