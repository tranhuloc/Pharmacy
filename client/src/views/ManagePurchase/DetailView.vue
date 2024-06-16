<template>
  <el-dialog v-model="dialogVisible" :title="modalTitle">
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
        {{ order.created_at }}
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
        {{ order.status }}
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
    <el-table v-else :data="dataGrid" style="width: 100%" :loading="isLoading">
      <el-table-column prop="product_name" label="Tên sản phẩm" />
      <el-table-column prop="quantity" label="Số lượng" />
      <el-table-column align="right">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="onDetailProduct(scope.row)">
            Chi tiết
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
/**
 * Dependencies injection library
 */
import axios from 'axios';
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

/**
 * Variable define
 */
const modalTitle = ref<any>(null);
const dataGrid = ref<any>([]);
const flagOrderDetail = ref<any>(false);
const dialogVisible = ref<any>(false);
const router = useRouter()

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
    await axios.get(`${import.meta.env.VITE_API_URL}/orders/${item}/items`)
      .then((response) => {
        if (response.status === 200) {
          const data = response.data.data;
          dataGrid.value = data.map((item: any) => {
            return {
              product_id: item.product_id._id,
              product_name: item.product_id.product_name,
              quantity: item.quantity,
            };
          });
        }
      });
  }
  else {
    let orderInfo = {} as any;

    if (item) {
      await axios.get(`${import.meta.env.VITE_API_URL}/orders/${item}/order_by_id`)
        .then((response) => {
          if (response.status === 200) {
            orderInfo = response.data.data;
          }
        });
    }

    callback = _callback;
    Object.assign(order, orderInfo)
  }
  dialogVisible.value = true;
};

const onDetailProduct = (data: any) => {
  router.push({
    name: 'page-detail',
    params: {
      id: data.product_id
    }
  })
};

const close = () => {
  dialogVisible.value = false;
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