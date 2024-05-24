import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@master/views/static/DashboardView.vue'
import NotFoundView from '@master/views/static/NotFoundView.vue'
import master from '@master/routers/index.master.router'
import auth from '@auth/routers/index.auth.router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ======================= STATIC PAGE =========================
    {
      path: '/404',
      name: 'NotFound',
      component: NotFoundView,
    },
    {
      path: '/',
      name: 'Dashboard',
      component: DashboardView,
    },
    ...master,
    ...auth,
  ],
})

export default router
