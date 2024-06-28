<script setup lang="ts">
/**
 * Dependencies injection library
 */
import axios from 'axios';
import { ref, onMounted, reactive } from "vue";
import BaseLayout from "../../layouts/sections/components/BaseLayout.vue";
import { useToast } from 'vue-toast-notification';
import type { FormInstance, FormRules } from 'element-plus'

/**
 * Variable define
 */
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const toast = useToast();
const defaultData = reactive<RuleForm>({
    _id: '',
    fullname: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    flgEmail: false,
    new_password: null,
    confirm_password: null,
});
const rules = reactive<FormRules<RuleForm>>({
    fullname: [
        {
            required: true,
            message: 'Vui lòng nhập họ và tên',
            trigger: 'blur',
        }
    ],
    email: [
        {
            required: true,
            message: 'Vui lòng nhập địa chỉ email',
            trigger: 'blur',
        },
        {
            type: 'email',
            message: 'Vui lòng nhập đúng địa chỉ email',
            trigger: ['blur', 'change'],
        },
    ],
    phone: [
        {
            required: true,
            message: 'Vui lòng nhập số điện thoại',
            trigger: 'blur',
        },
        {
            type: 'tel',
            message: 'Vui lòng nhập đúng số điện thoại',
            trigger: ['blur', 'change'],
        },
    ],
    address: [
        {
            required: true,
            message: 'Vui lòng nhập địa chỉ',
            trigger: 'blur',
        }
    ]
})

/**
 * Life circle vue js
 */
onMounted(async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) ?? {};
    Object.assign(defaultData, userInfo)
});

/**
 * Function
 */
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    if (defaultData.new_password != null || defaultData.confirm_password != null) {
        if (defaultData.new_password.length < 8) {
            toast.error("Vui lòng nhập mật khẩu ít nhất 8 kí tự");
            return;
        }
        if (defaultData.new_password != defaultData.confirm_password) {
            toast.error("Vui lòng nhập đúng mật khẩu xác nhận");
            return;
        }
    }
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            try {
                defaultData.password = defaultData.new_password
                const response = await axios.put(`${import.meta.env.VITE_API_URL}/users/${defaultData._id}`, defaultData);
                if (response.status == 200) {
                    const data = response.data.data
                    localStorage.setItem('userInfo', JSON.stringify(data))
                    toast.success("Cập nhật thông tin thành công");
                    resetForm(formEl)
                }
                else toast.error("Cập nhật thông tin không thành công");
            } catch (error) {
                toast.error(error.response.data.message);
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    dialogVisible.value = false
    if (!formEl) return
    formEl.resetFields()
}
</script>
<template>
    <BaseLayout title="Thông tin tài khoản" :breadcrumb="[
        { label: 'Trang chủ', route: '/' },
        { label: 'Thông tin tài khoản' },
    ]">
        <div id="app" class="container mt-4 mb-4" style="display: flex;">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <strong>THÔNG TIN TÀI KHOẢN</strong>
                    </div>
                    <div class="card-body">
                        <p class="card-text">Họ và tên: {{ defaultData.fullname }}</p>
                        <p class="card-text">Email: {{ defaultData.email }}</p>
                        <p class="card-text">Số điện thoại: {{ defaultData.phone }}</p>
                        <p class="card-text">Địa chỉ: {{ defaultData.address }}</p>
                        <a @click="dialogVisible = true" class="btn btn-primary" style="cursor: pointer;">
                            Chỉnh sửa thông tin
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-md-3"></div>
        </div>
        <el-dialog v-model="dialogVisible" title="Cập nhật thông tin" align-center>
            <el-form ref="ruleFormRef" :model="defaultData" label-position="top" :rules="rules">
                <el-form-item prop="fullname" label="Họ và tên">
                    <el-input v-model="defaultData.fullname" placeholder="Họ và tên" />
                </el-form-item>
                <el-form-item prop="email" label="Email">
                    <el-input v-model="defaultData.email" @change="defaultData.flgEmail = true" />
                </el-form-item>
                <el-form-item prop="phone" label="Số điện thoại">
                    <el-input v-model="defaultData.phone" />
                </el-form-item>
                <el-form-item prop="address" label="Địa chỉ">
                    <el-input v-model="defaultData.address" type="textarea" />
                </el-form-item>
                <el-form-item prop="new_password" label="Mật khẩu">
                    <el-input v-model="defaultData.new_password" type="password" />
                </el-form-item>
                <el-form-item prop="confirm_password" label="Xác nhận mật khẩu">
                    <el-input v-model="defaultData.confirm_password" type="password" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="resetForm(ruleFormRef)">Hủy</el-button>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">
                        Đồng ý
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </BaseLayout>
</template>