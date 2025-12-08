<template>
  <main class="container my-4">
    <h3>Seed Inventory (dev)</h3>
    <p class="text-muted">Writes the local inventory into Firestore `inventory` collection. Dev only — remove or protect for production.</p>

    <div class="mb-3">
      <button class="btn btn-primary" @click="runSeed" :disabled="running">{{ running ? 'Seeding…' : 'Seed Inventory' }}</button>
      <button class="btn btn-outline-secondary ms-2" @click="clearLog">Clear</button>
    </div>

    <ul class="list-group">
      <li v-for="(r, i) in log" :key="i" class="list-group-item">
        <strong>{{ r.id || 'no-id' }}</strong> — <span :class="{'text-success': r.ok, 'text-danger': !r.ok}">{{ r.ok ? 'OK' : 'ERROR' }}</span>
        <div v-if="r.error" class="text-danger small">{{ r.error }}</div>
      </li>
    </ul>
  </main>
</template>

<script>
import seedInventory from '@/utils/seedInventory.js';

export default {
  name: 'SeedInventoryPage',
  data() {
    return {
      running: false,
      log: []
    };
  },
  methods: {
    async runSeed() {
      this.running = true;
      this.log = [];
      try {
        const res = await seedInventory();
        this.log = res;
      } catch (e) {
        this.log.push({ id: 'unknown', ok: false, error: e.message || String(e) });
      } finally {
        this.running = false;
      }
    },
    clearLog() { this.log = []; }
  }
};
</script>

<style scoped>
code { background: #f6f8fa; padding: .1rem .3rem; border-radius: 4px; }
</style>
