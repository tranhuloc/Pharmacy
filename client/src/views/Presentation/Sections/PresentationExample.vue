<script setup>
import ProductCard from "../Components/ProductCard.vue";

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
  <section class="my-5 py-5">
    <div class="container">
      <div class="row">
        <div class="row justify-content-center text-center my-sm-5">
          <div class="col-lg-6">
            <h2 class="text-dark mb-0">SẢN PHẨM</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="container mt-sm-5 mt-3">
      <div class="row">
        <div class="col-lg-12">
          <div class="row">
            <div class="col-md-3 mt-md-0" v-for="item in data" :key="item._id">
              <ProductCard class="min-height-160 shadow-lg mt-4" :_id="item._id" :url_image="item.url_image"
                :product_name="item.product_name" :packaging="item.packaging" :price="item.price" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
