<script setup lang="ts">
/**
 * Dependencies injection library
 */
import axios from 'axios';
import { RouterLink, useRouter } from "vue-router";
import { ref, watch, onMounted, computed, reactive } from "vue";
import { useWindowsWidth } from "../../assets/js/useWindowsWidth";
import ArrDark from "@/assets/img/down-arrow-dark.svg";
import DownArrWhite from "@/assets/img/down-arrow-white.svg";
import { ShoppingCart } from '@element-plus/icons-vue'
import { useStore } from 'vuex';
import downArrow from "@/assets/img/down-arrow.svg";
import {
  Search,
  Operation,
  LocationInformation
} from '@element-plus/icons-vue'
import { useToast } from 'vue-toast-notification';
import { GoogleMap, Marker, MarkerCluster, InfoWindow } from "vue3-google-map";

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

const keywordSearch = ref<any>('')
const supplierName = ref<any>('')
const activeIngredient = ref<any>('')
const dialogVisible = ref(false)
const dialogMapVisible = ref(false)
const toast = useToast();

const GOOGLE_MAPS_API_KEY = "AIzaSyDa6fUGWZAlcemboXTlwhZf7pzuciNZIeU";
const zoom = ref<any>(10);
const center = ref<any>({ lat: 0, lng: 0 });
const locations = ref<any>([]);

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

const onSearch = async () => {
  try {
    if (keywordSearch.value) {
      router.push({
        name: 'page-search',
        params: {
          keyword_search: keywordSearch.value
        }
      })
      clearConditionSearch();
    }
  } catch (error) {
    console.log(error);
  }
}

const onSearchDetail = async () => {
  try {
    if (activeIngredient.value || supplierName.value) {
      router.push({
        name: 'page-search-options',
        params: {
          supplier_name: supplierName.value,
          active_ingredient: activeIngredient.value
        }
      })
      togglePopup();
    }
  } catch (error) {
    console.log(error);
  }
}
const clearConditionSearch = () => {
  keywordSearch.value = ''
  supplierName.value = ''
  activeIngredient.value = ''
}

const togglePopup = () => {
  dialogVisible.value = !dialogVisible.value
  clearConditionSearch();
}

const togglePopupMap = () => {
  dialogMapVisible.value = !dialogMapVisible.value
}

const onShowPopupMap = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/pharmacies`);
  const results = response.data.data;  
  const array = results.map((item: any) => {
    return {
      '_id': item._id,
      'pharmacy_name': item.pharmacy_name,
      'lat': item.latitude,
      'lng': item.longitude,
    }
  })
  locations.value = [...array];

  if (array.length > 0) {
    center.value = { lat: array[0].lat, lng: array[0].lng };
  }
  else center.value = { lat: 10.03366542137865, lng: 105.7551331565387 };
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        center.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      },
      (error) => {
        console.error('Error getting location: ', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
  dialogMapVisible.value = true;
}

const infoWindowContent = (location: any) => {
  const googleMapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;

  return `
    <div>
      <p><b>${location.pharmacy_name}</b></p>
      <p>Latitude: ${location.lat}</p>
      <p>Longitude: ${location.lng}</p>
      <p><a class='mb-2' href="/product-pharmacy/${location.pharmacy_name}?pharmacy_id=${location._id}">Sản phẩm tại nhà thuốc</a></p>
      <a href="${googleMapsLink}" target="_blank">View on Google Maps</a>
    </div>
  `;
}

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
        <div>
          <el-input style="width: 360px; margin-right: 10px;" placeholder="Nhập tên sản phẩm" clearable
            v-model="keywordSearch" />
          <el-button type="primary" :icon="Search" @click="onSearch">Tìm kiếm</el-button>
          <el-button type="info" :icon="Operation" @click="togglePopup">Chi tiết</el-button>
          <el-button type="success" :icon="LocationInformation" @click="onShowPopupMap">Nhà thuốc gần bạn</el-button>
        </div>
        <ul class="navbar-nav navbar-nav-hover ms-auto">
          <li class="nav-item dropdown dropdown-hover mx-2">
            <a role="button" class="nav-link ps-2 d-flex cursor-pointer align-items-center" :class="getTextColor()"
              id="dropdownMenuCategory" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="material-icons opacity-6 me-2 text-md" :class="getTextColor()">dashboard</i>
              Danh mục
              <img :src="getArrowColor()" alt="down-arrow" class="arrow ms-2 d-lg-block d-none" />
              <img :src="getArrowColor()" alt="down-arrow" class="arrow ms-1 d-lg-none d-block ms-auto" />
            </a>
            <div
              class="dropdown-menu dropdown-menu-end dropdown-menu-animation dropdown-md dropdown-md-responsive p-3 border-radius-lg mt-0 mt-lg-3"
              aria-labelledby="dropdownMenuBlocks">
              <div class="d-none d-lg-block">
                <ul class="list-group">
                  <li v-for="item in data"
                    class="nav-item dropdown dropdown-hover dropdown-subitem list-group-item border-0 p-0">
                    <a class="dropdown-item py-2 ps-3 border-radius-md" href="javascript:;">
                      <div class="d-flex">
                        <div class="w-100 d-flex align-items-center justify-content-between">
                          <div>
                            <h6
                              class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0">
                              {{ item.category.category_name }}
                            </h6>
                          </div>
                          <img :src="downArrow" alt="down-arrow" class="arrow" />
                        </div>
                      </div>
                    </a>
                    <div class="dropdown-menu mt-0 py-3 px-2 mt-3">
                      <RouterLink
                        :to="{ name: 'page-collection', params: { collection_name: subcategory.subcategory_name } }"
                        v-for="subcategory in item.subcategories" class="dropdown-item ps-3 border-radius-md mb-1">
                        {{ subcategory.subcategory_name }}
                      </RouterLink>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="row d-lg-none">
                <div v-for="item in data" class="col-md-12">
                  <div class="d-flex mb-2">
                    <div class="w-100 d-flex align-items-center justify-content-between">
                      <div>
                        <h6
                          class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0">
                          {{ item.category.category_name }}
                        </h6>
                      </div>
                    </div>
                  </div>
                  <RouterLink
                    :to="{ name: 'page-collection', params: { collection_name: subcategory.subcategory_name } }"
                    v-for="subcategory in item.subcategories" class="dropdown-item ps-3 border-radius-md mb-1">
                    {{ subcategory.subcategory_name }}
                  </RouterLink>
                </div>
              </div>
            </div>
          </li>
          <li v-if="isLogged" class="nav-item dropdown dropdown-hover mx-2">
            <a role="button" class="nav-link ps-2 d-flex cursor-pointer align-items-center" :class="getTextColor()"
              id="dropdownAccount" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="material-icons opacity-6 me-2 text-md" :class="getTextColor()">person</i>
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
                      <RouterLink to="/purchase"
                        class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-1">
                        Quản lí đơn hàng
                      </RouterLink>
                      <RouterLink to="/profile"
                        class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-1">
                        Tài khoản của bạn
                      </RouterLink>
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
                <RouterLink to="/purchase"
                  class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-1">
                  Quản lí đơn hàng
                </RouterLink>
                <RouterLink to="/profile"
                  class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-1">
                  Tài khoản của bạn
                </RouterLink>
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
  <el-dialog v-model="dialogVisible" title="Tìm kiếm nâng cao" align-top :close="togglePopup">
    <el-form label-position="top">
      <el-form-item prop="supplier_name" label="Nhà cung cấp">
        <el-input v-model="supplierName" placeholder="Nhà cung cấp sản phẩm" />
      </el-form-item>
      <el-form-item prop="active_ingredient" label="Hoạt chất">
        <el-input v-model="activeIngredient" placeholder="Hoạt chất sản phẩm" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="onSearchDetail">
          Tìm kiếm
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogMapVisible" title="Nhà thuốc gần bạn" align-top :close="togglePopupMap" width="80%">
    <GoogleMap :api-key="GOOGLE_MAPS_API_KEY" style="width: 100%; height: 500px" :center="center" :zoom="zoom"
      @click="handleMapClick">
      <Marker :options="{ position: center }" />
      <MarkerCluster>
        <Marker v-for="(location, i) in locations" :options="{ position: location }" :key="i">
          <InfoWindow :options="{ position: location, content: infoWindowContent(location) }" />
        </Marker>
      </MarkerCluster>
    </GoogleMap>
  </el-dialog>
  <vue3-confirm-dialog />
  <!-- End Navbar -->
</template>
