<!-- Dev-only page with a button that runs the seeder and shows results.-->
<!-- Add a route to access it (below). Remove after use if desired.-->
<script>
import seedSampleUsers from '../utils/SeedUser.js';

export default {
  name: 'SeedUsersPage',
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
        const res = await seedSampleUsers();
        this.log = res;
      } catch (e) {
        this.log.push({ email: 'unknown', ok: false, error: e.message || String(e) });
      } finally {
        this.running = false;
      }
    },
    clearLog() { this.log = []; }
  }
};
</script>

<template>
  <main class="container my-4">
    <h3>Seed Sample Users (dev)</h3>
    <p class="text-muted">Creates a lightweight staff user and a sample customer in Firebase Auth + Firestore.</p>
    <div class="mb-3">
      <button class="btn btn-primary" @click="runSeed" :disabled="running">{{ running ? 'Seeding…' : 'Seed Users' }}</button>
      <button class="btn btn-outline-secondary ms-2" @click="clearLog">Clear</button>
    </div>

    <ul class="list-group">
      <li v-for="(l, i) in log" :key="i" class="list-group-item">
        <strong>{{ l.email }}</strong> — <span :class="{'text-success': l.ok, 'text-danger': !l.ok}">{{ l.ok ? 'OK' : 'ERROR' }}</span>
        <div v-if="l.uid"><small class="text-muted">uid: {{ l.uid }}</small></div>
        <div v-if="l.error" class="text-danger small">{{ l.error }}</div>
      </li>
    </ul>

    <div class="mt-3 text-muted">
      Password used for both accounts: <code>Password123!</code>
    </div>
  </main>
</template>

<style scoped>
code { background: #f6f8fa; padding: .1rem .3rem; border-radius: 4px; }
</style>