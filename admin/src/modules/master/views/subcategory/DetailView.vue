<template>
  <vc-modal ref="modal" :title="modalTitle" :type="props.type" @close="close">
    <template #content>
      <el-descriptions style="padding: 12px 16px" :column="1" border v-if="type == POPUP_TYPE.VIEW">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Tên danh mục cha
            </div>
          </template>
          {{ subcategory.category_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Tên danh mục con
            </div>
          </template>
          {{ subcategory.subcategory_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Ngày tạo
            </div>
          </template>
          {{ dateTime.formatDateTimeNew(subcategory.created_at) }}
        </el-descriptions-item>
      </el-descriptions>
      <el-form ref="subcategoryForm" :model="subcategory" :rules="rules" label-position="right"
        style="padding: 12px 16px" require-asterisk-position="right" v-else>
        <vc-row :gutter="20">
          <vc-col>
            <vc-input-group required prop="category_id" label='Tên danh mục cha'>
              <el-select v-model="subcategory.category_id" placeholder="Chọn danh mục cha">
                <el-option v-for="item in dataGrid" :key="item._id" :label="item.category_name" :value="item._id" />
              </el-select>
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col>
            <vc-input-group required prop="subcategory_name" label='Tên danh mục con'>
              <vc-input v-model="subcategory.subcategory_name" placeholder='Nhập tên danh mục con' maxlength="250" />
            </vc-input-group>
          </vc-col>
        </vc-row>
      </el-form>
    </template>

    <template #acttion>
      <vc-button v-if="props.type != POPUP_TYPE.VIEW" type="primary" class="ml-2" code="F00004"
        @click="onSave(subcategoryForm)" :loading="isLoading" :icon="'FolderChecked'">
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
import { storeToRefs } from 'pinia'
import { onMounted, ref, reactive } from "vue";
import validate from "@/utils/validate_elp";
import type { FormInstance } from "element-plus";
import subcategoryService from '@master/services/subcategory.service';
import { POPUP_TYPE } from "@/commons/const";
import dateTime from "@/utils/dateTime";
import { useCategoryStore } from '@master/stores/category.store'

/**
 * Variable define
 */
const store = useCategoryStore();
const { dataGrid } = storeToRefs(store)

const rules = reactive({
  subcategory_name: [
    { label: 'Tên danh mục con', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Tên danh mục con', validator: validate.maxLengthRule, trigger: ["blur"], max: 250 },
  ],
  category_id: [
    { label: 'Tên danh mục cha', required: true, validator: validate.required, trigger: ["change"] },
  ],
});

const props = defineProps<{
  type: POPUP_TYPE;
}>();

const subcategoryForm = ref<FormInstance>();
const isLoading = ref(false);
const confirmDialog = ref<any>(null);
const modal = ref<any>(null);
const modalTitle = ref<any>(null);
let callback = (value: any) => { return value };

const subcategory = reactive({
  _id: '',
  category_name: null,
  subcategory_name: null,
  category_id: '',
  created_at: '',
});

/**
 * Life circle vue js
 */
// onMounted function
onMounted(async () => {
  await store.getList();
});

/**
 * Function
 */
const onSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate(async (valid) => {
    if (!valid) return;

    isLoading.value = true;
    if (subcategory._id) {
      await subcategoryService.update(subcategory).finally(() => {
        isLoading.value = false;
      });
    } else {
      await subcategoryService.create(subcategory).finally(() => {
        isLoading.value = false;
      });
    }
    callback(true);
    close();
  });
};

const open = async (title: any, item: any, _callback: any) => {
  let subcategoryInfo = {
    _id: '',
    subcategory_name: null,
    category_id: null,
    created_at: null,
  };
  modalTitle.value = title;
  if (item)
    subcategoryInfo = (await subcategoryService.detail(item)).data
    
  callback = _callback;
  Object.assign(subcategory, subcategoryInfo)
  modal.value.open();
};

const close = () => {
  if (subcategoryForm.value) {
    subcategoryForm.value.resetFields();
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