<script>
export default {
  name: 'OrderHistory',
  props: { orders: { type: Array, default: () => [] } }
};
</script>

<template>
  <div>
    <h5>Order History</h5>
    <div v-if="!orders.length" class="text-muted">No past orders.</div>
    <div v-for="o in orders" :key="o.id" class="card mb-2 p-2">
      <div class="d-flex justify-content-between">
        <div>
          <strong>Order #{{ o.id }}</strong><br />
          <small class="text-muted">Placed: {{ o.date }}</small>
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
</template>

<style scoped>

</style>