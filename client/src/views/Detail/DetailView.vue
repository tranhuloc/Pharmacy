<script setup lang="ts">
/**
 * Dependencies injection library
 */
import axios from 'axios';
import { useRoute } from 'vue-router';
import { ref, watch, onMounted } from "vue";
import ProductCard from "../Presentation/Components/ProductCard.vue";
import BaseLayout from "../../layouts/sections/components/BaseLayout.vue";

/**
 * Variable define
 */
const route = useRoute();
const data = ref<any>({});
const product_id = ref(route.params.id);
const product_name = ref('');

/**
 * Life circle vue js
 */
onMounted(async () => {
    await fetchData();
});

/**
 * Function
 */
const fetchData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/${product_id.value}`);
        data.value = response && response.data ? response.data.data : {};
        if (data.value.product_name) {
            product_name.value = data.value.product_name;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const getImageUrl = (url: any) => {
    return `${import.meta.env.VITE_SERVER_URL}${url}`;
};

</script>
<template>
    <BaseLayout :title="product_name" :breadcrumb="[
        { label: 'Trang chủ', route: '/' },
        { label: product_name },
    ]">
        <div class="container mt-sm-3 mt-3">
            <div class="row mb-4">
                <div class="col-md-5">
                    <div class="card">
                        <el-carousel :interval="4000" type="card" class="m-4">
                            <el-carousel-item v-for="item in data.images" :key="item._id">
                                <img :src="getImageUrl(item.image_url)" loading="lazy" />
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </div>
                <div class="col-md-7">
                    <div class="card">
                        <div class="m-4">
                            <div class="main-description px-2">
                                <div class="category text-bold">
                                    <h3>
                                        {{ data.product_name ?? '' }}
                                    </h3>
                                </div>
                                <div class="my-3 text-bold">
                                    Thương hiệu: {{ data.trademark ?? '' }}
                                </div>
                                <div class="price-area my-4">
                                    <b class="text-primary">{{ data.price ?? '' }}</b>
                                    <p class="mt-2">
                                        Giá đã bao gồm thuế. Phí vận chuyển và các chi phí khác (nếu có) sẽ được thể
                                        hiện khi đặt hàng</p>
                                    <i>Đã bán 1.5k</i>
                                </div>
                                <div style="border-top: solid; border-width: 1px;">
                                    <div class="row mt-2" v-if="data.subcategory_name">
                                        <div class="col-md-3">
                                            <b>Danh mục</b>
                                        </div>
                                        <div class="col-md-9">
                                            <p>{{ data.subcategory_name }}</p>
                                        </div>
                                    </div>
                                    <div class="row" v-if="data.active_ingredient">
                                        <div class="col-md-3">
                                            <b>Hoạt chất</b>
                                        </div>
                                        <div class="col-md-9">
                                            <p>{{ data.active_ingredient }}</p>
                                        </div>
                                    </div>
                                    <div class="row" v-if="data.indications">
                                        <div class="col-md-3">
                                            <b>Chỉ định</b>
                                        </div>
                                        <div class="col-md-9">
                                            <p>{{ data.indications }}</p>
                                        </div>
                                    </div>
                                    <div class="row" v-if="data.dosage_form">
                                        <div class="col-md-3">
                                            <b>Dạng bào chế</b>
                                        </div>
                                        <div class="col-md-9">
                                            <p>{{ data.dosage_form }}</p>
                                        </div>
                                    </div>
                                    <div class="row" v-if="data.manufacturer">
                                        <div class="col-md-3">
                                            <b>Nơi sản xuất</b>
                                        </div>
                                        <div class="col-md-9">
                                            <p>{{ data.manufacturer }}</p>
                                        </div>
                                    </div>
                                    <div class="row" v-if="data.packaging">
                                        <div class="col-md-3">
                                            <b>Quy cách</b>
                                        </div>
                                        <div class="col-md-9">
                                            <p>{{ data.packaging }}</p>
                                        </div>
                                    </div>
                                    <div class="row" v-if="data.note">
                                        <div class="col-md-3">
                                            <b>Lưu ý</b>
                                        </div>
                                        <div class="col-md-9">
                                            <p>{{ data.note }}</p>
                                        </div>
                                    </div>
                                    <div class="buttons d-flex my-5">
                                        <button class="btn btn-sm bg-gradient-success">Thêm vào giỏ hàng</button>
                                        <button class="btn btn-sm bg-gradient-secondary ms-2">Mua ngay</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="border-top: solid; border-width: 1px;">
            <h3 class="mt-2">Sản phẩm liên quan</h3>
        </div>
        <div class="container mt-sm-3 mt-3 card">

        </div>
    </BaseLayout>
</template>
<style scoped>
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>