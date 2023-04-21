<script setup>
import LoginMenu from "@/components/LoginMenu.vue";
import RegisterForm from "@/components/RegisterForm.vue";
</script>
<template>
    <div>
        <div class="main-login">
            <LoginMenu/>
            <RegisterForm/>
        </div>
    </div>
</template>
<script>
import router from "@/plugins/router";

export default {
    provide: {
        sign: '1'
    },
    beforeCreate() {
        if (localStorage.getItem("token")) {
            router.push("/chat/ws")
        }
    }
}
</script>