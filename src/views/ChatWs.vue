<template>
    <el-container class="main">
        <el-header>
            <ChatHeader/>
        </el-header>
        <el-container>
            <el-aside>
                <ChatAside @send="receiveSend" ref="childIt"/>
            </el-aside>
            <el-container>
                <el-main>
                    <el-scrollbar height="580px" style="background-color: white">
                        <p v-for="item in this.items" :key="item">
                            <el-row>
                                <el-col :span="4" class="radius">
                                    <template v-if="item.type==='question'">
                                        <el-avatar
                                                :src="questionHeader"
                                        />
                                    </template>
                                    <template v-else>
                                        <el-avatar
                                                :src="answerHeader"
                                        />
                                    </template>
                                </el-col>
                                <template v-if="item.type==='question'">
                                    <el-col :span="20" class="radius">
                                        <div v-html="item.value"/>
                                    </el-col>
                                </template>
                                <template v-else>
                                    <el-col :span="20" class="radius">
                                        <mavon-editor style="min-height: 50px"
                                                      defaultOpen="preview"
                                                      placeholder="开始接收"
                                                      :toolbarsFlag="false"
                                                      :editable="false"
                                                      :ishljs="true"
                                                      :subfield="false"
                                                      :boxShadow="false"
                                                      v-model="item.value"/>
                                    </el-col>
                                </template>
                            </el-row>
                        </p>
                    </el-scrollbar>
                </el-main>
                <el-footer>
                    <ChatFooter @send="receiveSend"/>
                </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
import ChatFooter from "@/components/ChatFooter.vue";
import 'github-markdown-css/github-markdown.css'
import router from "@/plugins/router";
import {ElNotification} from 'element-plus'
import answerHeaderImg from "@/assets/3.gif"
import questionHeaderImg from "@/assets/2.gif"
import ChatHeader from "@/components/ChatHeader.vue";
import ChatAside from "@/components/ChatAside.vue";

export default {
    name: "ChatWs",
    components: {ChatAside, ChatHeader, ChatFooter},
    data() {
        return {
            items: [
                {
                    "value": "你好👋,你想问啥",
                    "type": "answer"
                }
            ],
            answerHeader: answerHeaderImg,
            questionHeader: questionHeaderImg
        }
    },
    beforeCreate() {
        if (!localStorage.getItem("token")) {
            ElNotification({
                title: "登陆失效",
                message: "请重新登陆",
                type: 'error',
            })
            router.push("/signIn")
        }
    },
    mounted() {
        let rand = Math.round(Math.random() * 100000 + 100000);
        let token = localStorage.getItem("token")
        this.ws = new WebSocket(
            'wss://' + import.meta.env.VITE_BASIC_API + '/ws/gpt/channel-' + rand, [token]
        );

        this.ws.onopen = function (e) {
            console.log(e)
        }

        let items = this.items
        this.ws.onmessage = function (e) {
            if (e.data !== "<<stop>>") {
                items[items.length - 1].value += e.data
            }
        };
        this.ws.onclose = function (e) {
            if (e.code === 8888) {
                ElNotification({
                    title: "登陆失败",
                    message: "请重新登陆",
                    type: 'error',
                })
                router.push("/signIn")
                localStorage.removeItem("token")
            }
        };
        this.ws.onerror = function (e) {
            ElNotification({
                title: "ws连接失败",
                message: "请刷新重试",
                type: 'error',
            })
        }
    },
    methods: {
        receiveSend(e) {
            this.$refs.childIt.addList(e.question)

            this.items.push({
                "value": e.question,
                "type": "question"
            })

            this.items.push({
                "value": "",
                "type": "answer"
            })
            this.ws.send(JSON.stringify(e))
        }
    }
}
</script>

<style scoped>
.q-content {
    text-align: center;
}

.radius {
    height: auto;
    width: 70%;
    border-bottom: 1px solid var(--el-border-color);
    border-radius: 0;
}

.el-col {
    padding-bottom: 20px;
}

.el-avatar {
    margin-left: 35%;
}
</style>