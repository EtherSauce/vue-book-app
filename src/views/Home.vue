<script>
import { getInventory as getRemoteInventory } from '@/utils/getInventory.js';
import { createInventory as createLocalInventory } from '@/models/Inventory.vue';

export default {
  name: 'HomeView',

  props: {
    filteredInventory: { type: Array, default: () => [] },
    selectedBook: Object,
    selectedQuantity: Number,
    selectedCategory: String,
    selectedSort: { type: String, default: null }
  },

  emits: ['add-to-cart', 'view-details', 'close-book-modal', 'category-changed', 'sort-changed'],

  data() {
    return {
      // inventory will hold the remote (Firestore) inventory or local fallback
      inventory: [],
      loadingInventory: false,
      loadError: null,
      // local-only UI state
      searchQuery: '',
      localSort: this.selectedSort || null
    };
  },

  watch: {
    // keep localSort in sync if parent updates selectedSort
    selectedSort(newVal) {
      this.localSort = newVal;
    }
  },

  async mounted() {
    // Always attempt to load remote inventory (prefer Firestore over bundle)
    await this.loadInventory();
  },

  methods: {
    onSortChanged(sortKey) {
      this.localSort = sortKey;
      this.$emit('sort-changed', sortKey);
    },

    async loadInventory() {
      this.loadingInventory = true;
      this.loadError = null;
      try {
        const remote = await getRemoteInventory();
        if (Array.isArray(remote) && remote.length) {
          this.inventory = remote;
        } else {
          // fallback to bundled inventory
          this.inventory = createLocalInventory();
        }
      } catch (e) {
        this.loadError = e.message || String(e);
        this.inventory = createLocalInventory();
        console.error('Failed to load inventory:', e);
      } finally {
        this.loadingInventory = false;
      }
    },

    // set search query used by computed list; do NOT mutate inventory here
    applySearch(query) {
      this.searchQuery = (query || '').trim();
    }
  },

  computed: {
    // Build the source list: prefer fetched inventory (Firestore or local fallback),
    // otherwise use the parent's filteredInventory if present.
    _rawSource() {
      if (Array.isArray(this.inventory) && this.inventory.length) {
        return this.inventory.slice();
      }
      if (Array.isArray(this.filteredInventory) && this.filteredInventory.length) {
        return this.filteredInventory.slice();
      }
      return [];
    },

    // Apply category + search filtering and sorting
    sortedInventory() {
      const parentSelected = this.selectedCategory;
      const parentCats = ['Fiction', 'Non-Fiction', 'Children'];

      let source = this._rawSource;

      // category filter (mirror App.vue logic)
      if (parentSelected) {
        source = source.filter(book => {
          if (parentSelected === 'Daily Deals') return !!book.dailyDeal;
          if (parentCats.includes(parentSelected)) return book.parentCategory === parentSelected;
          if (book.categories && book.categories.includes(parentSelected)) return true;
          if (book.category === parentSelected) return true;
          return false;
        });
      }

      // search filter (local search box or programmatic calls)
      const q = (this.searchQuery || '').trim().toLowerCase();
      if (q) {
        source = source.filter(book => {
          const hay = (
              (book.title || '') + ' ' +
              (book.author || '') + ' ' +
              (book.description || '') + ' ' +
              ((book.categories || []).join(' '))
          ).toLowerCase();
          return hay.includes(q);
        });
      }

      // sorting
      const sortKey = this.selectedSort ?? this.localSort;
      switch (sortKey) {
        case 'price-asc':
          return source.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        case 'price-desc':
          return source.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        case 'favorites':
          return source.sort((a, b) => ((b.favorite ? 1 : 0) - (a.favorite ? 1 : 0)));
        case 'rating':
          return source.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        case 'title-asc':
          return source.sort((a, b) => String(a.title || a.name || '').localeCompare(String(b.title || b.name || '')));
        case 'title-desc':
          return source.sort((a, b) => String(b.title || b.name || '').localeCompare(String(a.title || a.name || '')));
        default:
          return source;
      }
    }
  }
};
</script>

<template>
  <section class="container my-4">
    <div class="mb-4">
      <category-selector
          :selected-category="selectedCategory"
          :selected-sort="localSort"
          @category-changed="$emit('category-changed', $event)"
          @sort-changed="onSortChanged"
      />
    </div>

    <div v-if="loadingInventory" class="text-center text-muted py-4">Loading inventory…</div>
    <div v-else-if="loadError" class="text-danger py-4">Error loading inventory: {{ loadError }}</div>

    <div class="row" v-if="!loadingInventory && !loadError">
      <template v-if="sortedInventory.length">
        <div class="col-md-3 mb-4" v-for="book in sortedInventory" :key="book.id">
          <book-card
              :book="book"
              @view-details="$emit('view-details', book)"
              @add-to-cart="$emit('add-to-cart', book, 1)"
          />
        </div>
      </template>
      <div v-else class="col-12 text-center text-muted py-5">
        No books found for your search or selected category.
      </div>
    </div>

    <!-- Book Modal -->
    <div class="modal fade" id="bookModal" tabindex="-1" aria-labelledby="bookModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <item-details-modal
            v-if="selectedBook"
            :item="selectedBook"
            :quantity="selectedQuantity"
            @add-to-cart="(item, qty) => $emit('add-to-cart', item, qty)"
            @close="$emit('close-book-modal')"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>

<style>
/* keep vertical scrollbar present to avoid layout shift when bootstrap modal opens/closes */
html { overflow-y: scroll; }
</style>
