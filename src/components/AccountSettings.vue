<script>
export default {
  name: 'AccountSettings',
  props: { user: { type: Object, default: () => ({}) } },
  data() {
    return {
      local: { name: this.user.name || '', email: this.user.email || '', password: '' }
    };
  },
  watch: {
    user(u) { this.local = { name: u.name || '', email: u.email || '', password: '' }; }
  },
  methods: {
    save() {
      // emit payload; persistence handled by parent later
      this.$emit('update-user', { ...this.local });
      this.local.password = '';
    },
    cancel() {
      this.local = { name: this.user.name || '', email: this.user.email || '', password: '' };
    }
  }
};
</script>

<template>
  <div class="card p-3">
    <h5>Account Settings</h5>
    <form @submit.prevent="save">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input class="form-control" v-model="local.name" />
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input class="form-control" v-model="local.email" type="email" />
      </div>
      <div class="mb-3">
        <label class="form-label">New Password (optional)</label>
        <input class="form-control" v-model="local.password" type="password" />
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-primary" type="submit">Save</button>
        <button class="btn btn-outline-secondary" type="button" @click="cancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>