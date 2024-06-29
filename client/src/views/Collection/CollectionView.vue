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
const from_price = ref<any>(null);
const to_price = ref<any>(null);
const list_suppliers = ref<any>([]);
const collectionName = ref(route.params.collection_name);
const keywordSearch = ref(route.params.keyword_search);
const supplierName = ref(route.params.supplier_name);
const activeIngredient = ref(route.params.active_ingredient);
const pharmacyName = ref(route.params.pharmacy_name);
const pharmacyId = ref(route.params.pharmacy_id);

/**
 * Life circle vue js
 */
onMounted(async () => {
    await fetchData();
});

// Cập nhật collectionName khi route thay đổi
watch(
    () => route.params,
    newName => {
        switch (route.name) {
            case "page-collection":
                resetValues();
                collectionName.value = newName.collection_name;
                break;
            case "page-search":
                resetValues();
                keywordSearch.value = newName.keyword_search;
                break;
            case "page-search-options":
                resetValues();
                supplierName.value = newName.supplier_name;
                activeIngredient.value = newName.active_ingredient;
                break;
            case "page-product-pharmacy":
                resetValues();
                pharmacyId.value = newName.pharmacy_id;
                pharmacyName.value = newName.pharmacy_name;
                break;
            default:
                return;
        }
        fetchData();
    }
);

/**
 * Function to reset all search values
 */
const resetValues = () => {
    supplierName.value = null;
    activeIngredient.value = null;
    keywordSearch.value = null;
    collectionName.value = null;
    pharmacyId.value = null;
    pharmacyName.value = null;
};

/**
 * Function to fetch data based on route and search parameters
 */
const fetchData = async () => {
    data.value = [];
    try {
        let response;
        if (route.name === "page-collection") {
            response = await axios.get(
                `${import.meta.env.VITE_API_URL}/subcategories/products`,
                {
                    params: {
                        subcategory_name: collectionName.value,
                        order_by: orderby.value,
                        from_price: from_price.value,
                        to_price: to_price.value,
                        list_suppliers: list_suppliers.value,
                    },
                }
            );
        } else if (
            route.name === "page-search" ||
            route.name === "page-search-options" ||
            route.name === "page-product-pharmacy"
        ) {
            response = await axios.get(
                `${import.meta.env.VITE_API_URL}/search`,
                {
                    params: {
                        keyword: keywordSearch.value,
                        supplier_name: supplierName.value,
                        active_ingredient: activeIngredient.value,
                        order_by: orderby.value,
                        from_price: from_price.value,
                        to_price: to_price.value,
                        list_suppliers: list_suppliers.value,
                        pharmacy_id: pharmacyId.value,
                    },
                }
            );
        }
        data.value = response?.data?.data || [];
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const handleOrderByChange = async event => {
    const selectedValue = event.target.value;
    orderby.value = selectedValue;
    await fetchData();
};

const setCondition = async (fromPrice: any, toPrice: any, suppliers: any) => {
    from_price.value = fromPrice;
    to_price.value = toPrice;
    list_suppliers.value = suppliers;
    await fetchData();
};
</script>
<template>
    <BaseLayout
        :title="
            collectionName
                ? collectionName
                : pharmacyName
                ? pharmacyName
                : 'Kết quả tìm kiếm'
        "
        :breadcrumb="[
            { label: 'Trang chủ', route: '/' },
            {
                label: collectionName
                    ? collectionName
                    : pharmacyName
                    ? pharmacyName
                    : 'Tìm kiếm',
            },
        ]">
        <div class="container mt-sm-3 mt-3" style="padding: 0">
            <div class="row">
                <div class="col-lg-3">
                    <LeftView @setCondition="setCondition" />
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
