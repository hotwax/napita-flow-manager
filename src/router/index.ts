import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Settings from "@/views/Settings.vue"
import { useUserStore } from '@/store/user';
import 'vue-router'
import Login from "@/views/Login.vue"

// Defining types for the meta values
declare module 'vue-router' {
  interface RouteMeta {
    permissionId?: string;
  }
}

const loginGuard = (to: any, from: any, next: any) => {
  const userStore = useUserStore()
  if (!userStore.isAuthenticated) {
    next()
  } else {
    next("/")
  }
};
const authGuard = (to: any, from: any, next: any) => {
  const userStore = useUserStore()
  if (userStore.isAuthenticated) {
    next()
  } else {
    next("/login")
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/settings'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: loginGuard

  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    beforeEnter: authGuard
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
