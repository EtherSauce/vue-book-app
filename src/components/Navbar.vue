<script>
import SearchBar from './SearchBar.vue';
import LoginModal from './LoginModal.vue';
import CreateAccountModal from './CreateAccountModal.vue';

export default {
  name: "NavBar",
  data: function(){
    return {
      showLoginModal: false,
      showCreateModal: false
    }
  },

  props: {
    user: { type: Object, default: null },
    cartCount: { type: [Number, Array, Object], default: 0 },
    searchQuery: { type: String, default: "" },
    links: { type: Array, default: () => [] },
    brand: { type: String, default: "Discount Book Emporium" },
    cartLabel: { type: String, default: "View Cart" }
  },

  emits: ['search', 'update:searchQuery', 'navigate', 'login', 'create-account', 'logout'],

  methods: {
    triggerSearch(eventOrValue) {
      const value = typeof eventOrValue === 'string'
          ? eventOrValue
          : (eventOrValue && eventOrValue.target ? eventOrValue.target.value : '');
      this.$emit('update:searchQuery', value);
      this.$emit('search', value);
    },
    navigateTo(link) {
      this.$emit('navigate', link);

      if (!this.$router) return;

      try {
        if (!link || link === 'home') {
          this.$router.push({ name: 'Home' }).catch(() => {});
          return;
        }
        if (link === 'cart') {
          this.$router.push({ name: 'Cart' }).catch(() => {});
          return;
        }
        if (typeof link === 'string' && link.startsWith('/')) {
          this.$router.push(link).catch(() => {});
          return;
        }
        if (typeof link === 'string') {
          this.$router.push({ name: link }).catch(() => {});
          return;
        }
        this.$router.push(link).catch(() => {});
      } catch (e) {
        // swallow navigation errors
      }
    },
    openLogin() {
      this.showLoginModal = true;
    },
    openCreate() {
      this.showCreateModal = true;
    },
    handleLogin(payload) {
      this.$emit('login', payload);
      this.showLoginModal = false;
    },
    handleCreateAccount(payload) {
      this.$emit('create-account', payload);
      this.showCreateModal = false;
    },
    emitLogout() {
      this.$emit('logout');
    }
  },

  components: {
    SearchBar,
    LoginModal,
    CreateAccountModal
  },

  computed: {
    normalizedCartCount() {
      const v = this.cartCount;
      if (Array.isArray(v)) return v.length;
      if (v && typeof v === 'object') {
        if (typeof v.length === 'number') return v.length;
        if (typeof v.count === 'function') return Number(v.count()) || 0;
        if (typeof v.count === 'number') return v.count;
      }
      return Number(v) || 0;
    }
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <a class="navbar-brand fw-bold" href="#" @click.prevent="navigateTo('home')">{{ brand }}</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-for="link in links" :key="link.value" class="nav-item">
            <a class="nav-link" href="#" @click.prevent="navigateTo(link.value)">{{ link.label }}</a>
          </li>
        </ul>

        <search-bar
            class="me-3"
            :search-query="searchQuery"
            @update:searchQuery="triggerSearch"
            @search="triggerSearch"
        />

        <!-- Account dropdown: switch UI when user is signed in -->
        <div class="dropdown me-3">
          <button
              class="btn btn-outline-light dropdown-toggle"
              type="button"
              id="loginDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
          >
            <span v-if="user">{{ user.displayName || user.email }}</span>
            <span v-else>Account</span>
          </button>

          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="loginDropdown">
            <template v-if="user">
              <li><a class="dropdown-item" href="#" @click.prevent="navigateTo('Account')">Manage</a></li>
              <li><a class="dropdown-item" href="#" @click.prevent="emitLogout">Logout</a></li>
            </template>
            <template v-else>
              <li><a class="dropdown-item" href="#" @click.prevent="openLogin">Login</a></li>
              <li><a class="dropdown-item" href="#" @click.prevent="openCreate">Create Account</a></li>
            </template>
          </ul>
        </div>

        <a href="#" class="btn btn-warning position-relative mt-lg-0 mt-2" @click.prevent="navigateTo('cart')">
          {{ cartLabel }}
          <span v-if="normalizedCartCount > 0" class="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">{{ normalizedCartCount }}</span>
        </a>
      </div>
    </div>

    <!-- Modals (only show when not logged in) -->
    <login-modal v-if="showLoginModal && !user" @close="showLoginModal = false" @login="handleLogin" />
    <create-account-modal v-if="showCreateModal && !user" @close="showCreateModal = false" @create-account="handleCreateAccount" />
  </nav>
</template>

<style scoped>
</style>