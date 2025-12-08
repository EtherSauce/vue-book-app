<script>
import BookCard from './components/BookCard.vue'
import ItemDetailsModal from "./components/ItemDetailsModal.vue";
import CategorySelector from "./components/CategorySelector.vue";
import MoreCategoriesModal from "./components/MoreCategoriesModal.vue";
import Navbar from "./components/Navbar.vue";
import CartBody from "./components/CartBody.vue";
import CheckoutForm from './components/CheckoutForm.vue';
import AppFooter from "./components/AppFooter.vue";
import RemoveItemModal from './components/RemoveItemModal.vue';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebase/index.js';
import Cart from './models/Cart.vue';
import { createInventory } from './models/Inventory.vue';

import * as bootstrap from 'bootstrap'


export default {
  name: 'App',
  data: function() {
    return {
      cart: new Cart(),
      inventory: createInventory(),

      selectedCategory: null,
      searchQuery: '',
      sortBy: 'none',
      filterAuthor: null,
      // Checkout fields
      shippingName: '',
      shippingAddress: '',
      shippingCity: '',
      shippingState: '',
      shippingZip: '',
      shippingEmail: '',
      cardNumber: '',
      expDate: '',
      cvv: '',

      showRemoveModal: false,
      itemToRemove: null,

      // book modal
      selectedBook: null,
      selectedQuantity: 1,

      user: null
    };
  },

  beforeUnmount() {
    if (this._unsubAuth) this._unsubAuth();
  },

  methods: {
    openBookModal(book) {
      this.selectedBook = book;
      this.selectedQuantity = 1;
      const modal = new bootstrap.Modal(document.getElementById('bookModal'));
      modal.show();
    },
    closeBookModal() {
      this.selectedBook = null;
    },
    addToCart(book, qty = 1) {
      this.cart.add(book, qty);
    },
    setCategory(category) {
      this.selectedCategory = category;
    },
    clearCategory() {
      this.selectedCategory = null;
    },
    updateQuantity(item, newQty) {
      this.cart.updateQuantity(item, newQty);
    },
    removeItem(item) {
      this.itemToRemove = item;
      this.showRemoveModal = true;
    },
    confirmRemove(item) {
      const target = item || this.itemToRemove;
      if (!target) {
        this.showRemoveModal = false;
        this.itemToRemove = null;
        return;
      }
      this.cart.remove(target);
      if (!item) {
        this.itemToRemove = null;
        this.showRemoveModal = false;
      }
    },
    removeFromCartConfirmed() {
      this.confirmRemove();
    },
    cancelRemove() {
      this.showRemoveModal = false;
      this.itemToRemove = null;
    },
    emptyCart() {
      this.cart.clear();
    },

    handleEmptyCart() {
      this.cart.clear();
      console.log("Empty cart triggered");
      this.shippingName = '';
      this.shippingAddress = '';
      this.shippingCity = '';
      this.shippingState = '';
      this.shippingZip = '';
      this.shippingEmail = '';
      this.cardNumber = '';
      this.expDate = '';
      this.cvv = '';
    },

    viewDetails(book) {
      this.selectedBook = book;
      this.selectedQuantity = 1;
    },

    handleNavigate(page) {
      if (page === 'cart') {
        this.$router.push({ name: 'Cart' });
      } else if (page === 'home') {
        this.$router.push({ name: 'Home' });
      } else if (typeof page === 'string') {
        if (page.startsWith('/')) {
          this.$router.push(page);
        } else {
          this.$router.push({ name: page });
        }
      }
    },

    onNavbarSearch(eventOrValue) {
      const value = typeof eventOrValue === 'string'
          ? eventOrValue
          : (eventOrValue && eventOrValue.target ? eventOrValue.target.value : '');
      this.searchQuery = value || '';
    },

    // Auth handlers used by NavBar
    async handleLogin(payload) {
      try {
        const res = await signInWithEmailAndPassword(auth, payload.email, payload.password);
        // onAuthStateChanged will update `this.user`, but set immediately for snappy UI
        this.user = { uid: res.user.uid, email: res.user.email, displayName: res.user.displayName };
      } catch (e) {
        alert('Login failed: ' + (e.message || e));
      }
    },
    async handleCreateAccount(payload) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
        if (payload.name && cred.user) {
          await updateProfile(cred.user, { displayName: payload.name });
        }
        // user will be set by onAuthStateChanged
      } catch (e) {
        alert('Create account failed: ' + (e.message || e));
      }
    },
    async handleLogout() {
      try {
        await signOut(auth);
        this.user = null;
      } catch (e) {
        console.error('Sign out failed', e);
      }
    }
  },

  computed: {
    filteredInventory() {
      const q = (this.searchQuery || '').trim().toLowerCase();
      const selected = this.selectedCategory;
      const parentCategories = ['Fiction', 'Non-Fiction', 'Children'];

      return this.inventory.filter(book => {
        if (q) {
          const hay = (
              (book.title || '') + ' ' +
              (book.author || '') + ' ' +
              (book.description || '') + ' ' +
              (book.categories ? book.categories.join(' ') : '')
          ).toLowerCase();
          if (!hay.includes(q)) return false;
        }

        if (!selected) return true;
        if (selected === 'Daily Deals') return !!book.dailyDeal;
        if (parentCategories.includes(selected)) {
          return book.parentCategory === selected;
        }
        if (book.categories && book.categories.includes(selected)) return true;
        if (book.category === selected) return true;
        return false;
      });
    },
    products() {
      return this.cart.items;
    },
    cartCount() {
      if (this.cart && typeof this.cart.count === 'function') {
        const c = this.cart.count();
        return Number.isFinite(c) ? c : 0;
      }
      return 0;
    },
    cartTotal() {
      return this.cart.total();
    },
  },

  mounted: function () {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.cart = new Cart(parsed);
      } catch (e) {
        console.warn('Failed to parse saved cart:', e);
      }
    }
    // single auth listener
    this._unsubAuth = onAuthStateChanged(auth, (u) => {
      this.user = u ? { uid: u.uid, email: u.email, displayName: u.displayName } : null;
    });
  },

  watch: {
    products: {
      handler(newVal) {
        localStorage.setItem('cart', JSON.stringify(newVal));
      },
      deep: true
    }
  },

  components: {
    BookCard,
    ItemDetailsModal,
    CategorySelector,
    MoreCategoriesModal,
    Navbar,
    CartBody,
    CheckoutForm,
    AppFooter,
    RemoveItemModal
  },
};
</script>

<template>

  <div class="app-root">
    <NavBar
        :user="user"
        :cart-count="cartCount"
        @search="onNavbarSearch"
        @update:searchQuery="onNavbarSearch"
        @navigate="handleNavigate"
        @login="handleLogin"
        @create-account="handleCreateAccount"
        @logout="handleLogout"
    />

    <router-view v-slot="{ Component }">
      <component
          :is="Component"
          :products="products"
          :cart-total="cartTotal"
          :filtered-inventory="filteredInventory"
          :selected-book="selectedBook"
          :selected-quantity="selectedQuantity"
          :selected-category="selectedCategory"
          :show-remove-modal="showRemoveModal"
          :item-to-remove="itemToRemove"
          :shipping-name.sync="shippingName"
          :shipping-address.sync="shippingAddress"
          :shipping-city.sync="shippingCity"
          :shipping-state.sync="shippingState"
          :shipping-zip.sync="shippingZip"
          :shipping-email.sync="shippingEmail"
          :card-number.sync="cardNumber"
          :exp-date.sync="expDate"
          :cvv.sync="cvv"
          @add-to-cart="addToCart"
          @view-details="openBookModal"
          @close-book-modal="closeBookModal"
          @category-changed="setCategory"
          @confirm-remove="removeFromCartConfirmed"
          @cancel-remove="cancelRemove"
          @remove-item="confirmRemove"
          @update-quantity="updateQuantity"
          @empty-cart="handleEmptyCart"
      />
    </router-view>

    <app-footer />
  </div>
</template>

<style scoped>
.app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* fill viewport height */
}

.main-content {
  flex: 1 0 auto; /* expand to push footer to bottom on short pages */
}
</style>