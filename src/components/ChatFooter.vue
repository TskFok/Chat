<template>
    <el-row class="row-bg">
        <el-col :span="12" :offset="6">
            <el-input v-model="question" autofocus ref="questionInput" placeholder="提问" @keydown.enter="send"/>
        </el-col>
    </el-row>
</template>

<script>
import {nextTick, ref, watch} from "vue";

export default {
    name: "ChatFooter",
    beforeCreate() {
    },
    setup(props, {emit}) {
        const question = ref("")
        const questionInput = ref()

        function send() {
            emit('send', {question: question.value})
            question.value = ""
            questionInput.value.focus()
        }

        return {
            question,
            questionInput,
            send,
        }
    },
}
</script>

<style scoped>

</style>