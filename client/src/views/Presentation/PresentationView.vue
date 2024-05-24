<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { onMounted, onUnmounted, ref } from "vue";
import axios from 'axios';
import NavbarDefault from "../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../examples/footers/FooterDefault.vue";
import Header from "../../examples/Header.vue";
import PresentationExample from "./Sections/PresentationExample.vue";
import vueMkHeader from "@/assets/img/vue-mk-header.jpg";

/**
 * Variable define
 */
const body = document.getElementsByTagName("body")[0];
const data = ref<any>([])

/**
 * Life circle vue js
 */
onMounted(async () => {
  body.classList.add("presentation-page");
  body.classList.add("bg-gray-200");
  await fetchData();
});
onUnmounted(() => {
  body.classList.remove("presentation-page");
  body.classList.remove("bg-gray-200");
});

/**
 * Function
 */
const fetchData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
    data.value = response && response.data ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
</script>

<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <NavbarDefault :sticky="true" />
      </div>
    </div>
  </div>
  <Header>
    <div class="page-header min-vh-75" :style="`background-image: url(${vueMkHeader})`" loading="lazy">
      <div class="container">
        <div class="row">
          <div class="col-lg-7 text-center mx-auto position-relative">
            <h1 class="text-white pt-3 mt-n5 me-2" :style="{ display: 'inline-block ' }">
              PharmaPro
            </h1>
            <p class="lead text-white px-5 mt-3" :style="{ fontWeight: '500' }">
              Discover Our Range of High-Quality Pharmaceuticals
            </p>
          </div>

        </div>
      </div>
    </div>
  </Header>

  <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6">
    <PresentationExample :data="data" />
  </div>
  <DefaultFooter />
</template>
