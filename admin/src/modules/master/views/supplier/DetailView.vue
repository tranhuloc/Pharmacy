<template>
  <vc-modal ref="modal" :title="modalTitle" :type="props.type" @close="close">
    <template #content>
      <el-descriptions style="padding: 12px 16px" :column="1" border v-if="type == POPUP_TYPE.VIEW">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Tên nhà cung cấp
            </div>
          </template>
          {{ supplier.supplier_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Thông tin liên hệ
            </div>
          </template>
          {{ supplier.contact_info }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Ngày tạo
            </div>
          </template>
          {{ dateTime.formatDateTimeNew(supplier.created_at) }}
        </el-descriptions-item>
      </el-descriptions>
      <el-form ref="supplierForm" :model="supplier" :rules="rules" label-position="right" style="padding: 12px 16px"
        require-asterisk-position="right" v-else>
        <vc-row :gutter="20">
          <vc-col>
            <vc-input-group required prop="supplier_name" label='Tên nhà cung cấp'>
              <vc-input v-model="supplier.supplier_name" placeholder='Nhập tên nhà cung cấp' maxlength="250" />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col>
            <vc-input-group required prop="supplier_name" label='Thông tin liên hệ'>
              <vc-input v-model="supplier.contact_info" placeholder="Nhập thông tin liên hệ" maxlength="250" :rows="2"
                type="textarea" />
            </vc-input-group>
          </vc-col>
        </vc-row>
      </el-form>
    </template>

    <template #acttion>
      <vc-button v-if="props.type != POPUP_TYPE.VIEW" type="primary" class="ml-2" code="F00004"
        @click="onSave(supplierForm)" :loading="isLoading" :icon="'FolderChecked'">
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
import { onMounted, ref, reactive } from "vue";
import validate from "@/utils/validate_elp";
import type { FormInstance } from "element-plus";
import supplierService from '@master/services/supplier.service';
import { POPUP_TYPE } from "@/commons/const";
import dateTime from "@/utils/dateTime";

/**
 * Variable define
 */
const rules = reactive({
  supplier_name: [
    { label: 'Tên nhà cung cấp', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Tên nhà cung cấp', validator: validate.maxLengthRule, trigger: ["blur"], max: 250 },
  ],
  contact_info: [
    { label: 'Thông tin liên hệ', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Thông tin liên hệ', validator: validate.maxLengthRule, trigger: ["blur"], max: 250 },
  ],
});

const props = defineProps<{
  type: POPUP_TYPE;
}>();

const supplierForm = ref<FormInstance>();
const isLoading = ref(false);
const confirmDialog = ref<any>(null);
const modal = ref<any>(null);
const modalTitle = ref<any>(null);
let callback = (value: any) => { return value };

const supplier = reactive({
  _id: '',
  supplier_name: null,
  contact_info: null,
  created_at: '',
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
    if (supplier._id) {
      await supplierService.update(supplier).finally(() => {
        isLoading.value = false;
      });
    } else {
      await supplierService.create(supplier).finally(() => {
        isLoading.value = false;
      });
    }
    callback(true);
    close();
  });
};

const open = async (title: any, item: any, _callback: any) => {
  let supplierInfo = {
    _id: '',
    supplier_name: null,
    contact_info: null,
    created_at: null,
  };
  modalTitle.value = title;

  if (item)
    supplierInfo = (await supplierService.detail(item)).data
  callback = _callback;
  Object.assign(supplier, supplierInfo)
  modal.value.open();
};

const close = () => {
  if (supplierForm.value) {
    supplierForm.value.resetFields();
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