import { db } from '@/firebase/index.js';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Fetch inventory from Firestore `inventory` collection.
 * Returns an array of item objects with numeric ids when appropriate.
 */
export async function getInventory() {
    const col = collection(db, 'inventory');
    const snap = await getDocs(col);
    return snap.docs.map(d => {
        const data = d.data() || {};
        const numericId = Number(d.id);
        return { id: isNaN(numericId) ? d.id : numericId, ...data };
    });
}
