<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { onMounted } from "vue";
import setTooltip from "@/assets/js/tooltip";
import { useAppStore } from "@/stores";

/**
 * Variable define
 */
const store = useAppStore();

defineProps({
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
    default: "",
  },
  packaging: {
    type: String,
    default: "",
  },
  price: {
    type: String,
    default: "",
  },
});

/**
 * Life circle vue js
 */
onMounted(() => {
  setTooltip(store.bootstrap);
});

/**
 * Function
 */
const getImageUrl = (url: any) => {
  return `${import.meta.env.VITE_SERVER_URL}${url}`;
};

</script>

<template>
  <RouterLink :to="{ name: 'page-detail', params: { id: _id } }" :product_name="product_name">
    <div class="card move-on-hover" v-bind="$attrs">
      <img class="w-100" :src="getImageUrl(url_image)" :alt="product_name" loading="lazy" />
      <div class="mt-2 ms-2">
        <h6 class="mb-0 text-truncate">{{ product_name }}</h6>
        <b class="text-primary">{{ price }}</b>
        <p class="text-secondary text-sm font-weight-normal">
          {{ packaging }}
        </p>
      </div>
      <div class="mt-2 text-center">
        <button class="btn btn-sm bg-gradient-success">Thêm vào giỏ hàng</button>
        <button class="btn btn-sm bg-gradient-secondary ms-2">Mua ngay</button>
      </div>
    </div>
  </RouterLink>
</template>
