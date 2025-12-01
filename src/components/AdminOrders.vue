<script>
export default {
  name: 'AdminOrders',
  props: { orders: { type: Array, default: () => [] } },
  data() {
    return { localStatus: {} };
  },
  created() {
    this.orders.forEach(o => { this.$set ? this.$set(this.localStatus, o.id, o.status || 'pending') : (this.localStatus[o.id] = o.status || 'pending'); });
  },
  methods: {
    saveStatus(order) {
      const updated = { ...order, status: this.localStatus[order.id] };
      this.$emit('update-order', updated);
    }
  }
};
</script>

<template>
  <div>
    <h5>Orders</h5>
    <div v-if="!orders.length" class="text-muted">No orders yet.</div>
    <div v-for="o in orders" :key="o.id" class="card p-2 mb-2">
      <div class="d-flex justify-content-between">
        <div>
          <strong>#{{ o.id }}</strong> — <small>{{ o.customerName || o.customerEmail }}</small><br />
          <small class="text-muted">{{ o.date }}</small>
        </div>
        <div class="text-end">
          <select class="form-select form-select-sm mb-1" v-model="localStatus[o.id]">
            <option>pending</option>
            <option>processing</option>
            <option>shipped</option>
            <option>completed</option>
            <option>cancelled</option>
          </select>
          <button class="btn btn-sm btn-primary" @click="saveStatus(o)">Save</button>
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