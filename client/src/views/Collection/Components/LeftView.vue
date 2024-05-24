<script setup>
import { onMounted } from "vue";
import MaterialInput from "@/components/MaterialInput.vue";
import setMaterialInput from "@/assets/js/material-input";
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
import MaterialRadioBox from "@/components/MaterialRadioBox.vue";

onMounted(() => {
    setMaterialInput();
});
</script>
<template>
    <div class="position-sticky">
        <div class="card mb-4">
            <div class="card-header"
                style="border-width: 1px; display: flex; justify-content: space-between; align-items: center;">
                <h4 style="margin: 0;">Bộ lọc</h4>
                <a>Thiết lập lại</a>
            </div>
            <div class="card-body p-0">
                <div>
                    <div class="card-header p-2 bg-white">
                        <p class="m-0 h6">Khoảng giá</p>
                    </div>
                    <div class="p-2 collapse show">
                        <div class="form-control">
                            <MaterialInput class="input-group-outline"
                                :label="{ text: 'Tối thiểu', class: 'form-label' }" type="number" />
                        </div>
                        <div class="form-control">
                            <MaterialInput class="input-group-outline" :label="{ text: 'Tối đa', class: 'form-label' }"
                                type="number" />
                        </div>
                        <div class="form-control">
                            <MaterialButton variant="gradient" color="success" style="width: 100%;">Áp dụng
                            </MaterialButton>
                        </div>
                        <div class="form-control">
                            <MaterialRadioBox color="info" name="price">
                                Dưới 100.000 đ
                            </MaterialRadioBox>
                        </div>
                        <div class="form-control">
                            <MaterialRadioBox color="info" name="price">
                                100.000 đ - 300.000 đ
                            </MaterialRadioBox>
                        </div>
                        <div class="form-control">
                            <MaterialRadioBox color="info" name="price">
                                300.000 đ - 500.000 đ
                            </MaterialRadioBox>
                        </div>
                        <div class="form-control">
                            <MaterialRadioBox color="info" name="price">
                                Trên 500.000 đ
                            </MaterialRadioBox>
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
                                :label="{ text: 'Nhập tên thương hiệu', class: 'form-label' }" type="text" />
                        </div>
                        <ul class="list-group list-group-flush" style="height:200px;overflow:auto;">
                            <li class="list-group-item p-2 d-flex justify-content-between align-items-center">
                                <MaterialCheckbox color="info">
                                    Tất cả
                                </MaterialCheckbox>
                            </li>
                            <li class="list-group-item p-2 d-flex justify-content-between align-items-center">
                                <MaterialCheckbox color="info">
                                    Blackmores
                                </MaterialCheckbox>
                            </li>
                            <li class="list-group-item p-2 d-flex justify-content-between align-items-center">
                                <MaterialCheckbox color="info">
                                    GOD HEALTH
                                </MaterialCheckbox>
                            </li>
                            <li class="list-group-item p-2 d-flex justify-content-between align-items-center">
                                <MaterialCheckbox color="info">
                                    Abbott
                                </MaterialCheckbox>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
