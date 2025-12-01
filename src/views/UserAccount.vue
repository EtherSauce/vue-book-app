<script>
import AccountSettings from '@/components/AccountSettings.vue';
import OrderHistory from '@/components/OrderHistory.vue';
import Wishlist from '@/components/Wishlist.vue';

export default {
  name: 'UserAccount',
  components: { AccountSettings, OrderHistory, Wishlist },
  props: {
    user: { type: Object, default: () => ({ name: '', email: '' }) },
    orders: { type: Array, default: () => [] },
    wishlist: { type: Array, default: () => [] }
  },
  data() {
    return {
      tabs: [
        { key: 'settings', label: 'Account Settings' },
        { key: 'orders', label: 'Order History' },
        { key: 'wishlist', label: 'Wishlist' }
      ],
      active: 'settings'
    };
  },
  methods: {
    onUpdateUser(payload) {
      // emit upward so parent / future store can persist changes
      this.$emit('update-user', payload);
    }
  }
};
</script>

<template>
  <main class="container my-4">
    <h2>User Account</h2>
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item" v-for="(t, i) in tabs" :key="t.key">
        <button class="nav-link" :class="{ active: active === t.key }" @click="active = t.key">{{ t.label }}</button>
      </li>
    </ul>

    <div v-if="active === 'settings'">
      <account-settings :user="user" @update-user="onUpdateUser" />
    </div>

    <div v-if="active === 'orders'">
      <order-history :orders="orders" />
    </div>

    <div v-if="active === 'wishlist'">
      <wishlist :items="wishlist" @add-to-cart="$emit('add-to-cart', $event)" />
    </div>
  </main>
</template>

<style scoped>

</style>