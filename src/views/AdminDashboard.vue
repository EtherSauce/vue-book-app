<script>
import { db } from '@/firebase/index.js';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      orders: [],
      loading: true,
      _unsub: null
    };
  },
  mounted() {
    const q = query(collection(db, 'orders'), orderBy('orderNumber', 'desc'));
    this._unsub = onSnapshot(q, snap => {
      this.orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      this.loading = false;
    }, err => {
      console.error('Admin orders snapshot error:', err);
      this.loading = false;
    });
  },
  beforeUnmount() {
    if (this._unsub) this._unsub();
  },
  methods: {
    formatTimestamp(ts) {
      if (!ts) return '';
      // serverTimestamp returns a Firestore Timestamp object; attempt to convert
      if (ts.toDate) return ts.toDate().toLocaleString();
      try {
        return new Date(ts.seconds * 1000).toLocaleString();
      } catch (e) {
        return String(ts);
      }
    }
  }
};
</script>

<template>
  <main class="container my-4">
    <h2>Admin Dashboard — Orders</h2>

    <div v-if="loading" class="text-muted">Loading orders…</div>

    <div v-else>
      <div v-if="!orders.length" class="text-muted">No orders found.</div>

      <div v-for="o in orders" :key="o.orderNumber" class="card mb-2 p-2">
        <div class="d-flex justify-content-between">
          <div>
            <strong>Order #{{ o.orderNumber }}</strong><br />
            <small class="text-muted">Placed: {{ formatTimestamp(o.createdAt) }}</small><br />
            <small class="text-muted">By: {{ o.userEmail || 'guest' }}</small>
          </div>
          <div class="text-end">
            <div>Status: <span class="badge bg-secondary">{{ o.status }}</span></div>
            <div class="mt-1">Total: ${{ (o.total || 0).toFixed(2) }}</div>
          </div>
        </div>

        <div class="mt-2">
          <ul class="mb-0">
            <li v-for="it in o.items" :key="it.id">{{ it.title }} ×{{ it.quantity }}</li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>