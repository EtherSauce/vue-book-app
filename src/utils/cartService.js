import { auth, db } from '@/firebase/index.js';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

/*
  Cart shape: { items: [ { id, title, price, quantity, ... } ], updatedAt: ISOString }
  Guest cart stored in localStorage under key 'guest_cart'
  User cart stored in Firestore at 'carts/{uid}'
*/

const GUEST_KEY = 'guest_cart';

function readGuestCart() {
    try {
        const raw = localStorage.getItem(GUEST_KEY);
        return raw ? JSON.parse(raw) : { items: [], updatedAt: new Date().toISOString() };
    } catch (e) {
        return { items: [], updatedAt: new Date().toISOString() };
    }
}

function writeGuestCart(cart) {
    try {
        localStorage.setItem(GUEST_KEY, JSON.stringify(cart));
    } catch (e) { /* ignore */ }
}

function clearGuestCart() {
    try { localStorage.removeItem(GUEST_KEY); } catch (e) {}
}

async function readUserCart(uid) {
    if (!uid) return { items: [], updatedAt: new Date().toISOString() };
    try {
        const snap = await getDoc(doc(db, 'carts', uid));
        if (snap.exists()) return snap.data();
    } catch (e) { /* swallow */ }
    return { items: [], updatedAt: new Date().toISOString() };
}

async function writeUserCart(uid, cart) {
    if (!uid) return;
    try {
        await setDoc(doc(db, 'carts', uid), {
            items: cart.items || [],
            updatedAt: new Date().toISOString()
        }, { merge: true });
    } catch (e) { /* swallow */ }
}

/* Merge two carts by item id — sums quantities */
function mergeCarts(baseCart, incomingCart) {
    const map = new Map();
    (baseCart.items || []).forEach(it => map.set(it.id, Object.assign({}, it)));
    (incomingCart.items || []).forEach(it => {
        if (map.has(it.id)) map.get(it.id).quantity = (map.get(it.id).quantity || 0) + (it.quantity || 0);
        else map.set(it.id, Object.assign({}, it));
    });
    return { items: Array.from(map.values()), updatedAt: new Date().toISOString() };
}

/* Public API */
export default {
    /* load current effective cart (user cart if signed in, else guest) */
    async loadCart() {
        const user = auth.currentUser;
        if (user) {
            const ucart = await readUserCart(user.uid);
            return ucart || { items: [], updatedAt: new Date().toISOString() };
        }
        return readGuestCart();
    },

    /* save cart to correct place depending on auth state */
    async saveCart(cart) {
        const user = auth.currentUser;
        if (user) {
            await writeUserCart(user.uid, cart);
        } else {
            writeGuestCart(cart);
        }
    },

    /* clear both guest and user cart (useful on explicit empty) */
    async clearAll() {
        clearGuestCart();
        const user = auth.currentUser;
        if (user) {
            await writeUserCart(user.uid, { items: [], updatedAt: new Date().toISOString() });
        }
    },

    /* on login: merge guest cart into user cart, persist, and clear guest */
    async mergeGuestIntoUser() {
        const user = auth.currentUser;
        if (!user) return;
        const guest = readGuestCart();
        const userCart = await readUserCart(user.uid);
        const merged = mergeCarts(userCart, guest);
        await writeUserCart(user.uid, merged);
        clearGuestCart();
        return merged;
    },

    /* subscribe to realtime updates for the signed-in user's cart; returns unsubscribe fn.
       callback will be invoked with the cart object. For guests, returns a local-storage polling stub (no-op) */
    subscribeToUserCart(callback) {
        const user = auth.currentUser;
        if (!user) {
            // For guests, just call back once with current guest cart
            callback(readGuestCart());
            return () => {};
        }
        const ref = doc(db, 'carts', user.uid);
        const unsub = onSnapshot(ref, snap => {
            if (!snap.exists()) callback({ items: [], updatedAt: new Date().toISOString() });
            else callback(snap.data());
        }, () => {
            // on error, fallback to single read
            readUserCart(user.uid).then(c => callback(c));
        });
        return unsub;
    },

    // handy helper to create minimal empty cart
    emptyCart() {
        return { items: [], updatedAt: new Date().toISOString() };
    }
};
