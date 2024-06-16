<script setup lang="ts">
/**
 * Dependencies injection library
 */
import axios from 'axios';
import { onMounted, ref } from "vue";
import BaseLayout from "../../layouts/sections/components/BaseLayout.vue";
import { useToast } from 'vue-toast-notification';
import DetailModal from './DetailView.vue'
import {
  View, List
} from '@element-plus/icons-vue'

/**
 * Variable define
 */
const toast = useToast();

// Computed properties
const detailRef = ref<any>(null);
const isLogged = ref<any>(false);
const dataGrid = ref<any>([]);
const isLoading = ref<any>(false);
const user_id = ref<any>('');
const status = ref<any>('Tất cả');
/**
 * Life circle vue js
 */
onMounted(async () => {
    isLogged.value = localStorage.getItem('isLogged') ?? false;
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) ?? {};
    if (userInfo && userInfo._id) {
        user_id.value = userInfo._id;
        await fetchData();
    }
});

/**
 * Function
 */
const fetchData = async () => {
    await axios.get(`${import.meta.env.VITE_API_URL}/users/${user_id.value}/orders`)
        .then((response) => {
            if (response.status === 200) {
                dataGrid.value = response.data.data
            }
        });
}

// onView
const onView = (item: any) => {
  detailRef.value.open("Chi tiết", item._id, false)
};

// onOrderDetail
const onOrderDetail = (item: any) => {
  detailRef.value.open("Đơn hàng chi tiết", item._id, true)
};

const cancelOrder = async (data: any) => {
    isLoading.value = true
    await axios.put(`${import.meta.env.VITE_API_URL}/orders/${data._id}/Hủy đơn`)
        .then(async (response) => {
            if (response.status === 200) {
                await fetchData();
            }
        });
    isLoading.value = false
}

</script>
<template>
    <BaseLayout :breadcrumb="[
        { label: 'Trang chủ', route: '/' },
        { label: 'Quản lí đơn hàng' },
    ]">
        <div class="container">
            <div class="justify-content-center m-0">
                <div class="mt-5 mb-5">
                    <div class="card">
                        <div class="card-header bg-dark" style="padding: 10px; background-color: #343a40">
                            <div class="card-header-flex">
                                <h4 class="text-white m-0" style="color: white; margin: 0px">ĐƠN HÀNG</h4>
                            </div>
                        </div>
                        <div class="card-body p-0" style="padding: 0px 30px 30px 30px">
                            <el-table v-if="isLogged" :data="dataGrid" style="width: 100%" :loading="isLoading">
                                <el-table-column prop="receiver" label="Tên người nhận" />
                                <el-table-column prop="created_at" label="Ngày mua" />
                                <el-table-column prop="status" label="Trạng thái" />
                                <el-table-column prop="total_price" label="Tổng giá" />
                                <el-table-column prop="note" label="Ghi chú" />
                                <el-table-column align="right">
                                    <template #default="scope">
                                        <el-popconfirm v-if="scope.row.status == 'Chờ xác nhận'" confirm-button-text="Có" width="auto" cancel-button-text="Không"
                                            :icon="InfoFilled" icon-color="#626AEF" title="Bạn muốn hủy đơn hàng?"
                                            @confirm="cancelOrder(scope.row)">
                                            <template #reference>
                                                <el-button size="small">
                                                    Hủy đơn
                                                </el-button>
                                            </template>
                                        </el-popconfirm>
                                        
                                        <el-button size="small" type="danger" @click="onOrderDetail(scope.row)" :icon="List" />
                                        
                                        <el-button size="small" type="success" @click="onView(scope.row)" :icon="View" />

                                    </template>
                                </el-table-column>
                            </el-table>
                            <h2 v-else>Vui lòng đăng nhập</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <detail-modal ref="detailRef"></detail-modal>
    </BaseLayout>
</template>
<style scoped>
.momo-radio.active {
    background-color: #fff0f6;
    border-color: #d82d8b;
}

.momo-radio {
    border: 1px solid #e8e8e8;
    border-radius: 0.8rem;
    cursor: pointer;
    height: 100%;
    overflow: hidden;
    position: relative;
}

.momo-radio {
    padding: 0.4rem 1rem;
    transition: background-color .25s cubic-bezier(.4, 0, .2, 1) 0ms, box-shadow .25s cubic-bezier(.4, 0, .2, 1) 0ms, border .25s cubic-bezier(.4, 0, .2, 1) 0ms;
}

.momo-radio .label {
    align-items: center;
    color: #303233;
    cursor: pointer;
    display: flex;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.43;
    margin-right: 1.2rem;
}

.momo-radio .label img {
    height: 2.5rem;
    margin-right: 0.5rem;
    object-fit: contain;
    width: 2.5rem;
}

.momo-radio input[type=radio] {
    background-color: #fff;
    border: 2px solid #303233;
    bottom: 0;
    cursor: pointer;
    margin: auto 0;
    position: absolute;
    right: 0.8rem;
    top: 0;
    transition: background-color .25s cubic-bezier(.4, 0, .2, 1) 0ms, box-shadow .25s cubic-bezier(.4, 0, .2, 1) 0ms, border .25s cubic-bezier(.4, 0, .2, 1) 0ms;
}

.card-header-flex {
    display: flex;
    justify-content: space-between;
}
</style>