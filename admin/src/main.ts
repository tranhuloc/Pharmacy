import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './modules/router'
import VcRegister from '@/components/commons/vc-register'

import { registerLayouts } from '@/layouts/_register'

// ===================== ELEMENT PLUS =========================
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/styles/main.scss'
import vi from 'element-plus/dist/locale/vi.js'

const app = createApp(App)

// ===================== BASE COMPONENT =========================
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
VcRegister.register(app)

// ===================== ENABLE STORE PINIA =====================
const pinia = createPinia()
app.use(pinia)

// ===================== ADD DIRECTIVE ===========================
app.use(router)
app.use(ElementPlus, {
  locale: vi,
})
registerLayouts(app)

app.mount('#app')