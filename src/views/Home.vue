<script>
export default {
  props: {
    filteredInventory: Array,
    selectedBook: Object,
    selectedQuantity: Number,
    selectedCategory: String,
    selectedSort: { type: String, default: null }
  },
  emits: ['add-to-cart', 'view-details', 'close-book-modal', 'category-changed', 'sort-changed'],
  data() {
    return {
      // local fallback when parent doesn't control sorting
      localSort: this.selectedSort || null
    };
  },
  watch: {
    // keep localSort in sync if parent updates selectedSort
    selectedSort(newVal) {
      this.localSort = newVal;
    }
  },
  methods: {
    onSortChanged(sortKey) {
      this.localSort = sortKey;
      this.$emit('sort-changed', sortKey);
    }
  },
  computed: {
    sortedInventory() {
      const list = Array.isArray(this.filteredInventory) ? this.filteredInventory.slice() : [];
      const sortKey = this.selectedSort ?? this.localSort;

      switch (sortKey) {
        case 'price-asc':
          return list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        case 'price-desc':
          return list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        case 'favorites':
          return list.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
        case 'rating':
          return list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        case 'title-asc':
          return list.sort((a, b) => String(a.title || a.name || '').localeCompare(String(b.title || b.name || '')));
        case 'title-desc':
          return list.sort((a, b) => String(b.title || b.name || '').localeCompare(String(a.title || a.name || '')));
        default:
          return list;
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

    <div class="row">
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