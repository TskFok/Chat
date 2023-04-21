<template>
    <router-link to="/signIn">
        <el-button type="info">请登录</el-button>
    </router-link>
</template>

<script>
import router from "@/plugins/router";

export default {
    name: "Home",
    beforeCreate() {
        if (!localStorage.getItem("token")) {
            router.push("/signIn")
        } else {
            router.push("/chat/ws")
        }
    }
}
</script>

<style scoped>

</style>