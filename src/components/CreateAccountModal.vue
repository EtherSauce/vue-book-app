<script>
export default {
  name: 'CreateAccountModal',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirm: ''
    };
  },
  emits: ['create-account', 'close'],
  methods: {
    submit() {
      // Simple client-side check for password match
      const payload = {
        name: this.name.trim(),
        email: this.email.trim(),
        password: this.password
      };
      if (this.password !== this.confirm) {
        // minimal UX: native alert (you can replace with better UI)
        alert('Passwords do not match.');
        return;
      }
      this.$emit('create-account', payload);
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
          <h5 class="modal-title">Create Account</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Name</label>
            <input type="text" class="form-control" v-model="name" placeholder="Full name" />
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" v-model="email" placeholder="you@example.com" />
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" v-model="password" placeholder="Password" />
          </div>
          <div class="mb-3">
            <label class="form-label">Confirm Password</label>
            <input type="password" class="form-control" v-model="confirm" placeholder="Confirm password" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="close">Cancel</button>
          <button class="btn btn-primary" @click="submit">Create Account</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
