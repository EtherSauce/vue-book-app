import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Cart from '../views/Cart.vue';
import Checkout from '../views/Checkout.vue';
import UserAccount from '@/views/UserAccount.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/cart', name: 'Cart', component: Cart },
    { path: '/checkout', name: 'Checkout', component: Checkout },
    { path: '/account', name: 'Account', component: UserAccount, meta: { requiresAuth: true } },
    { path: '/admin', name: 'Admin', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;