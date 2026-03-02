import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n/index.js'
import './styles/index.css'

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

const app = createApp(App).use(i18n)
app.mount('#app')

window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
