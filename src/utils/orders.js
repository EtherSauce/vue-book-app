import { db } from '@/firebase/index.js';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { auth } from '@/firebase/index.js';

export async function createOrder(orderData) {
    const counterRef = doc(db, 'counters', 'orders');

    const assigned = await runTransaction(db, async (tx) => {
        // Read counter first
        const counterSnap = await tx.get(counterRef);
        let nextId = 1;
        if (!counterSnap.exists()) {
            nextId = 1;
        } else {
            const data = counterSnap.data() || {};
            nextId = Number(data.nextOrderId) || 1;
        }

        // Determine uid (prefer explicit orderData.userId)
        const uid = orderData.userId || (auth.currentUser && auth.currentUser.uid) || null;

        // Read the user doc (if any) BEFORE performing any writes
        let customerId = null;
        if (uid) {
            try {
                const userRef = doc(db, 'users', uid);
                const userSnap = await tx.get(userRef);
                if (userSnap.exists()) {
                    const ud = userSnap.data() || {};
                    customerId = ud.customerId || null;
                }
            } catch (e) {
                // ignore read failure; customerId remains null
            }
        }

        // Now perform writes (after all reads)
        if (!counterSnap.exists()) {
            // initialize so next time will be nextId + 1 (we set 2 when nextId is 1)
            tx.set(counterRef, { nextOrderId: nextId + 1 });
        } else {
            tx.update(counterRef, { nextOrderId: nextId + 1 });
        }

        const orderRef = doc(db, 'orders', String(nextId));
        const payload = {
            ...orderData,
            userId: uid,
            customerId: customerId,
            userEmail: orderData.userEmail || (auth.currentUser && auth.currentUser.email) || null,
            orderNumber: nextId,
            status: orderData.status || 'placed',
            createdAt: serverTimestamp()
        };

        tx.set(orderRef, payload);
        return nextId;
    });

    return assigned;
}

export default createOrder;