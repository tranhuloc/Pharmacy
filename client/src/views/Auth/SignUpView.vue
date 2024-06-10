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
import MaterialButton from "@/components/MaterialButton.vue";
import setMaterialInput from "@/assets/js/material-input";
import { useToast } from 'vue-toast-notification';

/**
 * Variable define
 */
const email = ref<any>('');
const password = ref<any>('');
const fullname = ref<any>('');
const phone = ref<any>('');
const address = ref<any>('');
const confirm_password = ref<any>('');
const toast = useToast();
const router = useRouter()

/**
 * Life circle vue js
 */
onMounted(() => {
  setMaterialInput();
});

/**
 * Function
 */
const onRegister = async () => {
  try {
    if (password.value != confirm_password.value) {
      toast.error("Mật khẩu xác nhận không đúng");
      return;
    }
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
      email: email.value,
      password: password.value,
      fullname: fullname.value,
      phone: phone.value,
      address: address.value,
    });
    if (response.status == 200) {
      router.push({
        name: 'page-signin',
      })
    }

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
                <div class="bg-gradient-warning shadow-warning border-radius-lg py-3 pe-1">
                  <h4 class="text-white font-weight-bolder text-center mt-2 mb-0">
                    Tạo tài khoản
                  </h4>
                </div>
              </div>
              <div class="card-body">
                <MaterialInput id="fullname" class="input-group-outline my-3"
                  :label="{ text: 'Họ và tên', class: 'form-label' }" type="text" v-model="fullname" />
                <MaterialInput id="email" class="input-group-outline my-3"
                  :label="{ text: 'Email', class: 'form-label' }" type="email" v-model="email" />
                <MaterialInput id="phone" class="input-group-outline mb-3"
                  :label="{ text: 'Số điện thoại', class: 'form-label' }" type="tel" v-model="phone" />
                <MaterialInput id="password" class="input-group-outline mb-3"
                  :label="{ text: 'Mật khẩu', class: 'form-label' }" type="password" v-model="password" />
                <MaterialInput id="confirm_password" class="input-group-outline mb-3"
                  :label="{ text: 'Xác nhận mật khẩu', class: 'form-label' }" type="password"
                  v-model="confirm_password" />
                <MaterialInput id="address" class="input-group-outline mb-3"
                  :label="{ text: 'Địa chỉ', class: 'form-label' }" v-model="address" />
                <div class="text-center">
                  <MaterialButton class="my-4 mb-2" variant="gradient" color="warning" fullWidth @click="onRegister">
                    Đăng kí</MaterialButton>
                </div>
                <p class="mt-4 text-sm text-center">
                  Đã có tài khoản?
                  <RouterLink to="/login" class="text-warning text-gradient font-weight-bold">Đăng nhập</RouterLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Header>
</template>
