<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { onMounted } from "vue";
import setTooltip from "@/assets/js/tooltip";
import { useAppStore } from "@/stores";
import { useStore } from 'vuex';
import { useToast } from 'vue-toast-notification';
import { RouterLink, useRouter } from "vue-router";

/**
 * Variable define
 */
const store = useAppStore();
const storeVuex = useStore();
const toast = useToast();
const router = useRouter()

const props = defineProps({
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

const addToCart = () => {
  // Lấy giỏ hàng từ localStorage hoặc tạo một giỏ hàng mới nếu chưa tồn tại
  let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') ?? "") : [];

  // Tìm xem sản phẩm đã tồn tại trong giỏ hàng chưa
  const existingItem = cart.find(item => item.name === props.product_name);

  if (existingItem) {
    existingItem.qty++;
  } else {
    const newItem = {
      id: cart.length + 1,
      image: props.url_image,
      product_id: props._id,
      name: props.product_name,
      price: props.price,
      qty: 1,
    };
    cart.push(newItem);
  }

  // Lưu giỏ hàng vào localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Cập nhật số lượng sản phẩm trong giỏ hàng (nếu cần)
  const storedCount = localStorage.getItem('count');
  let parsedCount = parseInt(storedCount ?? "", 10);

  if (!isNaN(parsedCount)) {
    parsedCount++;
    localStorage.setItem('count', parsedCount.toString());
  } else {
    localStorage.setItem('count', "1");
  }

  storeVuex.commit('updateToCart')
  toast.success('Thêm sản phẩm vào giỏ hàng thành công');
};

const buyNow = () => {
  addToCart();
  router.push({
    name: 'page-cart',
  })
};

</script>

<template>
  <div class="card move-on-hover" v-bind="$attrs">
    <img class="w-100" :src="getImageUrl(props.url_image)" :alt="props.product_name" loading="lazy" />
    <div class="mt-2 ms-2">
      <RouterLink :to="{ name: 'page-detail', params: { id: props._id } }" :product_name="props.product_name">
        <h6 class="mb-0 text-truncate">{{ props.product_name }}</h6>
      </RouterLink>
      <b class="text-primary">{{ props.price }}</b>
      <p class="text-secondary text-sm font-weight-normal">
        {{ props.packaging }}
      </p>
    </div>
    <div class="mt-2 text-center">
      <button class="btn btn-sm bg-gradient-success" @click="addToCart">Thêm vào giỏ hàng</button>
      <button class="btn btn-sm bg-gradient-secondary ms-2" @click="buyNow">Mua ngay</button>
    </div>
  </div>
</template>
