<template>
  <main class="container my-4">
    <h2>User Account</h2>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item" v-for="(t, i) in tabs" :key="t.key">
        <button
            class="nav-link"
            :class="{ active: active === t.key }"
            @click="active = t.key"
        >{{ t.label }}</button>
      </li>
    </ul>

    <div v-if="active === 'settings'">
      <account-settings
          :user="effectiveUser"
          @update-user="onUpdateUser"
      />
    </div>

    <div v-if="active === 'orders'">
      <div v-if="loadingOrders" class="text-muted">Loading orders…</div>
      <div v-else-if="loadError" class="text-danger">Error: {{ loadError }}</div>
      <order-history v-else :orders="orders" />
    </div>

    <div v-if="active === 'wishlist'">
      <wishlist :items="wishlist" @add-to-cart="$emit('add-to-cart', $event)" />
    </div>
  </main>
</template>

<script>
import AccountSettings from '@/components/AccountSettings.vue';
import OrderHistory from '@/components/OrderHistory.vue';
import Wishlist from '@/components/Wishlist.vue';
import { auth, db } from '@/firebase/index.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export default {
  name: 'UserAccount',
  components: { AccountSettings, OrderHistory, Wishlist },
  props: {
    user: { type: Object, default: null },
    wishlist: { type: Array, default: () => [] }
  },
  data() {
    return {
      tabs: [
        { key: 'settings', label: 'Account Settings' },
        { key: 'orders', label: 'Order History' },
        { key: 'wishlist', label: 'Wishlist' }
      ],
      active: 'settings',
      orders: [],
      loadingOrders: false,
      loadError: null,
      _unsubAuth: null
    };
  },
  computed: {
    effectiveUser() {
      // prefer passed-in prop, otherwise auth.currentUser
      return this.user || auth.currentUser || null;
    }
  },
  async mounted() {
    await this.loadOrders();

    // reload orders on auth changes (keeps UI in sync)
    this._unsubAuth = onAuthStateChanged(auth, async () => {
      await this.loadOrders();
    });
  },
  beforeUnmount() {
    if (this._unsubAuth) this._unsubAuth();
  },
  methods: {
    onUpdateUser(payload) {
      this.$emit('update-user', payload);
    },

    async loadOrders() {
      this.loadingOrders = true;
      this.loadError = null;
      this.orders = [];

      const curUser = this.effectiveUser;
      if (!curUser) {
        this.loadingOrders = false;
        return;
      }

      try {
        // attempt to fetch the users/{uid} doc to obtain customerId
        let customerId = null;
        try {
          const userRef = doc(db, 'users', curUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const ud = userSnap.data() || {};
            customerId = ud.customerId || null;
          }
        } catch (e) {
          // swallow — proceed with available identifiers
          console.warn('Failed to read users doc:', e);
        }

        const userEmail = curUser.email || null;
        const ordersCol = collection(db, 'orders');

        // build queries to cover userId, customerId, and userEmail
        const queries = [ query(ordersCol, where('userId', '==', curUser.uid), orderBy('createdAt', 'desc')) ];
        if (customerId) queries.push(query(ordersCol, where('customerId', '==', customerId), orderBy('createdAt', 'desc')));
        if (userEmail) queries.push(query(ordersCol, where('userEmail', '==', userEmail), orderBy('createdAt', 'desc')));

        const map = new Map();
        for (const q of queries) {
          try {
            const snap = await getDocs(q);
            snap.forEach(d => {
              if (!map.has(d.id)) {
                const data = d.data() || {};
                // normalize createdAt if it is a Firestore Timestamp
                let createdAtDate = null;
                if (data.createdAt && typeof data.createdAt.toDate === 'function') {
                  createdAtDate = data.createdAt.toDate();
                } else if (data.createdAt && data.createdAt.seconds) {
                  createdAtDate = new Date(data.createdAt.seconds * 1000);
                }
                map.set(d.id, {
                  id: d.id,
                  ...data,
                  createdAtDate,
                  createdAtDisplay: createdAtDate ? createdAtDate.toLocaleString() : (data.createdAt || '')
                });
              }
            });
          } catch (qerr) {
            // continue on individual query failure
            console.warn('Order query failed:', qerr);
          }
        }

        // convert to array, sort by createdAtDate (newest first), fallback to orderNumber
        this.orders = Array.from(map.values()).sort((a, b) => {
          const ta = a.createdAtDate ? a.createdAtDate.getTime() : (a.orderNumber || 0);
          const tb = b.createdAtDate ? b.createdAtDate.getTime() : (b.orderNumber || 0);
          return tb - ta;
        });
      } catch (e) {
        this.loadError = e.message || String(e);
        console.error('Failed loading orders:', e);
      } finally {
        this.loadingOrders = false;
      }
    }
  }
};
</script>

<style scoped>
/* Scoped styles for user account view */
</style>
