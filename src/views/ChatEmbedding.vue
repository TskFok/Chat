<template>
    <el-container class="main">
        <el-header>
            <ChatHeader/>
        </el-header>
        <el-container>
            <el-aside>
                <ChatAside @clear="clear" @send="receiveSend" ref="childIt"/>
            </el-aside>
            <el-container>
                <el-main>
                    <el-scrollbar height="580px" style="background-color: white">
                        <p v-for="item in this.items.cInfo" :key="item">
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
import ChatAside from "@/components/ChatAside.vue";
import ChatFooter from "@/components/ChatFooter.vue";
import ChatHeader from "@/components/ChatHeader.vue";
import answerHeaderImg from "@/assets/3.gif";
import questionHeaderImg from "@/assets/2.gif";
import {ElNotification} from "element-plus";
import router from "@/plugins/router";
import {reactive, ref} from "vue";

export default {
    name: "ChatEmbedding",
    components: {ChatAside, ChatHeader, ChatFooter},
    setup() {
        const childIt = ref()
        let close = ref(false)
        let waiting = ref("")

        let items = reactive({
            cInfo: [
                {
                    "value": "你好👋,你想问啥",
                    "type": "answer"
                }
            ]
        })

        let answerHeader = answerHeaderImg
        let questionHeader = questionHeaderImg
        let ws = ref()

        function reset() {
            let rand = Math.round(Math.random() * 100000 + 100000);
            let token = localStorage.getItem("token")
            ws = new WebSocket(
                'wss://' + import.meta.env.VITE_BASIC_API + '/ws/me/channel-' + rand, [token]
            );

            ws.onopen = function (e) {
                close.value = false

                if (waiting.value !== "") {
                    ws.send(waiting.value)
                    waiting.value = ""
                }
            }

            ws.onmessage = function (e) {
                if (e.data !== "<<stop>>") {
                    items.cInfo[items.cInfo.length - 1].value += e.data
                }
            };
            ws.onclose = function (e) {
                close.value = true
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
            ws.onerror = function (e) {
                close.value = true
                ElNotification({
                    title: "ws连接失败",
                    message: "请刷新重试",
                    type: 'error',
                })
            }
        }

        function receiveSend(e) {
            childIt.value.addList(e.question)

            items.cInfo.push({
                "value": e.question,
                "type": "question"
            })

            items.cInfo.push({
                "value": "",
                "type": "answer"
            })

            if (close.value) {
                reset()

                waiting.value = JSON.stringify(e)
            } else {
                ws.send(JSON.stringify(e))
            }
        }

        function clear() {
            items.cInfo = [
                {
                    "value": "你好👋,你想问啥",
                    "type": "answer"
                }
            ]
        }

        return {
            reset,
            receiveSend,
            answerHeader,
            questionHeader,
            childIt,
            items,
            clear
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

        this.reset()
    },
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