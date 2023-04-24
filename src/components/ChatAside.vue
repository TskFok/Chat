<template>
    <el-col :span="22" :offset="2">
        <h5 class="mb-2">Custom colors</h5>
        <el-menu
                active-text-color="#ffd04b"
                background-color="#545c64"
                class="el-menu-vertical-demo"
                default-active="2"
                text-color="#fff"
                @select="handleSelect"
        >
            <el-sub-menu index="1">
                <template #title>
                    <el-icon>
                        <location/>
                    </el-icon>
                    <span>历史记录</span>
                </template>
                <p v-for="historyItem in this.historyList" :key="historyItem">
                    <el-menu-item :index="historyItem.id">{{ historyItem.content }}</el-menu-item>
                </p>
            </el-sub-menu>
            <el-menu-item index="2-d">
                <el-icon>
                    <icon-menu/>
                </el-icon>
                <span>清除历史记录</span>
            </el-menu-item>
        </el-menu>
    </el-col>
</template>

<script>
import SendRequest from "@/plugins/axiosInstance";
import {ElNotification} from "element-plus";
import router from "@/plugins/router";

export default {
    name: "ChatAside",
    data() {
        return {
            historyList: []
        }
    },
    methods: {
        handleSelect(key) {
            if (key === '2-d') {
                SendRequest({
                    method: 'delete',
                    url: '/history',
                    headers: {
                        token: localStorage.getItem("token")
                    },
                }).then((resp) => {
                    this.historyList = []
                }).catch((err) => {
                    console.log(err)
                });
            } else {
                for (let i = 0; i < this.historyList.length; i++) {
                    if (this.historyList[i].id === key) {
                        this.send(this.historyList[i].content)
                        break
                    }
                }
            }
        },
        send(content) {
            this.$emit('send', {question: content})
        },
        addList(content) {
            for (let i = this.historyList.length; i > 0; i--) {
                this.historyList[i] = this.historyList[i - 1]
            }
            this.historyList[0] = {
                'content': content,
                'id': Math.random(),
            }
            this.historyList.splice(8, 10)
        }
    },
    mounted() {
        SendRequest({
            method: 'get',
            url: '/history',
            headers: {
                token: localStorage.getItem("token")
            },
        }).then((resp) => {
            let data = resp.data
            for (let i = 0; i < data.length; i++) {
                if (data[i] != null) {
                    this.historyList.push({
                        'content': data[i].Content,
                        'id': data[i].Id,
                    })
                }
            }
        }).catch((err) => {
            if (err.response.status === 401) {
                ElNotification({
                    title: "登陆失败",
                    message: "请重新登陆",
                    type: 'error',
                })
                router.push("/signIn")
                localStorage.removeItem("token")
            }
        });
    }
}
</script>

<style scoped>
.el-col {
    margin-top: -38px;
}
</style>