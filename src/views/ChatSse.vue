<template>
    <el-container class="main">
        <el-header>
            <ChatHeader @setup="setup"/>
        </el-header>
        <el-container>
            <el-aside>
                <ChatAside @clear="clear" @send="receiveSend" ref="childIt"/>
            </el-aside>
            <el-container>
                <el-main>
                    <Setup @changeSetup="changeSetup" ref="childSetup"/>
                    <el-scrollbar max-height="580px" style="background-color: white">
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
                    <ChatFooter @send="receiveSend" ref="footer"/>
                </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
import ChatFooter from "@/components/ChatFooter.vue";
import {EventSourcePolyfill} from 'event-source-polyfill';
import router from "@/plugins/router";
import {ElNotification} from 'element-plus'
import answerHeaderImg from "@/assets/3.gif";
import questionHeaderImg from "@/assets/2.gif";
import ChatHeader from "@/components/ChatHeader.vue";
import ChatAside from "@/components/ChatAside.vue";
import {onMounted, reactive, ref} from "vue";
import Setup from "@/components/Setup.vue";

export default {
    name: "ChatSse",
    components: {Setup, ChatAside, ChatHeader, ChatFooter},
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
    setup() {
        const items = reactive({
            cInfo: [
                {
                    "value": "你好👋,你想问啥",
                    "type": "answer"
                }
            ],
            setup: reactive({
                token: 400,
                temperature: 0.6,//随机性,越大越随机0-1
                presence_penalty: 0.6,//话题新鲜度,越大越新鲜-2-2
                history_num: 5,//附带历史记录数
            })
        })

        const childSetup = ref()
        const answerHeader = answerHeaderImg
        const questionHeader = questionHeaderImg
        const childIt = ref()
        const footer = ref()

        function clear() {
            items.cInfo = [
                {
                    "value": "你好👋,你想问啥",
                    "type": "answer"
                }
            ]
            footer.value.force()
        }

        function receiveSend(data) {
            if (data.question === undefined || data.question === "") {
                alert("请输入提问")

                return
            }

            childIt.value.addList(data.question)

            items.cInfo.push({
                "value": data.question,
                "type": "question"
            })

            items.cInfo.push({
                "value": "",
                "type": "answer"
            })

            let token = localStorage.getItem("token")

            const stream = new EventSourcePolyfill(import.meta.env.VITE_API + "/sse?question=" + data.question + "&setup=" + JSON.stringify(items.setup), {
                headers: {
                    'token': token
                }
            });

            stream.addEventListener("message", function (e) {
                if (e.data === "<<emptystring>>") {
                    items.cInfo[items.cInfo.length - 1].value += " "
                } else {
                    items.cInfo[items.cInfo.length - 1].value += e.data
                }
            });
            stream.addEventListener("stop", function (e) {
                stream.close()
            });
            stream.onerror = function (event) {
                if (event.status === 401) {
                    ElNotification({
                        title: "登陆失效",
                        message: "请重新登陆",
                        type: 'error',
                    })
                    router.push("/signIn")
                    localStorage.removeItem("token")
                }
                stream.close()
            }

            footer.value.force()
        }

        function setup() {
            childSetup.value.hide(false)
        }

        function changeSetup(setup) {
            items.setup = setup
        }

        return {
            items,
            answerHeader,
            questionHeader,
            receiveSend,
            clear,
            childIt,
            footer,
            setup,
            childSetup,
            changeSetup
        }
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