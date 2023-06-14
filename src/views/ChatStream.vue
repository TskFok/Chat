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
                    <ChatFooter @send="receiveSend" ref="footer"/>
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
import Setup from "@/components/Setup.vue";

export default {
    name: "ChatStream",
    components: {Setup, ChatHeader, ChatFooter, ChatAside},
    setup() {
        const childIt = ref()
        const footer = ref()
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
            footer.value.force()
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

            let url = import.meta.env.VITE_API + "/stream"
            let xmlHttp = new XMLHttpRequest();

            if (xmlHttp == null) {
                alert("Your browser does not support XMLHTTP.");
                return 0;
            }
            let xhr = xmlHttp;
            xhr.open('POST', url, true);
            // 如果需要像 HTML 表单那样 POST 数据，请使用 setRequestHeader() 来添加 HTTP 头。然后在 send() 方法中规定您希望发送的数据：
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("token", localStorage.getItem("token"));
            xhr.timeout = 40000 //设置超时时间40s
            xhr.send("question=" + encodeURIComponent(data.question) + "&setup=" + JSON.stringify(items.setup));

            let timer;

            timer = window.setInterval(function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    window.clearTimeout(timer);
                } else {
                    items.cInfo[items.cInfo.length - 1].value = xhr.responseText
                }
            }, 50);

            xhr.ontimeout = function (event) {
                window.clearTimeout(timer);
                console.log(event)
            }
        }

        function setup() {
            childSetup.value.hide(false)
        }

        function changeSetup(setup) {
            items.setup = setup
        }

        return {
            childIt,
            items,
            answerHeader,
            questionHeader,
            receiveSend,
            clear,
            footer,
            setup,
            childSetup,
            changeSetup
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