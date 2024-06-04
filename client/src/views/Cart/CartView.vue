<script setup lang="ts">
/**
 * Dependencies injection library
 */
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import BaseLayout from "../../layouts/sections/components/BaseLayout.vue";
import { useStore } from 'vuex';

/**
 * Variable define
 */
const receiver = ref<any>('');
const phone = ref<any>('');
const address = ref<any>('');
// Access the store
const store = useStore();

// Computed properties
const cart = computed(() => store.state.cart);
const cartTotalQty = computed(() => store.state.cartTotalQty);
const cartTotalAmount = computed(() => store.state.cartTotalAmount);

/**
 * Life circle vue js
 */
onMounted(() => {

});

computed
/**
 * Function
 */
const updateToCart = (payload) => store.commit('updateToCart', payload);

const onRegister = async () => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/users`);
        data.value = response && response.data ? response.data.data : {};

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
</script>
<template>
    <BaseLayout :title="product_name" :breadcrumb="[
        { label: 'Trang chủ', route: '/' },
        { label: 'Giỏ hàng' },
    ]">
        <div class="sec_row container">
            <div class="justify-content-center m-0">
                <div class="mt-5 mb-5">
                    <div class="card">
                        <div class="card-header bg-dark" style="padding: 10px; background-color: #343a40">
                            <div class="card-header-flex">
                                <h4 class="text-white m-0" style="color: white; margin: 0px">Giỏ hàng {{ cart.length > 0
                                    ?
                                    `(${cart.length})` : '' }}</h4>
                                <button v-if="cart.length > 0" @click="emptyCart" class="btn btn-danger mt-0 btn-sm">
                                    <i class="fa fa-trash-alt mr-2"></i>
                                    <span>Làm trống giỏ hàng</span>
                                </button>
                            </div>
                        </div>
                        <div class="card-body p-0" style="padding: 0px 30px 30px 30px">
                            <table v-if="cart.length === 0" class="table cart-table mb-0">
                                <tbody>
                                    <tr>
                                        <td colspan="6">
                                            <div class="cart-empty" style="text-align: center;">
                                                <i class="fa fa-shopping-cart"></i>
                                                <p>Giỏ hàng trống</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table v-else class="table cart-table mb-0">
                                <thead>
                                    <tr>
                                        <th>Xóa</th>
                                        <th>Hình ảnh</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Kích thước</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th class="text-right"><span id="amount" class="amount">Tổng giá</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(data, index) in cart" :key="index">
                                        <td><button class="prdct-delete" @click="removeFromCart(index, data.id)"><i
                                                    class="fa fa-trash"></i></button></td>
                                        <td>
                                            <div class="product-img">
                                                <img :src="API_URL + data.image" :alt="data.name"
                                                    style="width: 100px" />
                                            </div>
                                        </td>
                                        <td>
                                            <div class="product-name">
                                                <p>{{ data.name }}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <p>{{ data.size }}</p>
                                        </td>
                                        <td>{{ formattedPrice(data.price) }}</td>
                                        <td>
                                            <div class="prdct-qty-container">
                                                <button class="prdct-qty-btn" type="button"
                                                    @click="decreaseQuantity(index, data.id)">
                                                    <i class="fa fa-minus"></i>
                                                </button>
                                                <input type="text" name="qty" class="qty-input-box" :value="data.qty"
                                                    disabled />
                                                <button class="prdct-qty-btn" type="button"
                                                    @click="increaseQuantity(index, data.id)">
                                                    <i class="fa fa-plus"></i>
                                                </button>
                                            </div>
                                        </td>
                                        <td class="text-right">{{ formattedPrice(data.qty * data.price) }}</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>&nbsp;</th>
                                        <th colspan="4">&nbsp;</th>
                                        <th>Tổng<span class="ml-2 mr-2">:</span><span class="text-danger"> {{
                                            cartTotalQty
                                                }}</span></th>
                                        <th class="text-right"><span class="text-danger">{{
                                            formattedPrice(cartTotalAmount)
                                                }}</span></th>
                                    </tr>
                                </tfoot>
                            </table>
                            <div v-if="isLoggedIn && cart.length !== 0" class="col-md-3">
                                <div class="form-group">
                                    <label>Tên người nhận <b style="color: red">*</b></label>
                                    <input type="tel" class="form-control" v-model="receiver" />
                                </div>
                                <div class="form-group">
                                    <label>Số điện thoại <b style="color: red">*</b></label>
                                    <input type="tel" class="form-control" v-model="phone" />
                                </div>
                                <div class="form-group">
                                    <label>Địa chỉ <b style="color: red">*</b></label>
                                    <textarea class="form-control" v-model="address" />
                                </div>
                                <div class="form-group">
                                    <label>Ghi chú</label>
                                    <textarea class="form-control" v-model="note" />
                                </div>
                                <div class="form-group momo-radio active">
                                    <label class="label">
                                        <img src="assets/images/icon_financement.png" alt="captureWallet" class="image">
                                        <div style="overflow:hidden">
                                            <div class="label-title" style="white-space:nowrap">Thanh toán sau</div>
                                        </div>
                                        <input id="captureWallet" type="radio" value="paymentafter"
                                            v-model="selectedPaymentMethod">
                                    </label>
                                </div>
                                <div class="form-group momo-radio active">
                                    <label class="label">
                                        <img src="assets/images/logo-momo.png" alt="captureWallet" class="image">
                                        <div style="overflow:hidden">
                                            <div class="label-title" style="white-space:nowrap">Ví MoMo</div>
                                        </div>
                                        <input id="captureWallet" type="radio" value="paymentmomo"
                                            v-model="selectedPaymentMethod">
                                    </label>
                                </div>
                                <div class="form-group">
                                    <button class="btn btn-success mt-2" @click="checkout">Đặt hàng</button>
                                </div>
                            </div>
                            <a v-if="!isLoggedIn && cart.length !== 0" href="/login" class="btn btn-success">Đăng nhập
                                trước
                                khi đặt
                                hàng</a>
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
</style>