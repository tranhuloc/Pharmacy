<template>
  <vc-modal ref="modal" :title="modalTitle" :type="props.type" @close="close">
    <template #content>
      <el-descriptions style="padding: 12px 16px" :column="1" border v-if="type == POPUP_TYPE.VIEW">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Tên sản phẩm
            </div>
          </template>
          {{ product.product_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Thương hiệu
            </div>
          </template>
          {{ product.trademark }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Hình ảnh
            </div>
          </template>
          <vc-row :gutter="20">
            <vc-col v-for="image in product.images" :span="6">
              <el-image style="width: 100px; height: 100px" :src="getImageUrl(image.image_url)" fit="cover">
                <template #error>
                  <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </vc-col>
          </vc-row>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Nhà thuốc
            </div>
          </template>
          {{ product.pharmacy_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Nhà cung cấp
            </div>
          </template>
          {{ product.supplier_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Tên danh mục
            </div>
          </template>
          {{ product.subcategory_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Giá
            </div>
          </template>
          {{ product.price }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Số lượng
            </div>
          </template>
          {{ product.stock_quantity }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Mô tả
            </div>
          </template>
          {{ product.description }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Hoạt chất
            </div>
          </template>
          {{ product.active_ingredient }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Chỉ định
            </div>
          </template>
          {{ product.indications }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Dạng bào chế
            </div>
          </template>
          {{ product.dosage_form }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Nơi sản xuất
            </div>
          </template>
          {{ product.manufacturer }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Quy cách
            </div>
          </template>
          {{ product.packaging }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Lưu ý
            </div>
          </template>
          {{ product.note }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Ngày tạo
            </div>
          </template>
          {{ dateTime.formatDateTimeNew(product.created_at) }}
        </el-descriptions-item>
      </el-descriptions>
      <el-form ref="productForm" :model="product" :rules="rules" label-position="right" style="padding: 12px 16px"
        require-asterisk-position="right" v-else>
        <vc-row :gutter="20">
          <vc-col :span="12">
            <vc-input-group required prop="product_name" label='Tên sản phẩm'>
              <vc-input v-model="product.product_name" placeholder='Nhập tên sản phẩm' maxlength="250" />
            </vc-input-group>
          </vc-col>
          <vc-col :span="12">
            <vc-input-group required prop="trademark" label='Thương hiệu'>
              <vc-input v-model="product.trademark" placeholder='Nhập tên thương hiệu' maxlength="250" />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col :span="8">
            <vc-input-group required prop="pharmacy_id" label='Nhà thuốc'>
              <el-select v-model="product.pharmacy_id" placeholder="Chọn nhà thuốc">
                <el-option v-for="item in dataGridPharmacy" :key="item._id" :label="item.pharmacy_name"
                  :value="item._id" />
              </el-select>
            </vc-input-group>
          </vc-col>
          <vc-col :span="8">
            <vc-input-group required prop="subcategory_id" label='Danh mục'>
              <el-select v-model="product.subcategory_id" placeholder="Chọn danh mục">
                <el-option v-for="item in dataGridSubCategory" :key="item._id" :label="item.subcategory_name"
                  :value="item._id" />
              </el-select>
            </vc-input-group>
          </vc-col>
          <vc-col :span="8">
            <vc-input-group required prop="supplier_id" label='Nhà cung cấp'>
              <el-select v-model="product.supplier_id" placeholder="Chọn nhà cung cấp">
                <el-option v-for="item in dataGridSupplier" :key="item._id" :label="item.supplier_name"
                  :value="item._id" />
              </el-select>
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col :span="12">
            <vc-input-group required prop="price" label='Giá'>
              <vc-input v-model="product.price" placeholder='Nhập giá' type="number" />
            </vc-input-group>
          </vc-col>
          <vc-col :span="12">
            <vc-input-group required prop="stock_quantity" label='Số lượng'>
              <vc-input v-model="product.stock_quantity" placeholder='Nhập số lượng' type="number" />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col>
            <vc-input-group required prop="images" label='Hình ảnh'>
              <el-upload ref="upload" class="upload-demo" :on-change="handleFileChange" drag :auto-upload="false"
                multiple>
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  Thả tập tin ở đây hoặc <em>bấm vào để tải lên</em>
                </div>
              </el-upload>
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20" v-if="props.type == POPUP_TYPE.EDIT">
          <vc-col v-for="image in product.images" :span="4">
            <el-image style="width: 100px; height: 100px" :src="getImageUrl(image.image_url)" fit="cover">
              <template #error>
                <div class="image-slot">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>
            <vc-button type="danger" size="small" class="btn-acttion" @click="onDeleteImage(image._id)"
              :icon="'Delete'"></vc-button>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col :span="12">
            <vc-input-group prop="description" label='Mô tả'>
              <vc-input v-model="product.description" placeholder='Nhập mô tả' type="textarea" />
            </vc-input-group>
          </vc-col>
          <vc-col :span="12">
            <vc-input-group prop="active_ingredient" label='Hoạt chất'>
              <vc-input v-model="product.active_ingredient" placeholder='Nhập hoạt chất' />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col :span="12">
            <vc-input-group prop="indications" label='Chỉ định'>
              <vc-input v-model="product.indications" placeholder='Nhập chỉ định' />
            </vc-input-group>
          </vc-col>
          <vc-col :span="12">
            <vc-input-group prop="dosage_form" label='Dạng bào chế'>
              <vc-input v-model="product.dosage_form" placeholder='Nhập dạng bào chế' />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col :span="12">
            <vc-input-group prop="manufacturer" label='Nơi sản xuất'>
              <vc-input v-model="product.manufacturer" placeholder='Nhập nơi sản xuất' />
            </vc-input-group>
          </vc-col>
          <vc-col :span="12">
            <vc-input-group prop="packaging" label='Quy cách'>
              <vc-input v-model="product.packaging" placeholder='Nhập quy cách' />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col>
            <vc-input-group prop="note" label='Lưu ý'>
              <vc-input v-model="product.note" placeholder='Nhập lưu ý' type="textarea" />
            </vc-input-group>
          </vc-col>
        </vc-row>
      </el-form>
    </template>

    <template #acttion>
      <vc-button v-if="props.type != POPUP_TYPE.VIEW" type="primary" class="ml-2" code="F00004"
        @click="onSave(productForm)" :loading="isLoading" :icon="'FolderChecked'">
        {{ props.type == POPUP_TYPE.CREATE ? "Thêm mới" : "Chỉnh sửa" }}
      </vc-button>
    </template>
  </vc-modal>
  <vc-confirm ref="confirmDialog"></vc-confirm>
</template>

<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { storeToRefs } from 'pinia'
import { onMounted, ref, reactive } from "vue";
import validate from "@/utils/validate_elp";
import productService from '@master/services/product.service';
import { POPUP_TYPE } from "@/commons/const";
import dateTime from "@/utils/dateTime";
import { useSubCategoryStore } from '@master/stores/subcategory.store'
import { useSupplierStore } from '@master/stores/supplier.store'
import { usePharmacyStore } from '@master/stores/pharmacy.store'
import { useToastStore } from '@/stores/toast.store'
import type { FormInstance, UploadInstance } from "element-plus";

/**
 * Variable define
 */
const toastStore = useToastStore()
const rules = reactive({
  product_name: [
    { label: 'Tên sản phẩm', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Tên sản phẩm', validator: validate.maxLengthRule, trigger: ["blur"], max: 250 },
  ],
  trademark: [
    { label: 'Tên thương hiệu', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Tên thương hiệu', validator: validate.maxLengthRule, trigger: ["blur"], max: 250 },
  ],
  price: [
    { label: 'Giá', required: true, validator: validate.required, trigger: ["blur"] },
  ],
  stock_quantity: [
    { label: 'Số lượng', required: true, validator: validate.required, trigger: ["blur"] },
  ],
  supplier_id: [
    { label: 'Nhà cung cấp', required: true, validator: validate.required, trigger: ["change"] },
  ],
  pharmacy_id: [
    { label: 'Nhà thuốc', required: true, validator: validate.required, trigger: ["change"] },
  ],
  subcategory_id: [
    { label: 'Danh mục', required: true, validator: validate.required, trigger: ["change"] },
  ],
});

const props = defineProps<{
  type: POPUP_TYPE;
}>();

const productForm = ref<FormInstance>();
const isLoading = ref(false);
const confirmDialog = ref<any>(null);
const modal = ref<any>(null);
const modalTitle = ref<any>(null);
const image_selected = ref<any>([]);
let callback = (value: any) => { return value };
const storePharmacy = usePharmacyStore();
const { dataGrid: dataGridPharmacy } = storeToRefs(storePharmacy)
const storeSubCategory = useSubCategoryStore();
const { dataGrid: dataGridSubCategory } = storeToRefs(storeSubCategory)
const storeSupplier = useSupplierStore();
const { dataGrid: dataGridSupplier } = storeToRefs(storeSupplier)
const upload = ref<UploadInstance>()

const product = reactive({
  _id: '',
  product_name: null,
  trademark: '',
  pharmacy_id: '',
  pharmacy_name: '',
  subcategory_id: '',
  subcategory_name: '',
  supplier_id: '',
  supplier_name: '',
  price: null,
  stock_quantity: null,
  url_image: null,
  description: null,
  active_ingredient: null,
  indications: null,
  dosage_form: null,
  manufacturer: null,
  packaging: null,
  note: null,
  created_at: '',
  images: [{ '_id': '', 'image_url': '' }]
});

/**
 * Life circle vue js
 */
// onMounted function
onMounted(async () => {
  await storeSubCategory.getList();
  await storeSupplier.getList();
  await storePharmacy.getList();
});

/**
 * Function
 */
const onSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate(async (valid) => {
    if (!valid) return;

    if (image_selected.value.length == 0 && props.type == POPUP_TYPE.CREATE) {
      toastStore.push({
        type: 'error',
        message: "Vui lòng chọn hình ảnh"
      });
      return;
    }
    isLoading.value = true;
    const formData = new FormData();
    formData.append('product_name', product.product_name ?? "");
    formData.append('trademark', product.trademark ?? "");
    formData.append('pharmacy_id', product.pharmacy_id ?? "");
    formData.append('subcategory_id', product.subcategory_id ?? "");
    formData.append('supplier_id', product.supplier_id ?? "");
    formData.append('price', product.price ?? "");
    formData.append('stock_quantity', product.stock_quantity ?? "");
    if (image_selected.value.length != 0) {
      image_selected.value.forEach((file: any) => {
        console.log(file.raw);
        formData.append('images', file.raw);
      });
    }
    formData.append('description', product.description ?? "");
    formData.append('active_ingredient', product.active_ingredient ?? "");
    formData.append('indications', product.indications ?? "");
    formData.append('dosage_form', product.dosage_form ?? "");
    formData.append('manufacturer', product.manufacturer ?? "");
    formData.append('packaging', product.packaging ?? "");
    formData.append('note', product.note ?? "");

    if (product._id) {
      await productService.update(product._id, formData).finally(() => {
        isLoading.value = false;
      });
    } else {
      await productService.create(formData).finally(() => {
        isLoading.value = false;
      });
    }
    callback(true);
    close();
  });
};

const open = async (title: any, item: any, _callback: any) => {
  let productInfo = {
    _id: '',
    product_name: null,
    subcategory_id: null,
    supplier_id: null,
    price: null,
    stock_quantity: null,
    images: null,
    description: null,
    active_ingredient: null,
    indications: null,
    dosage_form: null,
    manufacturer: null,
    packaging: null,
    note: null,
    created_at: null,
  };
  modalTitle.value = title;

  if (item) {
    var response = (await productService.detail(item))
    productInfo = response.data;
  }
  callback = _callback;

  Object.assign(product, productInfo)
  modal.value.open();
};

const close = () => {
  if (upload.value) {
    upload.value!.submit()
  }
  if (productForm.value) {
    productForm.value.resetFields();
  }
  modal.value.close()
};

const handleFileChange = (file: any, fileList: any) => {
  image_selected.value = fileList;
}

const getImageUrl = (url: any) => {
  return `${import.meta.env.VITE_SERVER_URL}${url}`;
};

// onDeleteImage
const onDeleteImage = (_id: any) => {
  if (product.images.length <= 1) {
    toastStore.push({
      type: 'error',
      message: "Phải có ít nhất một hình ảnh"
    });
    return;
  }
  confirmDialog.value.confirm(
    "Xác nhận xóa",
    "Bạn muốn xóa hình ảnh?",
    async (res: any) => {
      if (res) {
        await productService.deleteImage(_id);
        var response = await productService.getListImage(product._id);
        product.images = response.data ?? []
      }
    }
  );
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

.upload-demo {
  width: 100%;
}
</style>