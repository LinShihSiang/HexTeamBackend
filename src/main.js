import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import Router from './router'
import 'bootstrap'
import './assets/main.scss'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(Router)

app.mount('#app')
