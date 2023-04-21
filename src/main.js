import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import 'element-plus/dist/index.css'
import '@/style/main.css'
import router from '@/plugins/router'  //导入路由规则
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const app = createApp(App)
app.use(ElementPlus)
    .use(router)
    .use(mavonEditor)
    .mount('#app')
