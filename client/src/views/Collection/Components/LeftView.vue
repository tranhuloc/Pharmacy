<script setup lang="ts">
/**
 * Dependencies injection library
 */
import axios from "axios";
import { onMounted, ref, reactive } from "vue";
import MaterialInput from "@/components/MaterialInput.vue";
import setMaterialInput from "@/assets/js/material-input";
import MaterialButton from "@/components/MaterialButton.vue";
import { useToast } from 'vue-toast-notification';

/**
 * Variable define
 */
const emit = defineEmits(["setCondition"]);
const fromPrice = ref < any > ('')
const toPrice = ref < any > ('')
const checkAll = ref(false)
const isIndeterminate = ref(false)
const checkedSuppliers = ref([])
const suppliers = ref([])
const filteredSuppliers = ref([])
const inputValue = ref('');
const toast = useToast();

/**
 * Life circle vue js
 */
onMounted(async () => {
    setMaterialInput();
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/suppliers`);

    if (response && response.data && response.data.data) {
        const responseData = response.data.data;
        responseData.forEach((item: any) => {
            suppliers.value.push(item.supplier_name);
        });
        filteredSuppliers.value = suppliers.value
    } else {
        console.error('Invalid response data structure:', response);
    }
});

/**
 * Function
 */
const handleCheckAllChange = (val: any) => {
    checkedSuppliers.value = val ? suppliers.value : []
    isIndeterminate.value = false
}
const handleCheckedSuppliersChange = (value: any[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === suppliers.value.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < suppliers.value.length
}

const handleInputChange = () => {
    checkAll.value = false;
    isIndeterminate.value = false;
    checkedSuppliers.value = [];

    const flagSuppliers = [...suppliers.value];

    filteredSuppliers.value = flagSuppliers.filter(supplier =>
        supplier.toLowerCase().includes(inputValue.value.toLowerCase())
    );
}

const onApplyPrice = () => {
    if(fromPrice.value > toPrice.value){
        toast.error("Vui lòng nhập đúng khoảng giá");
        return;
    }
    emit('setCondition', fromPrice.value, toPrice.value, null)
}

const onApplySupplier = () => {
    emit('setCondition', null, null, checkedSuppliers.value)
}

const onReset = () => {
    checkAll.value = false
    isIndeterminate.value = false
    checkedSuppliers.value = []
    fromPrice.value = ''
    toPrice.value = ''
    emit('setCondition', null, null, null)
}
</script>
<template>
    <div class="position-sticky">
        <div class="card mb-4">
            <div class="card-header"
                style="border-width: 1px; display: flex; justify-content: space-between; align-items: center;">
                <h4 style="margin: 0;">Bộ lọc</h4>
                <a style="cursor: pointer;" @click="onReset">Thiết lập lại</a>
            </div>
            <div class="card-body p-0">
                <div>
                    <div class="card-header p-2 bg-white">
                        <p class="m-0 h6">Khoảng giá</p>
                    </div>
                    <div class="p-2 collapse show">
                        <div class="form-control">
                            <MaterialInput class="input-group-outline"
                                :label="{ text: 'Tối thiểu', class: 'form-label' }" type="number" v-model="fromPrice" />
                        </div>
                        <div class="form-control">
                            <MaterialInput class="input-group-outline" :label="{ text: 'Tối đa', class: 'form-label' }"
                                type="number" v-model="toPrice" />
                        </div>
                        <div class="form-control">
                            <MaterialButton variant="gradient" color="success" style="width: 100%;"
                                @click="onApplyPrice">Áp dụng
                            </MaterialButton>
                        </div>
                    </div>
                </div>
                <div class="card border-0 b-3">
                    <div class="card-header p-2 bg-white" data-toggle="collapse" data-target="#collapseExample2"
                        aria-expanded="false">
                        <p class="m-0 h6">Thương hiệu</p>
                    </div>
                    <div class="card-body p-0 collapse show" id="collapseExample2">
                        <div class="form-control p-2">
                            <MaterialInput class="input-group-outline"
                                :label="{ text: 'Nhập tên thương hiệu', class: 'form-label' }" type="text"
                                v-model="inputValue" @input="handleInputChange" />
                        </div>
                        <ul class="list-group list-group-flush" style="height:200px;overflow:auto;">
                            <li class="list-group-item p-2 d-flex justify-content-between align-items-center">
                                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
                                    @change="handleCheckAllChange">
                                    Tất cả
                                </el-checkbox>
                            </li>
                            <el-checkbox-group v-model="checkedSuppliers" @change="handleCheckedSuppliersChange">
                                <li v-for="supplier in filteredSuppliers" :key="supplier"
                                    class="list-group-item p-2 d-flex justify-content-between align-items-center">

                                    <el-checkbox :label="supplier" :value="supplier">
                                        {{ supplier }}
                                    </el-checkbox>
                                </li>
                            </el-checkbox-group>
                        </ul>
                    </div>
                    <div class="form-control p-2">
                        <MaterialButton variant="gradient" color="success" style="width: 100%;"
                            @click="onApplySupplier">Áp dụng
                        </MaterialButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
