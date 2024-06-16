<template>
  <vc-side-bar-left>
    <div class="container-finance mb-8">
      <div class="headline">
        <h2>Đổi mật khẩu</h2>
      </div>
      <div class="margin-bottom-0">
        <p>
          <vc-notify></vc-notify>
        </p>
      </div>
      <vc-row>
        <vc-col :span="10" class="changepass-content">
          <el-form ref="changeForm" :model="passwordValidate" :rules="rules" :label-position="'top'">
            <vc-input-group required prop="olPass" label='Mật khẩu hiện tại' class="form-label">
              <vc-input class="text-input" v-model.trim="passwordValidate.olPass" placeholder='Mật khẩu hiện tại'
                type="password" autocomplete="off" show-password />
            </vc-input-group>

            <vc-input-group required prop="newPass" label='Mật khẩu mới' class="form-label">
              <vc-input class="text-input" v-model.trim="passwordValidate.newPass" placeholder='Mật khẩu mới'
                type="password" autocomplete="off" show-password />
            </vc-input-group>

            <vc-input-group required prop="cfPass" label='Xác nhận mật khẩu' class="form-label">
              <vc-input class="text-input" v-model.trim="passwordValidate.cfPass" placeholder='Xác nhận mật khẩu'
                type="password" autocomplete="off" show-password />
            </vc-input-group>

            <vc-button type="primary" class="card-footer-col-btn" @click="handleChangePass(changeForm)">
              Lưu thay đổi
            </vc-button>
          </el-form>
        </vc-col>
      </vc-row>
    </div>
  </vc-side-bar-left>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import validate from '@/utils/validate_elp'
import type { FormInstance } from 'element-plus'
import authService from '@auth/services/auth.service'
import { useRouter } from "vue-router";

const changeForm = ref<FormInstance>()
const router = useRouter();

const passwordValidate = reactive({
  olPass: '',
  newPass: '',
  cfPass: '',
})

const checkSamePassword = (rule: any, value: any, callback: any) => {
  if (value !== passwordValidate.newPass) {
    callback(
      new Error('Mật khẩu xác nhận chưa đúng')
    )
  } else {
    callback()
  }
}

const checkPasswrodInfection = (rule: any, value: any, callback: any) => {
  if (value === passwordValidate.olPass) {
    callback(new Error('Vui lòng nhập mật khẩu khác với mật khẩu hiện tại'))
  } else {
    callback()
  }
}

const rules = reactive({
  cfPass: [
    {
      required: true,
      validator: validate.required,
      trigger: 'blur',
      label: 'Xác nhận mật khẩu',
    },
    { validator: validate.alphabetAndSymbolRule, trigger: 'blur' },
    { validator: checkSamePassword, trigger: 'blur' },
  ],
  newPass: [
    {
      required: true,
      validator: validate.required,
      trigger: 'blur',
      label: 'Mật khẩu mới',
    },
    { validator: validate.alphabetAndSymbolRule, trigger: 'blur' },
    { validator: checkPasswrodInfection, trigger: 'blur' },
  ],
  olPass: [
    {
      required: true,
      validator: validate.required,
      trigger: 'blur',
      label: 'Mật khẩu hiện tại',
    },
    { validator: validate.alphabetAndSymbolRule, trigger: 'blur' },
  ],
})

const changePassword = async () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') ?? "") ?? {};

  const data = {
    email: userInfo.email ?? "",
    currentPassword: passwordValidate.olPass,
    newPassword: passwordValidate.newPass,
  }
  if (data) {
    const response = await authService.changePassword(data)
    if (response.success) {
      localStorage.removeItem("userInfo")
      localStorage.removeItem("isLoggedIn")
      router.push({
        name: "Login",
      });
    }
  }
}
const handleChangePass = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      changePassword()
    }
  })
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/page/account/changePasswordAd.scss';
</style>
<style>
.form-label>.el-form-item__label::after {
  content: '*' !important;
  color: red !important;
  margin-right: 4px !important;
}

.form-label>.el-form-item__label::before {
  content: '' !important;
}
</style>
