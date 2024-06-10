<script setup lang="ts">
/**
 * Dependencies injection library
 */
import axios from 'axios';
import { onMounted, ref } from "vue";
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import Header from "@/examples/Header.vue";
import { RouterLink, useRouter } from "vue-router";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialSwitch from "@/components/MaterialSwitch.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import setMaterialInput from "@/assets/js/material-input";
import { useToast } from 'vue-toast-notification';

/**
 * Variable define
 */
const email = ref<any>('');
const password = ref<any>('');
const router = useRouter()
const toast = useToast();

/**
 * Life circle vue js
 */
onMounted(() => {
  setMaterialInput();
});

/**
 * Function
 */
const onLogin = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
      email: email.value,
      password: password.value,
    });
    if (response.status == 200) {
      const data = response.data.data
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      localStorage.setItem('roleName', data.role_name)
      localStorage.setItem('isLogged', true)
      router.push({
        name: 'Home',
      })
      toast.success("Đăng nhập thành công");
    }
    else toast.error("Đăng nhập không thành công");
  } catch (error) {
    toast.error(error.response.data.message);
  }
}
</script>
<template>
  <DefaultNavbar transparent />
  <Header>
    <div class="page-header align-items-start min-vh-100" :style="{
      backgroundImage:
        'url(https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80)'
    }" loading="lazy">
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container my-auto">
        <div class="row">
          <div class="col-lg-4 col-md-8 col-12 mx-auto">
            <div class="card z-index-0 fadeIn3 fadeInBottom">
              <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div class="bg-gradient-success shadow-success border-radius-lg py-3 pe-1">
                  <h4 class="text-white font-weight-bolder text-center mt-2 mb-0">
                    Đăng nhập
                  </h4>
                  <div class="row mt-3">
                    <div class="col-2 text-center ms-auto">
                      <a class="btn btn-link px-3" href="javascript:;">
                        <i class="fa fa-facebook text-white text-lg"></i>
                      </a>
                    </div>
                    <div class="col-2 text-center px-1">
                      <a class="btn btn-link px-3" href="javascript:;">
                        <i class="fa fa-github text-white text-lg"></i>
                      </a>
                    </div>
                    <div class="col-2 text-center me-auto">
                      <a class="btn btn-link px-3" href="javascript:;">
                        <i class="fa fa-google text-white text-lg"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <MaterialInput id="email" class="input-group-outline my-3" v-model="email"
                  :label="{ text: 'Email', class: 'form-label' }" type="email" />
                <MaterialInput id="password" class="input-group-outline mb-3" v-model="password"
                  :label="{ text: 'Password', class: 'form-label' }" type="password" />
                <MaterialSwitch class="d-flex align-items-center mb-3" id="rememberMe" labelClass="mb-0 ms-3" checked>
                  Ghi nhớ</MaterialSwitch>

                <div class="text-center">
                  <MaterialButton class="my-4 mb-2" variant="gradient" color="success" fullWidth @click="onLogin">Đăng
                    nhập
                  </MaterialButton>
                </div>
                <p class="mt-4 text-sm text-center">
                  Không có tài khoản?
                  <RouterLink to="/register" class="text-success text-gradient font-weight-bold">Đăng kí</RouterLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Header>
</template>
