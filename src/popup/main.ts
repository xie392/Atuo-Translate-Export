import { createApp } from 'vue'
import App from './App.vue'
import './main.css'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia.use(piniaPluginPersistedstate))
app.mount('#app')


