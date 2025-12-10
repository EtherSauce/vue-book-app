import { db } from '@/firebase/index.js';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { auth } from '@/firebase/index.js';

function generateGuestCustomerId() {
    return 'g_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

/**
 * Create an order in Firestore that works for signed-in users and guests.
 * - If a firebase user is present (passed in or auth.currentUser), attempts to read users/{uid}.customerId.
 * - If no signed-in user, generates a guest customerId.
 * - Writes order with fields: items, total, userId (nullable), customerId, userEmail, shipping, payment, metadata, status, createdAt
 */
export async function createOrder({ items = [], total = 0, user = null, userEmail = null, shipping = null, payment = null, metadata = {} } = {}) {
    const firebaseUser = user || auth.currentUser || null;
    const userId = firebaseUser ? firebaseUser.uid : null;
    let customerId = null;

    if (userId) {
        try {
            const uref = doc(db, 'users', userId);
            const snap = await getDoc(uref);
            if (snap.exists()) {
                const ud = snap.data() || {};
                if (ud.customerId) customerId = ud.customerId;
            }
        } catch (e) {
            // swallow and continue
            console.warn('Could not read users doc for customerId:', e);
        }
    }

    if (!customerId && !userId) {
        customerId = generateGuestCustomerId();
    }

    const payload = {
        items: items.map(it => ({
            id: it.id,
            title: it.title,
            price: Number(it.price || 0),
            quantity: Number(it.quantity || it.qty || 1)
        })),
        total: Number(total || 0),
        userId: userId || null,
        customerId: customerId || null,
        userEmail: userEmail || (firebaseUser && firebaseUser.email) || null,
        shipping: shipping || null,
        payment: payment || null,
        metadata: metadata || {},
        status: 'pending',
        createdAt: serverTimestamp()
    };

    const ref = await addDoc(collection(db, 'orders'), payload);

    return {
        id: ref.id,
        customerId: customerId || null,
        userId: userId || null,
        userEmail: payload.userEmail,
        total: payload.total,
        items: payload.items,
        createdAtLocal: new Date().toISOString()
    };
}

export default createOrder;