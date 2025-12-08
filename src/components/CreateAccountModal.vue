<script>
import { auth, db } from '@/firebase/index.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

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
    generateCustomerId() {
      // short, reasonably-unique id: u_<time36>_<rand6>
      return 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    },

    async submit() {
      const name = this.name.trim();
      const email = this.email.trim();

      if (this.password !== this.confirm) {
        alert('Passwords do not match.');
        return;
      }

      if (!email || !this.password) {
        alert('Please provide an email and password.');
        return;
      }

      try {
        const cred = await createUserWithEmailAndPassword(auth, email, this.password);
        const uid = cred.user.uid;

        // generate a short public customer id to use when recording/looking up orders
        const customerId = this.generateCustomerId();

        // create / merge Firestore user doc
        await setDoc(doc(db, 'users', uid), {
          name,
          email,
          role: 'customer',
          customerId,
          createdAt: new Date().toISOString()
        }, { merge: true });

        // emit created user info to parent (include customerId)
        this.$emit('create-account', { uid, email, name, customerId });
        this.$emit('close');
      } catch (e) {
        // minimal error UX — replace with better UI if desired
        alert(e.message || 'Failed to create account.');
      }
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
