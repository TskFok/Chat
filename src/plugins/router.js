import {createRouter, createWebHashHistory} from 'vue-router'
import Register from "@/views/Register.vue";
import SignIn from "@/views/SignIn.vue";
import ChatSse from "@/views/ChatSse.vue";
import chatWs from "@/views/ChatWs.vue";
import Home from "@/views/Home.vue";
import ChatEmbedding from "@/views/ChatEmbedding.vue";
import ChatStream from "@/views/ChatStream.vue";
import ChatVicuna from "@/views/ChatVicuna.vue";

//路由数组
const routes = [
    {
        path: "/",
        name: "home",
        component: Home,
        children: []
    }, {
        path: "/register",
        name: "login",
        component: Register,
        children: []
    }, {
        path: "/signin",
        name: "signin",
        component: SignIn,
        children: []
    }, {
        path: "/chat/ws",
        name: "chat-ws",
        component: chatWs,
        children: []
    }, {
        path: "/chat/sse",
        name: "chat-sse",
        component: ChatSse,
        children: []
    }, {
        path: "/chat/embedding",
        name: "chat-embedding",
        component: ChatEmbedding,
        children: []
    }, {
        path: "/chat/vicuna",
        name: "chat-vicuna",
        component: ChatVicuna,
        children: []
    }, {
        path: "/chat/stream",
        name: "chat-stream",
        component: ChatStream,
        children: []
    }
]

//路由对象
const router = createRouter({
    history: createWebHashHistory(),
    routes //上面的路由数组
})

//导出路由对象，在main.js中引用
export default router