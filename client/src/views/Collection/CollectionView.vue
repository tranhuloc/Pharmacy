<script setup lang="ts">
/**
 * Dependencies injection library
 */
import axios from "axios";
import { onMounted, watch, ref } from "vue";
import BaseLayout from "../../layouts/sections/components/BaseLayout.vue";
import LeftView from "./Components/LeftView.vue";
import RightView from "./Components/RightView.vue";
import { useRoute } from "vue-router";

/**
 * Variable define
 */
const route = useRoute();
const data = ref<any>([]);
const orderby = ref<any>("manual");
const collectionName = ref(route.params.name);

/**
 * Life circle vue js
 */
onMounted(async () => {
    await fetchData();
});

// Cập nhật collectionName khi route thay đổi
watch(
    () => route.params.name,
    newName => {
        if (route.name == "page-collection") {
            collectionName.value = newName;
            fetchData();
        }
    }
);
/**
 * Function
 */
const fetchData = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/subcategories/${
                collectionName.value
            }/${orderby}/products`
        );
        data.value = response && response.data ? response.data.data : [];
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
const handleOrderByChange = async event => {
    const selectedValue = event.target.value;
    orderby.value = selectedValue;
    await fetchData();
};
</script>
<template>
    <BaseLayout
        :title="collectionName"
        :breadcrumb="[
            { label: 'Trang chủ', route: '/' },
            { label: collectionName },
        ]">
        <div class="container mt-sm-3 mt-3" style="padding: 0">
            <div class="row">
                <div class="col-lg-3">
                    <LeftView />
                </div>
                <div class="col-lg-9">
                    <div class="mb-2">
                        <div
                            style="
                                display: flex;
                                justify-content: space-between;
                            ">
                            <h4 style="margin: 0">Danh sách sản phẩm</h4>
                            <div>
                                <div
                                    class="input-group input-group-outline"
                                    style="display: flex; align-items: center">
                                    <label style="margin: 0"
                                        >Sắp xếp theo</label
                                    >
                                    <select
                                        class="ms-2 form-control"
                                        @change="handleOrderByChange($event)">
                                        <option value="manual">Mới nhất</option>
                                        <option value="price-ascending">
                                            Giá tăng dần
                                        </option>
                                        <option value="price-descending">
                                            Giá giảm dần
                                        </option>
                                        <option value="title-ascending">
                                            Từ A-Z
                                        </option>
                                        <option value="title-descending">
                                            Từ Z-A
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <RightView :data="data" />
                </div>
            </div>
        </div>
    </BaseLayout>
</template>
