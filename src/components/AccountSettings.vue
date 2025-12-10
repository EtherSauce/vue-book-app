<script>
import { auth, db } from '@/firebase/index.js';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default {
  name: 'AccountSettings',
  props: { user: { type: Object, default: () => ({}) } },
  data() {
    return {
      // form state
      local: { name: '', email: '', password: '' },
      saving: false,
      error: null
    };
  },
  watch: {
    user(u) {
      // populate form if parent provides a user later
      this.local = { name: u.name || '', email: u.email || '', password: '' };
    }
  },
  methods: {
    async save() {
      this.saving = true;
      this.error = null;

      const curUser = auth.currentUser || this.user;
      if (!curUser) {
        this.error = 'No authenticated user.';
        this.saving = false;
        return;
      }

      try {
        // update display name if changed
        if (this.local.name && this.local.name !== (curUser.displayName || '')) {
          await updateProfile(curUser, { displayName: this.local.name });
        }

        // update email if changed
        if (this.local.email && this.local.email !== (curUser.email || '')) {
          await updateEmail(curUser, this.local.email);
        }

        // update password if provided
        if (this.local.password) {
          await updatePassword(curUser, this.local.password);
        }

        // persist basic profile fields to users/{uid} in Firestore
        try {
          await setDoc(doc(db, 'users', curUser.uid), {
            name: this.local.name || null,
            email: this.local.email || null
          }, { merge: true });
        } catch (fsErr) {
          console.warn('Failed to update users doc:', fsErr);
        }

        // emit updated user info (without password)
        this.$emit('update-user', { uid: curUser.uid, name: this.local.name, email: this.local.email });

        // clear the form after successful save
        this.local = { name: '', email: '', password: '' };
      } catch (e) {
        this.error = e.message || String(e);
        console.error('Failed updating profile:', e);
      } finally {
        this.saving = false;
      }
    },
    cancel() {
      this.local = { name: '', email: '', password: '' };
      this.error = null;
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
        <label class="form-label">New Email (optional)</label>
        <input class="form-control" v-model="local.email" type="email" />
      </div>
      <div class="mb-3">
        <label class="form-label">New Password (optional)</label>
        <input class="form-control" v-model="local.password" type="password" />
      </div>

      <div v-if="error" class="text-danger mb-2">{{ error }}</div>

      <div class="actions-wrapper">
        <div class="d-flex gap-2 actions">
          <button class="btn btn-primary" type="submit" :disabled="saving">
            <span v-if="saving">Saving…</span>
            <span v-else>Save</span>
          </button>
          <button class="btn btn-outline-secondary" type="button" @click="cancel" :disabled="saving">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.actions-wrapper {
  position: relative;
  margin-top: 0.5rem;
}

.actions {
  z-index: 1;
}
</style>