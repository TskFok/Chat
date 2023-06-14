<template>
    <el-drawer
            ref="drawerRef"
            v-model="dialog"
            title="设置"
            :before-close="handleClose"
            direction="ltr"
            class="demo-drawer"
    >
        <div class="demo-drawer__content">
            <el-form :model="form">
                <el-form-item label="token" :label-width="80">
                    <el-slider v-model="form.token" show-input :max="4096"/>
                </el-form-item>
                <el-form-item label="随机性" :label-width="80">
                    <el-slider v-model="form.temperature" show-input :step="0.1" :max="1"/>
                </el-form-item>
                <el-form-item label="新鲜度" :label-width="80">
                    <el-slider v-model="form.presence_penalty" show-input :step="0.1" :min="-2" :max="2"/>
                </el-form-item>
                <el-form-item label="上下文" :label-width="80">
                    <el-slider v-model="form.history_num" show-input :max="10"/>
                </el-form-item>
            </el-form>
        </div>
    </el-drawer>
</template>

<script>
import {reactive, ref} from "vue";
import {ElMessageBox} from "element-plus";

export default {
    name: "Setup",
    setup(props, {emit}) {
        const dialog = ref()

        const form = reactive({
            token: 400,
            temperature: 0.6,//随机性,越大越随机0-1
            presence_penalty: 0.6,//话题新鲜度,越大越新鲜-2-2
            history_num: 5,//附带历史记录数
        })

        function handleClose() {
            emit("changeSetup", form)
            dialog.value = false
        }


        function hide(isHide) {
            dialog.value = !isHide
        }

        return {
            dialog,
            hide,
            handleClose,
            form,
        }
    }
}
</script>

<style scoped>

</style>