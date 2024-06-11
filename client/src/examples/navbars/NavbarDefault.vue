<script setup lang="ts">
/**
 * Dependencies injection library
 */
import axios from 'axios';
import { RouterLink, useRouter } from "vue-router";
import { ref, watch, onMounted, computed } from "vue";
import { useWindowsWidth } from "../../assets/js/useWindowsWidth";
import ArrDark from "@/assets/img/down-arrow-dark.svg";
import DownArrWhite from "@/assets/img/down-arrow-white.svg";
import { ShoppingCart } from '@element-plus/icons-vue'
import { useStore } from 'vuex';

/**
 * Variable define
 */
const data = ref<any>([])
const props = defineProps({
  action: {
    type: Object,
    route: String,
    color: String,
    label: String,
  },
  transparent: {
    type: Boolean,
    default: false
  },
  light: {
    type: Boolean,
    default: false
  },
  dark: {
    type: Boolean,
    default: false
  },
  sticky: {
    type: Boolean,
    default: false
  },
  darkText: {
    type: Boolean,
    default: false
  }
});
const isLogged = ref<any>(false);
const userInfo = ref<any>({});
const router = useRouter()
const store = useStore();
const count = computed(() => store.state.cartTotalQty);

// set nav color on mobile && desktop

let textDark = ref(props.darkText);
const { type } = useWindowsWidth();

if (type.value === "mobile") {
  textDark.value = true;
} else if (type.value === "desktop" && textDark.value == false) {
  textDark.value = false;
}

/**
 * Life circle vue js
 */
onMounted(async () => {
  isLogged.value = localStorage.getItem('isLogged') ?? false;
  userInfo.value = JSON.parse(localStorage.getItem('userInfo')) ?? {};

  await fetchData();
});

watch(
  () => type.value,
  (newValue) => {
    if (newValue === "mobile") {
      textDark.value = true;
    } else {
      textDark.value = false;
    }
  }
);
/**
 * Function
 */
const fetchData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories-with-subcategories`);
    data.value = response && response.data ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
// set arrow  color
const getArrowColor = () => {
  if (props.transparent && textDark.value) {
    return ArrDark;
  } else if (props.transparent) {
    return DownArrWhite;
  } else {
    return ArrDark;
  }
}

// set text color
const getTextColor = () => {
  let color;
  if (props.transparent && textDark.value) {
    color = "text-dark";
  } else if (props.transparent) {
    color = "text-white";
  } else {
    color = "text-dark";
  }

  return color;
};

const handleLogout = async () => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('roleName');
  localStorage.removeItem('isLogged');
  router.push({
    name: 'page-signin',
  })
};

</script>
<template>
  <nav class="navbar navbar-expand-lg top-0" :class="{
    'z-index-3 w-100 shadow-none navbar-transparent position-absolute my-3':
      props.transparent,
    'my-3 blur border-radius-lg z-index-3 py-2 shadow py-2 start-0 end-0 mx-4 position-absolute mt-4':
      props.sticky,
    'navbar-light bg-white py-3': props.light,
    ' navbar-dark bg-gradient-dark z-index-3 py-3': props.dark
  }">
    <div :class="props.transparent || props.light || props.dark
      ? 'container'
      : 'container-fluid px-0'
      ">
      <RouterLink class="navbar-brand d-none d-md-block" :class="[
        (props.transparent && textDark.value) || !props.transparent
          ? 'text-dark font-weight-bolder ms-sm-3'
          : 'text-white font-weight-bolder ms-sm-3'
      ]" :to="{ name: 'Home' }" rel="tooltip" title="Designed and Coded by Creative Tim" data-placement="bottom">
        MDS
      </RouterLink>
      <RouterLink class="navbar-brand d-block d-md-none" :class="props.transparent || props.dark
        ? 'text-white'
        : 'font-weight-bolder ms-sm-3'
        " to="/" rel="tooltip" title="Designed and Coded by Creative Tim" data-placement="bottom">
        MDS
      </RouterLink>
      <RouterLink v-if="!isLogged" to="/login" class="btn btn-sm bg-gradient-success mb-0 ms-auto d-lg-none d-block">
        ĐĂNG NHẬP</RouterLink>
      <button class="navbar-toggler shadow-none ms-2" type="button" data-bs-toggle="collapse"
        data-bs-target="#navigation" aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon mt-2">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>
      <div class="collapse navbar-collapse w-100 pt-3 pb-2 py-lg-0" id="navigation">
        <ul class="navbar-nav navbar-nav-hover ms-auto">
          <li class="nav-item dropdown dropdown-hover mx-2">
            <a role="button" class="nav-link ps-2 d-flex cursor-pointer align-items-center" :class="getTextColor()"
              id="dropdownMenuCategory" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="material-icons opacity-6 me-2 text-md" :class="getTextColor()">dashboard</i>
              Danh mục
              <img :src="getArrowColor()" alt="down-arrow" class="arrow ms-2 d-lg-block d-none" />
              <img :src="getArrowColor()" alt="down-arrow" class="arrow ms-1 d-lg-none d-block ms-auto" />
            </a>
            <div class="dropdown-menu dropdown-menu-animation ms-n3 dropdown-md p-3 border-radius-xl mt-0 mt-lg-3"
              aria-labelledby="dropdownMenuCategory">
              <div class="row d-none d-lg-block">
                <div class="col-12 px-4 py-2">
                  <div class="row">
                    <div class="position-relative">
                      <div v-for="item in data">
                        <div class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-1">
                          {{ item.category.category_name }}
                        </div>
                        <RouterLink v-for="subcategory in item.subcategories"
                          :to="{ name: 'page-collection', params: { name: subcategory.subcategory_name } }"
                          class="dropdown-item border-radius-md">
                          <span>{{ subcategory.subcategory_name }}</span>
                        </RouterLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-lg-none">
                <div v-for="item in data">
                  <div class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-1">
                    {{ item.category.category_name }}
                  </div>
                  <RouterLink v-for="subcategory in item.subcategories"
                    :to="{ name: 'page-collection', params: { name: subcategory.subcategory_name } }"
                    class="dropdown-item border-radius-md">
                    <span>{{ subcategory.subcategory_name }}</span>
                  </RouterLink>
                </div>
              </div>
            </div>
          </li>
          <li v-if="isLogged" class="nav-item dropdown dropdown-hover mx-2">
            <a role="button" class="nav-link ps-2 d-flex cursor-pointer align-items-center" :class="getTextColor()"
              id="dropdownAccount" data-bs-toggle="dropdown" aria-expanded="false">
              {{ userInfo.fullname }}
            </a>
            <div class="dropdown-menu dropdown-menu-animation ms-n3 dropdown-md p-3 border-radius-xl mt-0 mt-lg-3"
              aria-labelledby="dropdownAccount">
              <div class="row d-none d-lg-block">
                <div class="col-12 px-4 py-2">
                  <div class="row">
                    <div class="position-relative">
                      <el-popconfirm confirm-button-text="Có" cancel-button-text="Không" :icon="InfoFilled"
                        icon-color="#626AEF" title="Bạn muốn đăng xuất?" @confirm="handleLogout">
                        <template #reference>
                          <div class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-1">
                            Đăng xuất
                          </div>
                        </template>
                      </el-popconfirm>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-lg-none">
                <el-popconfirm confirm-button-text="Có" cancel-button-text="Không" :icon="InfoFilled"
                  icon-color="#626AEF" title="Bạn muốn đăng xuất?" @confirm="handleLogout">
                  <template #reference>
                    <div class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-1">
                      Đăng xuất
                    </div>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </li>
          <li class="nav-item dropdown dropdown-hover mx-2">
            <el-badge :value="count" class="item">
              <RouterLink to="/cart">
                <el-button :icon="ShoppingCart" type="success" circle />
              </RouterLink>
            </el-badge>
          </li>
        </ul>
        <ul class="navbar-nav d-lg-block d-none">
          <li class="nav-item">
            <RouterLink v-if="!isLogged" to="/login" class="btn btn-sm bg-gradient-success mb-0">
              ĐĂNG NHẬP</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <vue3-confirm-dialog />
  <!-- End Navbar -->
</template>
