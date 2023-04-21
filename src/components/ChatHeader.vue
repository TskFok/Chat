<template>
    <el-menu
            default-active="1"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
    >
        <el-menu-item index="1" disabled>Chat</el-menu-item>
        <el-sub-menu index="2">
            <template #title>接口类型</template>
            <el-menu-item index="2-1">
                ws接口
            </el-menu-item>
            <el-menu-item index="2-2">
                sse接口
            </el-menu-item>
            <el-menu-item index="2-3">
                stream接口
            </el-menu-item>
            <el-menu-item index="2-4">
                embedding测试(战锤40k)
            </el-menu-item>
        </el-sub-menu>
        <div class="flex-grow"/>
        <el-menu-item index="3" :ellipsis="false">退出</el-menu-item>
    </el-menu>
</template>

<script>
import router from "@/plugins/router";

export default {
    name: "ChatHeader",
    methods: {
        handleSelect(key, keyPath) {
            switch (key) {
                case "2-1":
                    router.push("/chat/ws")
                    break;
                case "2-2":
                    router.push("/chat/sse")
                    break;
                case "2-3":
                    router.push("/chat/stream")
                    break;
                case "2-4":
                    router.push("/chat/embedding")
                    break;
                case "3":
                    localStorage.removeItem("token")
                    router.push("/signIn")
                    break;
            }
        },
    }
}
</script>

<style scoped>

</style>