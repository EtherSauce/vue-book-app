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
import { createInventory } from './models/Inventory.vue';
import * as bootstrap from 'bootstrap';
import cartService from '@/utils/cartService.js';

export default {
  name: 'App',
  data() {
    return {
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

      user: null,
      cart: cartService.emptyCart(),
      cartUnsub: null,
      _unsubAuth: null
    };
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
      return this.cart.items || [];
    },

    cartCount() {
      return (this.cart.items || []).reduce((s, i) => s + (Number(i.quantity) || 0), 0);
    },

    cartTotal() {
      return (this.cart.items || []).reduce((s, i) => s + ((Number(i.quantity) || 0) * (Number(i.price) || 0)), 0);
    }
  },

  methods: {
    // Cart / UI helpers
    async loadInitialCart(forUser) {
      if (this.cartUnsub) { this.cartUnsub(); this.cartUnsub = null; }

      if (forUser) {
        // Merge guest into user cart on sign-in, then subscribe to server cart
        const merged = await cartService.mergeGuestIntoUser();
        this.cart = merged || (await cartService.loadCart());
        this.cartUnsub = cartService.subscribeToUserCart(c => {
          this.cart = c || cartService.emptyCart();
        });
      } else {
        // guest cart
        this.cart = await cartService.loadCart();
      }
    },

    async addToCart(item, qty = 1) {
      if (!this.cart.items) this.cart.items = [];
      const existing = this.cart.items.find(i => i.id === item.id);
      if (existing) {
        existing.quantity = (Number(existing.quantity) || 0) + Number(qty);
      } else {
        // copy minimal item (preserve price/title/id)
        this.cart.items.push(Object.assign({}, item, { quantity: Number(qty) }));
      }
      this.cart.updatedAt = new Date().toISOString();
      await cartService.saveCart(this.cart);
    },

    async updateQuantity(item, newQty) {
      if (!this.cart.items) return;
      const it = this.cart.items.find(i => i.id === item.id || i.id === item);
      if (!it) return;
      it.quantity = Number(newQty) || 0;
      // remove items with zero quantity
      this.cart.items = this.cart.items.filter(i => (Number(i.quantity) || 0) > 0);
      this.cart.updatedAt = new Date().toISOString();
      await cartService.saveCart(this.cart);
    },

    async removeFromCart(itemOrId) {
      const id = (typeof itemOrId === 'string' || typeof itemOrId === 'number') ? itemOrId : itemOrId.id;
      this.cart.items = (this.cart.items || []).filter(i => i.id !== id);
      this.cart.updatedAt = new Date().toISOString();
      await cartService.saveCart(this.cart);
    },

    async clearCart() {
      this.cart = cartService.emptyCart();
      await cartService.saveCart(this.cart);
    },

    openBookModal(book) {
      this.selectedBook = book;
      this.selectedQuantity = 1;
      const modal = new bootstrap.Modal(document.getElementById('bookModal'));
      modal.show();
    },
    closeBookModal() {
      this.selectedBook = null;
    },

    setCategory(category) {
      this.selectedCategory = category;
    },
    clearCategory() {
      this.selectedCategory = null;
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
      this.removeFromCart(target);
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

    handleEmptyCart() {
      this.clearCart();
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
        // onAuthStateChanged will update `this.user` and load/merge cart; set immediate for snappy UI
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
        // Firestore user doc creation is handled where you implemented it (CreateAccountModal)
      } catch (e) {
        alert('Create account failed: ' + (e.message || e));
      }
    },

    async handleLogout() {
      try {
        await signOut(auth);
        this.user = null;
        // onAuthStateChanged handler will load guest cart
      } catch (e) {
        console.error('Sign out failed', e);
      }
    }
  },

  mounted() {
    // initial guest cart load and auth listener
    this.loadInitialCart(false);

    this._unsubAuth = onAuthStateChanged(auth, async (u) => {
      this.user = u ? { uid: u.uid, email: u.email, displayName: u.displayName } : null;
      await this.loadInitialCart(!!u);
    });
  },

  beforeUnmount() {
    if (this._unsubAuth) this._unsubAuth();
    if (this.cartUnsub) this.cartUnsub();
  }
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
          :cart="cart"
          :cart-count="cartCount"
          @add-to-cart="addToCart"
          @remove-from-cart="removeFromCart"
          @update-quantity="updateQuantity"
          @view-details="openBookModal"
          @close-book-modal="closeBookModal"
          @category-changed="setCategory"
          @confirm-remove="removeFromCartConfirmed"
          @cancel-remove="cancelRemove"
          @remove-item="confirmRemove"
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
