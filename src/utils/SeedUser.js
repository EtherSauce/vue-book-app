// File: src/utils/SeedUser.js
import { auth, db } from '../firebase/index.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function generateCustomerId() {
    return 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

async function ensureUser(email, password, name, role, extra = {}) {
    let uid = null;
    try {
        const created = await createUserWithEmailAndPassword(auth, email, password);
        uid = created.user.uid;
    } catch (e) {
        // If user already exists, sign in to obtain uid
        if (e.code === 'auth/email-already-in-use' || /email.*in use/i.test(e.message || '')) {
            try {
                const signed = await signInWithEmailAndPassword(auth, email, password);
                uid = signed.user.uid;
            } catch (signErr) {
                // If sign-in fails (wrong password), return error info
                return { email, ok: false, error: `Existing user but sign-in failed: ${signErr.message}` };
            }
        } else {
            return { email, ok: false, error: e.message || String(e) };
        }
    }

    if (!uid) return { email, ok: false, error: 'Could not determine uid' };

    // determine a customerId but preserve any existing one
    try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        let customerId = (snap && snap.exists() && snap.data() && snap.data().customerId) ? snap.data().customerId : generateCustomerId();

        // create / merge Firestore user doc
        await setDoc(ref, {
            name,
            email,
            role,
            customerId,
            ...extra,
            seededAt: new Date().toISOString()
        }, { merge: true });

        // sign out so the app's auth state isn't left as the created user
        try { await signOut(auth); } catch (_) {}

        return { email, uid, ok: true, customerId };
    } catch (e) {
        return { email, uid, ok: false, error: e.message || String(e) };
    }
}

export async function seedSampleUsers() {
    const results = [];

    // Staff (lightweight admin flag) - not a real admin claim
    results.push(await ensureUser(
        'staff@gmail.com',
        'Password123!',
        'Staff User',
        'staff',
        { isStaff: true, note: 'Lightweight staff flag for UI gating only' }
    ));

    // Sample customer
    results.push(await ensureUser(
        'customer@gmail.com',
        'Password123!',
        'Sample Customer',
        'customer',
        { isStaff: false }
    ));

    return results;
}

export default seedSampleUsers;
