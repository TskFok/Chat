<script setup>
import LoginMenu from "@/components/LoginMenu.vue";
import SignInForm from "@/components/SignInForm.vue";
</script>
<template>
    <div>
        <div class="main main-login">
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

<style scoped>
.main-login {
    margin-left: 33.5%;
    margin-top: 15%;
    border-radius: 4px;
    border: 1px solid;
    height: 300px;
    width: 400px;
    background-color: aliceblue;
}

</style>