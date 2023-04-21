<template>
    <div class="login-type">
        <el-row class="row-bg">
            <el-col :span="12" :offset="6">
                <el-input v-model="this.email" ref="emailInput" @keyup.enter="this.$refs['passwordInput'].focus()" placeholder="邮箱"/>
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
                <el-button type="primary" @click="submit">登陆</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import SendRequest from "@/plugins/axiosInstance";
import {ElNotification} from 'element-plus'
import router from "@/plugins/router";

export default {
    name: "SignInForm",
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
                url: '/login',
                data: {
                    email: this.email,
                    password: this.password
                },
            }).then((resp) => {
                localStorage.setItem("token", resp.data)
                ElNotification({
                    title: "请求成功",
                    message: "登陆成功",
                    type: 'success',
                })
                //跳转页面
                router.push("/chat/ws")
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
