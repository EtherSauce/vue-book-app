import { db } from '@/firebase/index.js';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

/**
 * Fetch inventory once from Firestore `inventory` collection.
 * Returns array of plain objects with numeric id where appropriate.
 */
export async function fetchInventory() {
    const col = collection(db, 'inventory');
    const snap = await getDocs(col);
    return snap.docs.map(d => {
        const data = d.data() || {};
        const numericId = Number(d.id);
        return { id: isNaN(numericId) ? d.id : numericId, ...data };
    });
}

/**
 * Subscribe to inventory changes (real-time). Returns unsubscribe function.
 * Handler is called with the normalized array of items on every update.
 */
export function subscribeInventory(handler) {
    const col = collection(db, 'inventory');
    const unsub = onSnapshot(col, (snap) => {
        const items = snap.docs.map(d => {
            const data = d.data() || {};
            const numericId = Number(d.id);
            return { id: isNaN(numericId) ? d.id : numericId, ...data };
        });
        handler(items);
    }, (err) => {
        console.error('inventory subscription error', err);
        handler([]); // surface empty on error
    });
    return unsub;
}

export default { fetchInventory, subscribeInventory };