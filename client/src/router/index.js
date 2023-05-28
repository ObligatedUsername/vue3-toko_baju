import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },

    {
        path: '/store/:item',
        name: 'store',
        component: () => import('../views/DisplayView.vue')
    },

    {
        path: '/cart/:item',
        name: 'cart',
        component: () => import('../views/DisplayView.vue')
    },

    {
        path: '/dashboard-admin/:item',
        name: 'dashboard-admin',
        component: () => import('../views/DisplayView.vue')
    },

    {
        path: '/checkout',
        name: 'checkout',
        component: () => import('../views/CheckoutView.vue')
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
