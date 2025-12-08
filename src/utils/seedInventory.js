import { doc, setDoc } from 'firebase/firestore';
import inventory from '@/models/inventoryData.js';

/**
 * Dev-only seeder: writes each inventory item to Firestore under collection `inventory`.
 * Uses `item.id` as the document id when present (stringified), otherwise generates one.
 * Call this from a dev page or a node script running in a browser context.
 */
export default async function seedInventory() {
    const results = [];
    for (const item of inventory) {
        try {
            const id = item.id != null ? String(item.id) : undefined;
            const ref = id ? doc(db, 'inventory', id) : doc(db, 'inventory', String(Date.now()) + '_' + Math.random().toString(36).slice(2,8));
            // clone item to avoid unexpected Vue reactivity keys; remove any complex non-serializable props if needed
            const payload = { ...item };
            await setDoc(ref, payload, { merge: true });
            results.push({ id: ref.id, ok: true });
        } catch (e) {
            results.push({ id: item && item.id ? String(item.id) : null, ok: false, error: e.message || String(e) });
        }
    }
    return results;
}

// File: `src/utils/getInventory.js`
import { db } from '@/firebase/index.js';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Fetch inventory from Firestore `inventory` collection.
 * Returns an array of item objects.
 */
export async function getInventory() {
    const col = collection(db, 'inventory');
    const snap = await getDocs(col);
    return snap.docs.map(d => {
        const data = d.data() || {};
        // normalize id as number when original ids were numeric
        const numericId = Number(d.id);
        return { id: isNaN(numericId) ? d.id : numericId, ...data };
    });
}