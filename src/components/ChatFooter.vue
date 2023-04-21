<template>
    <el-row class="row-bg">
        <el-col :span="12" :offset="6">
            <el-input v-model="question" ref="questionInput" placeholder="提问" @keydown.enter="send"/>
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: "ChatFooter",
    data() {
        return {
            question: ""
        }
    },
    mounted() {
        this.$nextTick(() => {
            //自动聚焦提问框
            this.$refs.questionInput.focus()
        })
    },
    methods: {
        send() {
            this.$emit('send', {question: this.question})
            this.question = ""

        }
    }
}
</script>

<style scoped>

</style>