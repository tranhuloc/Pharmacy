<script setup lang="ts">
/**
 * Dependencies injection library
 */
import axios from 'axios';
import { onMounted, ref, computed, reactive } from "vue";
import BaseLayout from "../../layouts/sections/components/BaseLayout.vue";
import { useStore } from 'vuex';
import { DeleteFilled, Plus, Minus } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { RouterLink } from "vue-router";
import { useToast } from 'vue-toast-notification';

/**
 * Variable define
 */
// Access the store
const store = useStore();
const toast = useToast();

// Computed properties
const cart = computed(() => store.state.cart);
const cartTotalQty = computed(() => store.state.cartTotalQty);
const cartTotalAmount = computed(() => store.state.cartTotalAmount);
const isLogged = ref<any>(false);
const formRef = ref<FormInstance>()
const validateForm = reactive({
    receiver: '',
    phone: '',
    address: '',
    note: '',
})

/**
 * Life circle vue js
 */
onMounted(() => {
    isLogged.value = localStorage.getItem('isLogged') ?? false;
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) ?? {};
    if (userInfo) {
        validateForm.receiver = userInfo.fullname
        validateForm.phone = userInfo.fullname
        validateForm.address = userInfo.address
    }
});

/**
 * Function
 */
const getImageUrl = (url: any) => {
    return `${import.meta.env.VITE_SERVER_URL}${url}`;
};

const increaseQuantity = (i: any, id: any) => {
    cart.value.map((data, o) => {
        if (i === o) {
            const storedData = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') ?? "") : [];
            const itemIndex = storedData.findIndex(item => item.id == id);

            if (itemIndex !== -1) {
                storedData[itemIndex].qty = data.qty + 1;
                localStorage.setItem('cart', JSON.stringify(storedData));
                return {
                    ...data,
                    qty: data.qty + 1
                };
            }
        }
        return data;
    });
    store.commit('updateToCart')
};

const decreaseQuantity = (i: any, id: any) => {
    cart.value.map((data, o) => {
        if (i === o) {
            if (data.qty > 1) {
                const storedData = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') ?? "") : [];
                const itemIndex = storedData.findIndex(item => item.id == id);

                if (itemIndex !== -1) {
                    storedData[itemIndex].qty = data.qty - 1;
                    localStorage.setItem('cart', JSON.stringify(storedData));
                }
                return { ...data, qty: data.qty - 1 };
            } else {
                return data;
            }
        }
        return data;
    });
    store.commit('updateToCart')
};

const removeFromCart = (i: any, id: any) => {
    const storedData = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') ?? "") : [];
    const itemIndexToRemove = storedData.findIndex(item => item.id == id);

    if (itemIndexToRemove !== -1) {
        storedData.splice(itemIndexToRemove, 1);
    }

    localStorage.setItem('cart', JSON.stringify(storedData));
    toast.success("Xóa sản phẩm khỏi giỏ hàng thành công");
    store.commit('updateToCart')
};

const emptyCart = () => {
    cart.value = [];
    localStorage.removeItem('cart');
    store.commit('updateToCart')
};

</script>
<template>
    <BaseLayout :title="product_name" :breadcrumb="[
        { label: 'Trang chủ', route: '/' },
        { label: 'Giỏ hàng' },
    ]">
        <div class="container">
            <div class="justify-content-center m-0">
                <div class="mt-5 mb-5">
                    <div class="card">
                        <div class="card-header bg-dark" style="padding: 10px; background-color: #343a40">
                            <div class="card-header-flex">
                                <h4 class="text-white m-0" style="color: white; margin: 0px">Giỏ hàng {{ cart.length > 0
                                    ?
                                    `(${cart.length})` : '' }}</h4>
                                <el-popconfirm v-if="cart.length > 0" confirm-button-text="Có" width="auto"
                                    cancel-button-text="Không" :icon="InfoFilled" icon-color="#626AEF"
                                    title="Bạn muốn làm trống giỏ hàng?" @confirm="emptyCart">
                                    <template #reference>
                                        <el-button :icon="DeleteFilled" type="danger" plain>Làm trống giỏ
                                            hàng</el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </div>
                        <div class="card-body p-0" style="padding: 0px 30px 30px 30px">
                            <el-table :data="cart" style="width: 100%">
                                <el-table-column prop="name" label="Tên sản phẩm" />
                                <el-table-column label="Hình ảnh">
                                    <template #default="scope">
                                        <img :src="getImageUrl(scope.row.image)" :alt="scope.row.name"
                                            style="width: 100px" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="price" label="Giá" />
                                <el-table-column label="Số lượng">
                                    <template #default="scope">
                                        <div style="display: flex">
                                            <el-button type="primary" :icon="Minus"
                                                @click="decreaseQuantity(scope.$index, scope.row.id)" />
                                            <el-input :value="scope.row.qty" style="width: 50px;" />
                                            <el-button type="primary" :icon="Plus"
                                                @click="increaseQuantity(scope.$index, scope.row.id)" />
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Tổng giá">
                                    <template #default="scope">
                                        {{ scope.row.qty * scope.row.price }}
                                    </template>
                                </el-table-column>
                                <el-table-column width="100">
                                    <template #default="scope">
                                        <el-popconfirm v-if="cart.length > 0" confirm-button-text="Có" width="auto"
                                            cancel-button-text="Không" :icon="InfoFilled" icon-color="#626AEF"
                                            title="Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng của mình không?"
                                            @confirm="removeFromCart(scope.$index, scope.row.id)">
                                            <template #reference>
                                                <el-button :icon="DeleteFilled" type="danger" />
                                            </template>
                                        </el-popconfirm>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <p style="margin: 10px;">Tổng: <b style="color: red;">{{ cartTotalAmount }}</b></p>
                            <el-form v-if="isLogged && cart.length !== 0" ref="formRef" :label-position="right"
                                style="max-width: 600px; margin: 10px;" :model="validateForm" label-width="auto">
                                <el-form-item label="Tên người nhận" prop="receiver" :rules="[
                                    { required: true, message: 'Vui lòng nhập tên người nhận' },
                                ]">
                                    <el-input v-model="validateForm.receiver" type="text" autocomplete="off" />
                                </el-form-item>
                                <el-form-item label="Số điện thoại" prop="phone" :rules="[
                                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                                ]">
                                    <el-input v-model="validateForm.phone" type="tel" autocomplete="off" />
                                </el-form-item>
                                <el-form-item label="Địa chỉ" prop="address" :rules="[
                                    { required: true, message: 'Vui lòng nhập địa chỉ' },
                                ]">
                                    <el-input v-model="validateForm.address" type="textarea" autocomplete="off" />
                                </el-form-item>
                                <el-form-item label="Ghi chú" prop="note">
                                    <el-input v-model="validateForm.note" type="text" autocomplete="off" />
                                </el-form-item>
                                <el-form-item style="float: right;">
                                    <el-button type="primary" @click="submitForm(formRef)">Đặt hàng</el-button>
                                </el-form-item>
                            </el-form>
                            <RouterLink v-if="!isLogged && cart.length !== 0" to="/login"
                                class="btn btn-sm bg-gradient-success mb-0">
                                Đăng nhập trước khi đặt hàng
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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