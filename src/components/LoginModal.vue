<script>
export default {
  name: 'LoginModal',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  emits: ['login', 'close'],
  methods: {
    submit() {
      // minimal payload; parent should perform auth/validation
      this.$emit('login', { email: this.email.trim(), password: this.password });
      this.$emit('close');
    },
    close() {
      this.$emit('close');
    }
  }
}
</script>

<template>
  <div class="modal show" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Login</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" v-model="email" placeholder="you@example.com" />
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" v-model="password" placeholder="Password" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="close">Cancel</button>
          <button class="btn btn-primary" @click="submit">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>