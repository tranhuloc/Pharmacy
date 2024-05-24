<script setup>
import ProductCard from "../../Presentation/Components/ProductCard.vue";
import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";

defineProps({
    data: {
        type: Array,
        required: true,
        _id: {
            type: String,
            required: true,
        },
        url_image: {
            type: String,
            required: true,
        },
        product_name: {
            type: String,
            required: true,
        },
        packaging: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
    },
});

</script>
<template>
    <div class="card">
        <div class="row pb-4" style="border-width: 1px;">
            <div class="col-lg-12">
                <div class="row mx-1">
                    <div class="col-md-3 mt-md-0" v-for="item in data" :key="item._id">
                        <ProductCard class="min-height-160 shadow-lg mt-4" :_id="item._id" :url_image="item.url_image"
                            :product_name="item.product_name" :packaging="item.packaging" :price="item.price" />
                    </div>
                </div>
            </div>
        </div>
        <div class="mx-2">
            <MaterialPagination>
                <MaterialPaginationItem prev class="ms-auto" />
                <MaterialPaginationItem label="1" />
                <MaterialPaginationItem label="2" active />
                <MaterialPaginationItem label="3" />
                <MaterialPaginationItem label="4" />
                <MaterialPaginationItem label="5" />
                <MaterialPaginationItem next />
            </MaterialPagination>
        </div>
    </div>
</template>
