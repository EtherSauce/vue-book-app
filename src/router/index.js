import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Cart from '../views/Cart.vue';
import Checkout from '../views/Checkout.vue';
import UserAccount from '@/views/UserAccount.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import SeedUsers from '../views/SeedUsers.vue'; // new dev page

// Firebase imports for auth & checking Firestore user role
import { auth, db } from '@/firebase/index.js';
import { doc, getDoc } from 'firebase/firestore';

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/cart', name: 'Cart', component: Cart },
    { path: '/checkout', name: 'Checkout', component: Checkout },
    { path: '/account', name: 'Account', component: UserAccount, meta: { requiresAuth: true } },
    { path: '/admin', name: 'Admin', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },

    // Dev-only seeder (remove or protect for production)
    { path: '/seed-users', name: 'SeedUsers', component: SeedUsers }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Helper to fetch Firestore user doc (returns plain object or null)
async function getUserDoc(uid) {
    if (!uid) return null;
    try {
        const snap = await getDoc(doc(db, 'users', uid));
        return snap.exists() ? snap.data() : null;
    } catch (e) {
        // swallow errors and treat as no doc
        return null;
    }
}

// Global guard: enforce auth and admin routing, redirect staff from Account -> Admin
router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(r => r.meta && r.meta.requiresAuth);
    const requiresAdmin = to.matched.some(r => r.meta && r.meta.requiresAdmin);

    const firebaseUser = auth.currentUser;

    if (requiresAuth && !firebaseUser) {
        // not signed in -> redirect to Home (or a login route if available)
        return next({ name: 'Home' });
    }

    if (firebaseUser) {
        const userDoc = await getUserDoc(firebaseUser.uid);
        const isStaff = (userDoc && (userDoc.role === 'staff' || userDoc.isStaff === true));

        // if route requires admin but user is not staff -> block
        if (requiresAdmin && !isStaff) {
            return next({ name: 'Home' });
        }

        // if user is staff and is trying to open the regular Account page, redirect to Admin
        if (isStaff && to.name === 'Account') {
            return next({ name: 'Admin' });
        }
    }

    // otherwise allow navigation
    return next();
});

export default router;
