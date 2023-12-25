import { createApp } from 'vue'
import './main.css'
import App from './App.vue'
import { ID } from '../helpers/constants'

// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// import { createPinia } from 'pinia'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

const app = createApp(App)
// const pinia = createPinia()
// app.use(pinia.use(piniaPluginPersistedstate))
// app.use(ElementPlus)

const div = document.createElement('div')
div.id = ID
div.style.position = 'fixed'
div.style.zIndex = '9999999999'
div.setAttribute('contenteditable', 'false')
app.mount(div)


// 开发环境下直接挂载
if (process.env.NODE_ENV === 'development') {
  document.body.appendChild(div)
}


// 获取存储
chrome.storage.local.get(['visable'], function (item) {
  console.log('visable', item)
  if (item.visable) document.body.appendChild(div)
})

// 监听存储
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (changes['visable'].newValue) document.body.appendChild(div)
  else document.body.removeChild(div)
  console.log('changes', changes, namespace)
})
