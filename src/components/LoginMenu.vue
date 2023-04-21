<template>
    <el-menu
            :default-active="signInfo"
            class="el-menu-demo"
            mode="horizontal"
            :ellipsis="false"
            @select="handleSelect"
    >
        <el-menu-item class="menu-item" index="0">
            <router-link class="menu-header" to="/SignIn">登陆</router-link>
        </el-menu-item>
        <el-menu-item class="menu-item" index="1">
            <router-link class="menu-header" to="/Register">注册</router-link>
        </el-menu-item>
    </el-menu>
</template>

<script>
export default {
    inject: ['sign'],
    data() {
        return {
            signInfo: this.sign
        }
    }, methods: {
        handleSelect(key, path) {
        }
    }
}
</script>

<style>
.flex-grow {
    flex-grow: 1;
}

.menu-item {
    width: 50%;
}

.menu-header {
    width: 100%;
    text-align: center
}
</style>
