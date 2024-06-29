<template>
  <vc-modal ref="modal" :title="modalTitle" :type="props.type" @close="close">
    <template #content>
      <el-descriptions style="padding: 12px 16px" :column="1" border v-if="type == POPUP_TYPE.VIEW">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Tên nhà thuốc
            </div>
          </template>
          {{ pharmacy.pharmacy_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Địa chỉ
            </div>
          </template>
          {{ pharmacy.address }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Vĩ độ
            </div>
          </template>
          {{ pharmacy.latitude }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Kinh độ
            </div>
          </template>
          {{ pharmacy.longitude }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Ngày tạo
            </div>
          </template>
          {{ dateTime.formatDateTimeNew(pharmacy.created_at) }}
        </el-descriptions-item>
      </el-descriptions>
      <vc-row :gutter="20" v-if="type == POPUP_TYPE.VIEW">
        <vc-col>
          <GoogleMap :api-key="GOOGLE_MAPS_API_KEY" style="width: 100%; height: 500px" :center="center"
            :zoom="zoom" @click="handleMapClick">
            <Marker :options="{ position: center }" />
            <MarkerCluster>
              <Marker v-for="(location, i) in locations" :options="{ position: location }" :key="i">
                <InfoWindow :options="{ position: location, content: infoWindowContent(location) }" />
              </Marker>
            </MarkerCluster>
          </GoogleMap>
        </vc-col>
      </vc-row>
      <el-form ref="pharmacyForm" :model="pharmacy" :rules="rules" label-position="right" style="padding: 12px 16px"
        require-asterisk-position="right" v-else>
        <vc-row :gutter="20">
          <vc-col :span="12">
            <vc-input-group required prop="pharmacy_name" label='Tên nhà thuốc'>
              <vc-input v-model="pharmacy.pharmacy_name" placeholder='Nhập tên nhà thuốc' maxlength="250" />
            </vc-input-group>
          </vc-col>
          <vc-col :span="12">
            <vc-input-group required prop="address" label='Địa chỉ'>
              <vc-input v-model="pharmacy.address" placeholder='Nhập địa chỉ' type="textarea" maxlength="250" />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col :span="12">
            <vc-input-group required prop="latitude" label='Vĩ độ'>
              <vc-input v-model="pharmacy.latitude" placeholder='Vĩ độ' maxlength="250" disabled />
            </vc-input-group>
          </vc-col>
          <vc-col :span="12">
            <vc-input-group required prop="longitude" label='Kinh độ'>
              <vc-input v-model="pharmacy.longitude" placeholder='Kinh độ' maxlength="250" disabled />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20" class="mb-2">
          <vc-col>
            <i>Vui lòng chọn 1 điểm trên bản đồ</i> <br />
            <vc-button class="mt-2" type="primary" :icon="'LocationInformation'" @click="getCurrentLocation">Vị trí của
              bạn</vc-button>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col>
            <GoogleMap :api-key="GOOGLE_MAPS_API_KEY" style="width: 100%; height: 500px" :center="center"
              :zoom="zoom" @click="handleMapClick">
              <Marker :options="{ position: center }" />
              <MarkerCluster>
                <Marker v-for="(location, i) in locations" :options="{ position: location }" :key="i">
                  <InfoWindow :options="{ position: location, content: infoWindowContent(location) }" />
                </Marker>
              </MarkerCluster>
            </GoogleMap>
          </vc-col>
        </vc-row>
      </el-form>
    </template>

    <template #acttion>
      <vc-button v-if="props.type != POPUP_TYPE.VIEW" type="primary" class="ml-2" code="F00004"
        @click="onSave(pharmacyForm)" :loading="isLoading" :icon="'FolderChecked'">
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
import pharmacyService from '@master/services/pharmacy.service';
import { POPUP_TYPE } from "@/commons/const";
import dateTime from "@/utils/dateTime";
import { GoogleMap, Marker, MarkerCluster, InfoWindow } from "vue3-google-map";
import { usePharmacyStore } from '@master/stores/pharmacy.store'

/**
 * Variable define
 */
const rules = reactive({
  pharmacy_name: [
    { label: 'Tên nhà thuốc', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Tên nhà thuốc', validator: validate.maxLengthRule, trigger: ["blur"], max: 250 },
  ],
  address: [
    { label: 'Địa chỉ', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Địa chỉ', validator: validate.maxLengthRule, trigger: ["blur"], max: 250 },
  ],
  latitude: [
    { label: 'Vĩ độ', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Vĩ độ', validator: validate.maxLengthRule, trigger: ["blur"], max: 250 },
  ],
  longitude: [
    { label: 'Kinh độ', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Kinh độ', validator: validate.maxLengthRule, trigger: ["blur"], max: 250 },
  ],
});

const store = usePharmacyStore()
const {
  dataGrid
} = storeToRefs(store);

const props = defineProps<{
  type: POPUP_TYPE;
}>();

const pharmacyForm = ref<FormInstance>();
const isLoading = ref(false);
const confirmDialog = ref<any>(null);
const modal = ref<any>(null);
const modalTitle = ref<any>(null);
let callback = (value: any) => { return value };

const pharmacy = reactive({
  _id: '',
  pharmacy_name: null,
  address: null,
  latitude: null,
  longitude: null,
  created_at: '',
});

const GOOGLE_MAPS_API_KEY = "AIzaSyDa6fUGWZAlcemboXTlwhZf7pzuciNZIeU";
const zoom = ref<any>(10);
const center = ref<any>({ lat: 0, lng: 0 });
const locations = ref<any>([]);
/**
 * Life circle vue js
 */
// onMounted function
onMounted(async () => {
  await store.getList();
  const array = dataGrid.value.map((item: any) => {
    return {
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
})

/**
 * Function
 */
const onSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate(async (valid) => {
    if (!valid) return;

    isLoading.value = true;
    if (pharmacy._id) {
      await pharmacyService.update(pharmacy).finally(() => {
        isLoading.value = false;
      });
    } else {
      await pharmacyService.create(pharmacy).finally(() => {
        isLoading.value = false;
      });
    }
    callback(true);
    close();
  });
};

const open = async (title: any, item: any, _callback: any) => {
  let pharmacyInfo = {
    _id: '',
    pharmacy_name: null,
    created_at: null,
  };
  modalTitle.value = title;

  if (item)
    pharmacyInfo = (await pharmacyService.detail(item)).data
  callback = _callback;
  Object.assign(pharmacy, pharmacyInfo)
  modal.value.open();
};

const close = () => {
  if (pharmacyForm.value) {
    pharmacyForm.value.resetFields();
  }
  modal.value.close()
};

// Event click map
const handleMapClick = (event: any) => {
  pharmacy.latitude = event.latLng.lat();
  pharmacy.longitude = event.latLng.lng();
  center.value = { lat: event.latLng.lat(), lng: event.latLng.lng() };
  zoom.value = 15;
};

// Method get current location
const getCurrentLocation = () => {
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
};
const infoWindowContent = (location: any) => {
  // Tạo liên kết đến Google Maps với lat lng được chọn
  const googleMapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
  return `
        <div>
          <b>${location.pharmacy_name}</b>
          <p>Latitude: ${location.lat}</p>
          <p>Longitude: ${location.lng}</p>
          <a href="${googleMapsLink}" target="_blank">View on Google Maps</a>
        </div>
      `;
}

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