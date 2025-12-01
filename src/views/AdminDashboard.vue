<script>
import AdminOrders from '@/components/AdminOrders.vue';
import AdminInventory from '@/components/AdminInventory.vue';

export default {
  name: 'AdminDashboard',
  components: { AdminOrders, AdminInventory },
  props: {
    orders: { type: Array, default: () => [] },
    products: { type: Array, default: () => [] }
  },
  data() {
    return {
      tabs: [
        { key: 'orders', label: 'All Orders' },
        { key: 'inventory', label: 'Inventory' }
      ],
      active: 'orders'
    };
  },
  methods: {
    onUpdateOrder(order) { this.$emit('update-order', order); },
    onAddProduct(p) { this.$emit('add-product', p); },
    onEditProduct(p) { this.$emit('edit-product', p); },
    onDeleteProduct(id) { this.$emit('delete-product', id); }
  }
};
</script>

<template>
  <main class="container my-4">
    <h2>Admin Dashboard</h2>
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item" v-for="t in tabs" :key="t.key">
        <button class="nav-link" :class="{ active: active === t.key }" @click="active = t.key">{{ t.label }}</button>
      </li>
    </ul>

    <div v-if="active === 'orders'">
      <admin-orders :orders="orders" @update-order="onUpdateOrder" />
    </div>

    <div v-if="active === 'inventory'">
      <admin-inventory :products="products" @add-product="onAddProduct" @edit-product="onEditProduct" @delete-product="onDeleteProduct" />
    </div>
  </main>
</template>

<style scoped>

</style>