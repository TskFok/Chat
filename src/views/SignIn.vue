<script setup>
import LoginMenu from "@/components/LoginMenu.vue";
import SignInForm from "@/components/SignInForm.vue";
</script>
<template>
    <div>
        <div class="main-login">
            <LoginMenu/>
            <SignInForm/>
        </div>
    </div>
</template>
<script>
import router from "@/plugins/router";

export default {
    provide: {
        sign: '0'
    },
    beforeCreate() {
        if (localStorage.getItem("token")) {
            router.push("/chat/ws")
        }
    }
}
</script>

