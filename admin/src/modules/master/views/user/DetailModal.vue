<template>
  <vc-modal ref="modal" :title="modalTitle" :type="props.type" @close="close">
    <template #content>
      <el-descriptions style="padding: 12px 16px" :column="1" border v-if="type == POPUP_TYPE.VIEW">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Họ và tên
            </div>
          </template>
          {{ user.fullname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Email
            </div>
          </template>
          {{ user.email }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Số điện thoại
            </div>
          </template>
          {{ user.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Địa chỉ
            </div>
          </template>
          {{ user.address }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Quyền người dùng
            </div>
          </template>
          {{ user.role_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Ngày tạo
            </div>
          </template>
          {{ dateTime.formatDateTimeNew(user.created_at) }}
        </el-descriptions-item>
      </el-descriptions>
      <el-form ref="userForm" :model="user" :rules="rules" label-position="right" style="padding: 12px 16px"
        require-asterisk-position="right" v-else>
        <vc-row :gutter="20" v-if="props.type == POPUP_TYPE.CREATE">
          <vc-col :span="12">
            <vc-input-group required prop="fullname" label='Họ và tên'>
              <vc-input v-model="user.fullname" placeholder='Nhập họ và tên' maxlength="250" />
            </vc-input-group>
          </vc-col>
          <vc-col :span="12">
            <vc-input-group required prop="password" label='Mật khẩu'>
              <vc-input v-model="user.password" placeholder='Nhập mật khẩu' maxlength="250" type="password" />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20" v-else>
          <vc-col :span="12">
            <vc-input-group required prop="fullname" label='Họ và tên'>
              <vc-input v-model="user.fullname" placeholder='Nhập họ và tên' maxlength="250" />
            </vc-input-group>
          </vc-col>
          <vc-col :span="12">
            <vc-input-group label='Mật khẩu'>
              <vc-input v-model="user.password" placeholder='Nhập mật khẩu' maxlength="250" type="password" />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col :span="12">
            <vc-input-group required prop="email" label='Email'>
              <vc-input v-model="user.email" placeholder='Nhập email' maxlength="250" />
            </vc-input-group>
          </vc-col>
          <vc-col :span="12">
            <vc-input-group required prop="phone" label='Số điện thoại'>
              <vc-input v-model="user.phone" placeholder='Nhập số điện thoại' maxlength="250" />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col>
            <vc-input-group required prop="role_id" label='Quyền người dùng'>
              <el-select v-model="user.role_id" placeholder="Chọn quyền người dùng">
                <el-option v-for="item in roles" :key="item._id" :label="item.role_name" :value="item._id" />
              </el-select>
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col>
            <vc-input-group required prop="address" label='Địa chỉ'>
              <vc-input v-model="user.address" placeholder='Nhập địa chỉ' type="textarea" maxlength="250" />
            </vc-input-group>
          </vc-col>
        </vc-row>
      </el-form>
    </template>

    <template #acttion>
      <vc-button v-if="props.type != POPUP_TYPE.VIEW" type="primary" class="ml-2" code="F00004"
        @click="onSave(userForm)" :loading="isLoading" :icon="'FolderChecked'">
        {{ props.type == POPUP_TYPE.CREATE ? "Thêm mới" : "Chỉnh sửa" }}
      </vc-button>
    </template>
    <vc-confirm ref="confirmDialog"></vc-confirm>
  </vc-modal>
</template>

<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { ref, reactive } from "vue";
import validate from "@/utils/validate_elp";
import type { FormInstance } from "element-plus";
import userService from '@master/services/user.service';
import { POPUP_TYPE } from "@/commons/const";
import dateTime from "@/utils/dateTime";

/**
 * Variable define
 */
const rules = reactive({
  username: [
    { label: 'Tên đăng nhập', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Tên đăng nhập', validator: validate.maxLengthRule, trigger: ["blur"], max: 250 },
  ],
  password: [
    { label: 'Mật khẩu', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Mật khẩu', validator: validate.maxLengthRule, trigger: ["blur"], max: 250 },
  ],
  fullname: [
    { label: 'Họ và tên', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Họ và tên', validator: validate.maxLengthRule, trigger: ["blur"], max: 250 },
  ],
  phone: [
    { label: 'Số điện thoại', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Số điện thoại', validator: validate.phoneNumberRule, trigger: ["blur"], max: 250 },
  ],
  email: [
    { label: 'Email', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Email', validator: validate.emailRule, trigger: ["blur"], max: 250 },
  ],
  address: [
    { label: 'Địa chỉ', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Địa chỉ', validator: validate.maxLengthRule, trigger: ["blur"], max: 250 },
  ],
  role_id: [
    { label: 'Quyền người dùng', required: true, validator: validate.required, trigger: ["chnage"] },
  ],
});

const props = defineProps<{
  type: POPUP_TYPE;
}>();

const userForm = ref<FormInstance>();
const isLoading = ref(false);
const confirmDialog = ref<any>(null);
const modal = ref<any>(null);
const modalTitle = ref<any>(null);
const flagUserName = ref<any>(null);
const flagEmail = ref<any>(null);
const roles = ref<any>([]);
let callback = (value: any) => { return value };

const user = reactive({
  _id: '',
  username: null,
  fullname: null,
  email: null,
  phone: null,
  address: null,
  role_name: null,
  role_id: '',
  password: null,
  created_at: '',
  flgUserName: false,
  flgEmail: false,
});

/**
 * Life circle vue js
 */

/**
 * Function
 */
const onSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate(async (valid) => {
    if (!valid) return;

    isLoading.value = true;
    if (user._id) {
      if (flagUserName.value != user.username) {
        user.flgUserName = true;
      }
      if (flagEmail.value != user.email) {
        user.flgEmail = true;
      }
      await userService.update(user).finally(() => {
        isLoading.value = false;
      });
    } else {
      await userService.create(user).finally(() => {
        isLoading.value = false;
      });
    }
    callback(true);
    close();
  });
};

const open = async (title: any, item: any, _callback: any) => {
  roles.value = (await userService.getListRole()).data
  let userInfo = {
    _id: '',
    username: null,
    firstname: null,
    lastname: null,
    email: null,
    phone: null,
    address: null,
    role_name: null,
    role_id: '',
    password: null,
    created_at: '',
  };
  modalTitle.value = title;

  if (item)
    userInfo = (await userService.detail(item)).data
  callback = _callback;
  Object.assign(user, userInfo)
  flagEmail.value = user.email;
  flagUserName.value = user.username;
  modal.value.open();
};

const close = () => {
  if (userForm.value) {
    userForm.value.resetFields();
  }
  modal.value.close()
};

defineExpose({
  open,
  close,
});

</script>
<style>
.el-form-item {
  display: block;
}
</style>