<template>
  <div class="vc-page page-home">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="statistic-card" style="background-color: #F56C6C; display: flex; align-items: center">
          <div>
            <User style="width: 120; height: 120; color: white" />
          </div>

          <el-statistic :value="dataGridUser.length">
            <template #title>
              <div>
                <span>Tổng người dùng</span>
                <el-tooltip effect="dark" content="Tổng người dùng" placement="top">
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistic-card" style="background-color: #E6A23C; display: flex; align-items: center">
          <div>
            <Place style="width: 120; height: 120; color: white" />
          </div>
          <el-statistic :value="dataGridSupplier.length">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                <span>Tổng nhà cung cấp</span>
                <el-tooltip effect="dark" content="Tổng nhà cung cấp" placement="top">
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistic-card" style="background-color: #67C23A; display: flex; align-items: center">
          <div>
            <TakeawayBox style="width: 120; height: 120; color: white" />
          </div>
          <el-statistic :value="dataGridProduct.length">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                <span>Tổng sản phẩm</span>
                <el-tooltip effect="dark" content="Tổng sản phẩm" placement="top">
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistic-card" style="background-color: #409EFF; display: flex; align-items: center">
          <div>
            <Tickets style="width: 120; height: 120; color: white" />
          </div>
          <el-statistic :value="dataGridOrder.length">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                <span>Tổng đơn hàng</span>
                <el-tooltip effect="dark" content="Tổng đơn hàng" placement="top">
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
    </el-row>
    <vc-card class="mb-4 pa-4" style="margin-top: 40px">
      <div style="display: flex;">
        <div>
          <b class="mr-2">Ngày thống kê</b>
          <el-date-picker @change="handleChangeDateRange" v-model="dateRange" type="daterange" start-placeholder="Start Date" end-placeholder="End Date" />
        </div>
      </div>

      <h1 class="mb-4 mt-4">Doanh thu</h1>
      <div class="chart-container">
        <Bar :data="chartData" :options="chartOptions" />
      </div>

    </vc-card>
  </div>
</template>

<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Warning,
} from '@element-plus/icons-vue'
import { useUserStore } from '@master/stores/user.store'
import { useOrderStore } from '@master/stores/order.store'
import { useProductStore } from '@master/stores/product.store'
import { useSupplierStore } from '@master/stores/supplier.store'

const storeUser = useUserStore()
const { dataGrid: dataGridUser } = storeToRefs(storeUser);

const storeSupplier = useSupplierStore()
const { dataGrid: dataGridSupplier } = storeToRefs(storeSupplier);

const storeProduct = useProductStore()
const { dataGrid: dataGridProduct } = storeToRefs(storeProduct);

const storeOrder = useOrderStore()
const { dataGrid: dataGridOrder, dateRange, chartData } = storeToRefs(storeOrder);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

onMounted(async () => {
  await storeUser.getList();
  await storeSupplier.getList();
  await storeProduct.getList();
  await storeOrder.getList();
  await storeOrder.getStatistical();
})

const handleChangeDateRange = async () => {
  await storeOrder.getStatistical();
}

</script>
<style>
.chart-container {
  position: relative;
  margin: auto;
  height: 50vh;
}

:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 10px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}

.el-statistic__number {
  font-size: 48px;
  color: white
}

.el-statistic__head div {
  color: white;
  display: inline-flex;
  align-items: center;
}
</style>