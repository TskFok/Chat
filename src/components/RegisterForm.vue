<template>
    <div class="login-type">
        <el-row class="row-bg">
            <el-col :span="12" :offset="6">
                <el-input v-model="this.email" ref="emailInput" @keyup.enter="this.$refs['passwordInput'].focus()"
                          placeholder="邮箱"/>
            </el-col>
        </el-row>
        <el-row class="row-bg">
            <el-col :span="12" :offset="6">
                <el-input
                        v-model="this.password"
                        type="password"
                        placeholder="密码"
                        show-password
                        ref="passwordInput"
                        @keydown.enter="submit"
                />
            </el-col>
        </el-row>
        <el-row class="row-bg">
            <el-col :span="2" :offset="15">
                <el-button type="primary" @click="submit">
                    注册
                </el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>

import SendRequest from "@/plugins/axiosInstance";
import {ElNotification} from 'element-plus'

export default {
    name: "RegisterForm",
    data() {
        return {
            email: "",
            password: ""
        }
    },
    mounted() {
        this.$nextTick(() => {
            //自动聚焦提问框
            this.$refs.emailInput.focus()
        })
    },
    methods: {
        submit() {
            SendRequest({
                method: 'post',
                url: '/register',
                data: {
                    email: this.email,
                    password: this.password
                },
            }).then((resp) => {
                ElNotification({
                    title: "请求成功",
                    message: "注册成功,等待管理员审批",
                    type: 'success',
                })
            }).catch((err) => {
                ElNotification({
                    title: "请求失败",
                    message: err.response.data,
                    type: 'error',
                })
            });
        }
    }
}
</script>