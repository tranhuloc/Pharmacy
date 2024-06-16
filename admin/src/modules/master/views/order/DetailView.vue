<template>
  <vc-modal ref="modal" :title="modalTitle" @close="close">
    <template #content>
      <el-descriptions style="padding: 12px 16px" :column="1" border v-if="!flagOrderDetail">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Tên người nhận
            </div>
          </template>
          {{ order.receiver }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Số điện thoại
            </div>
          </template>
          {{ order.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Địa chỉ
            </div>
          </template>
          {{ order.address }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Ngày đặt hàng
            </div>
          </template>
          {{ dateTime.formatDateTimeNew(order.created_at) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Tổng tiền
            </div>
          </template>
          {{ order.total_price }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Trạng thái
            </div>
          </template>
          <el-popconfirm confirm-button-text="Có" width="auto" cancel-button-text="Không"
            :icon="InfoFilled" icon-color="#626AEF"
            title="Bạn muốn thay đổi trạng thái đơn hàng?"
            @confirm="changeStatus">
            <template #reference>
              <el-radio-group v-model="order.status">
                <el-radio value="Chờ xác nhận">Chờ xác nhận</el-radio>
                <el-radio value="Đã xác nhận">Đã xác nhận</el-radio>
                <el-radio value="Đang giao hàng">Đang giao hàng</el-radio>
                <el-radio value="Đã giao hàng">Đã giao hàng</el-radio>
                <el-radio value="Hủy đơn">Hủy đơn</el-radio>
              </el-radio-group>
            </template>
          </el-popconfirm>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Ghi chú
            </div>
          </template>
          {{ order.note }}
        </el-descriptions-item>
      </el-descriptions>
      <vc-table v-else :datas="dataGrid" :tableConfig="tableConfig" :colConfigs="colConfig">
        <template #action="{ data }">
          <div class="d-flex flex-center">
            <vc-button type="warning" size="small" class="btn-acttion" @click="onView(data)" :icon="'View'"></vc-button>
          </div>
        </template>
      </vc-table>
    </template>
    <vc-confirm ref="confirmDialog"></vc-confirm>
  </vc-modal>
  <detail-product-modal ref="detailProductRef" :type="POPUP_TYPE.VIEW"></detail-product-modal>
</template>

<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { ref, reactive } from "vue";
import orderService from '@master/services/order.service';
import dateTime from "@/utils/dateTime";
import DetailProductModal from '../product/DetailView.vue'
import { POPUP_TYPE } from "@/commons/const";

/**
 * Variable define
 */
const confirmDialog = ref<any>(null);
const modal = ref<any>(null);
const modalTitle = ref<any>(null);
const dataGrid = ref<any>([]);
const detailProductRef = ref<any>(null);
const flagOrderDetail = ref<any>(false);

const tableConfig = {
  action: true,
  index: true,
}

const colConfig = [
  {
    key: 'product_name',
    title: "Tên sản phẩm"
  },
  {
    key: 'quantity',
    title: "Số lượng"
  },
]

let callback = (value: any) => { return value };

const order = reactive({
  _id: '',
  receiver: '',
  phone: '',
  address: '',
  order_date: '',
  total_price: '',
  status: '',
  note: '',
  is_deleted: '',
  created_at: '',
});

/**
 * Life circle vue js
 */

/**
 * Function
 */

const open = async (title: any, item: any, flagDetail: boolean, _callback: any) => {
  flagOrderDetail.value = flagDetail;
  modalTitle.value = title;
  if (flagDetail) {
    const response = (await orderService.order_detail(item)).data
    dataGrid.value = response.map((item: any) => {
      return {
        product_id: item.product_id._id,
        product_name: item.product_id.product_name,
        quantity: item.quantity,
      };
    });
  }
  else {
    let orderInfo = {} as any;

    if (item)
      orderInfo = (await orderService.detail(item)).data
    callback = _callback;
    Object.assign(order, orderInfo)
  }
  modal.value.open();
};

// onView
const onView = (item: any) => {
  detailProductRef.value.open("Chi tiết sản phẩm", item.product_id)
};

// changeStatus
const changeStatus = async () => {
  await orderService.changeStatus(order._id, order.status)
};

const close = () => {
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