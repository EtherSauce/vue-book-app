<script>
import { db } from '@/firebase/index.js';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      activeTab: 'orders', // 'orders' | 'inventory'
      // Orders state
      orders: [],
      loadingOrders: false,
      ordersError: null,
      // Inventory state
      inventory: [],
      loadingInventory: false,
      inventoryError: null
    };
  },
  async mounted() {
    await Promise.all([this.loadOrders(), this.loadInventory()]);
  },
  methods: {
    async loadOrders() {
      this.loadingOrders = true;
      this.ordersError = null;
      this.orders = [];
      try {
        const ordersCol = collection(db, 'orders');
        const q = query(ordersCol, orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const items = [];
        snap.forEach(d => {
          const data = d.data() || {};
          // normalize createdAt
          let createdAtDate = null;
          if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            createdAtDate = data.createdAt.toDate();
          } else if (data.createdAt && data.createdAt.seconds) {
            createdAtDate = new Date(data.createdAt.seconds * 1000);
          }
          items.push({
            id: d.id,
            orderNumber: data.orderNumber || null,
            userEmail: data.userEmail || null,
            status: data.status || '',
            total: data.total || 0,
            items: data.items || [],
            createdAt: data.createdAt || null,
            createdAtDate,
            createdAtDisplay: createdAtDate ? createdAtDate.toLocaleString() : (data.createdAt || '')
          });
        });
        this.orders = items;
      } catch (e) {
        this.ordersError = e.message || String(e);
        console.error('Failed to load orders:', e);
      } finally {
        this.loadingOrders = false;
      }
    },

    async loadInventory() {
      this.loadingInventory = true;
      this.inventoryError = null;
      this.inventory = [];
      try {
        const invCol = collection(db, 'inventory');
        const snap = await getDocs(invCol);
        const items = snap.docs.map(d => {
          const data = d.data() || {};
          const numericId = Number(d.id);
          return {
            id: isNaN(numericId) ? d.id : numericId,
            title: data.title || '',
            author: data.author || '',
            price: typeof data.price === 'number' ? data.price : (Number(data.price) || 0),
            image: data.image || '',
            category: data.category || '',
            parentCategory: data.parentCategory || '',
            categories: data.categories || [],
            description: data.description || '',
            dailyDeal: !!data.dailyDeal,
            raw: data
          };
        });
        this.inventory = items;
      } catch (e) {
        this.inventoryError = e.message || String(e);
        console.error('Failed to load inventory:', e);
      } finally {
        this.loadingInventory = false;
      }
    }
  }
};
</script>

<template>
  <main class="container my-4">
    <h2>Admin Dashboard</h2>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">Orders</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'inventory' }" @click="activeTab = 'inventory'">Inventory</button>
      </li>
    </ul>

    <div v-if="activeTab === 'orders'">
      <div v-if="loadingOrders" class="text-muted">Loading orders…</div>
      <div v-else-if="ordersError" class="text-danger">Error: {{ ordersError }}</div>
      <div v-else-if="!orders.length" class="text-muted">No orders found.</div>

      <div v-else>
        <div v-for="o in orders" :key="o.id" class="card mb-3 p-3">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <strong>Order #{{ o.orderNumber || o.id }}</strong><br />
              <small class="text-muted">By: {{ o.userEmail || 'guest' }}</small><br />
              <small class="text-muted">Placed: {{ o.createdAtDisplay }}</small>
            </div>
            <div class="text-end">
              <div>Status: <span class="badge bg-secondary">{{ o.status }}</span></div>
              <div class="mt-1">Total: ${{ (o.total || 0).toFixed(2) }}</div>
            </div>
          </div>

          <div class="mt-3">
            <ul class="mb-0">
              <li v-for="it in o.items" :key="it.id || it.title">
                {{ it.title || it.name }} <small class="text-muted">×{{ it.quantity || 1 }}</small>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'inventory'">
      <div v-if="loadingInventory" class="text-muted">Loading inventory…</div>
      <div v-else-if="inventoryError" class="text-danger">Error: {{ inventoryError }}</div>
      <div v-else-if="!inventory.length" class="text-muted">No inventory items found.</div>

      <div v-else class="row">
        <div v-for="it in inventory" :key="it.id" class="col-12 col-md-6 col-lg-4 mb-3">
          <div class="card h-100">
            <img v-if="it.image" :src="it.image" class="card-img-top" :alt="it.title" style="object-fit: cover; height: 200px;" />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title mb-1">{{ it.title }}</h5>
              <p class="card-subtitle text-muted mb-2">{{ it.author }}</p>
              <p class="mb-2 small text-muted">{{ it.category }} <span v-if="it.parentCategory">/ {{ it.parentCategory }}</span></p>
              <p class="mb-2 flex-grow-1" v-if="it.description">{{ it.description }}</p>
              <div class="d-flex justify-content-between align-items-center mt-2">
                <div>
                  <strong>${{ (it.price || 0).toFixed(2) }}</strong>
                </div>
                <div>
                  <span v-if="it.dailyDeal" class="badge bg-success">Daily Deal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

<style scoped>
.card-img-top { width: 100%; }
</style>
