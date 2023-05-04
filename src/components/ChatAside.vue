<template>
    <el-col :span="22" :offset="2">
        <h5 class="mb-2">Custom colors</h5>
        <el-menu
                active-text-color="#ffd04b"
                class="el-menu-vertical-demo"
                default-active="2"
                @select="handleSelect"
        >
            <el-sub-menu index="1">
                <template #title>
                    <el-icon>
                        <ChatLineSquare/>
                    </el-icon>
                    <span>历史记录</span>
                </template>
                <p v-for="historyItem in this.historyList.info" :key="historyItem">
                    <el-menu-item :index="historyItem.id">{{ historyItem.content }}</el-menu-item>
                </p>
            </el-sub-menu>
            <el-menu-item index="2-d">
                <el-icon>
                    <Delete/>
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
import {reactive} from "vue";

export default {
    name: "ChatAside",
    setup(props, {emit}) {
        const historyList = reactive(
            {
                info: []
            }
        )

        function handleSelect(key) {
            if (key === '2-d') {
                SendRequest({
                    method: 'delete',
                    url: '/history',
                    headers: {
                        token: localStorage.getItem("token")
                    },
                }).then((resp) => {
                    historyList.info = []
                    emit('clear')
                }).catch((err) => {
                    console.log(err)
                });
            } else {
                for (let i = 0; i < historyList.info.length; i++) {
                    if (historyList.info[i].id === key) {
                        emit('send', {question: historyList.info[i].content})
                        break
                    }
                }
            }
        }

        function send(content) {
            emit('send', {question: content})
        }

        function addList(content) {
            for (let i = historyList.info.length; i > 0; i--) {
                historyList.info[i] = historyList.info[i - 1]
            }
            historyList.info[0] = {
                'content': content,
                'id': Math.random(),
            }
            historyList.info.splice(8, 10)
        }

        return {
            historyList,
            handleSelect,
            send,
            addList
        }
    },
    beforeCreate() {
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
                    this.historyList.info.push({
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

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 440px;
    max-height: 440px;
}
</style>