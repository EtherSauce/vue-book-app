<script>
export default {
  name: "CategorySelector",
  data: function(){
    return {
      activeDropdown: null,
      dropdownStyle: { position: 'fixed', top: '0px', left: '0px', width: '200px', display: 'none', zIndex: 1050 },
      activeButtonEl: null,
      selected: null
    }
  },

  props: {
    selectedCategory: { type: String, default: null },
    selectedSort: { type: String, default: null }
  },

  watch: {
    selectedCategory(newVal) {
      this.selected = newVal;
    }
  },

  methods: {
    toggleDropdown(name, evt) {
      if (this.activeDropdown === name) {
        this.activeDropdown = null;
        this.dropdownStyle.display = 'none';
        this.activeButtonEl = null;
        return;
      }

      this.activeDropdown = name;
      this.activeButtonEl = evt ? (evt.currentTarget || evt.target) : null;

      const rect = (evt && evt.currentTarget) ? evt.currentTarget.getBoundingClientRect() : { bottom: 0, left: 8, width: 200 };
      const padding = 8;
      const top = rect.bottom + padding;
      const left = Math.max(padding, rect.left + padding);
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const maxWidth = vw - left - padding;
      const width = Math.min(Math.max(rect.width - padding * 2, 160), maxWidth);

      this.dropdownStyle = {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        display: 'block',
        zIndex: 1050
      };
    },

    setCategory(category) {
      this.selected = category;
      this.$emit('category-changed', category);
      this.activeDropdown = null;
      this.dropdownStyle.display = 'none';
      this.activeButtonEl = null;
    },

    setSort(sortKey) {
      this.$emit('sort-changed', sortKey);
      this.activeDropdown = null;
      this.dropdownStyle.display = 'none';
      this.activeButtonEl = null;
    },

    // Clear sorting helper
    clearSort() {
      this.setSort(null);
    },

    // Clear category helper
    clearCategory() {
      this.selected = null;
      this.$emit('category-changed', null);
      this.activeDropdown = null;
      this.dropdownStyle.display = 'none';
      this.activeButtonEl = null;
    },

    // Unified clear button: clears category, sort, or both
    clearFilters() {
      const hasCategory = !!this.selected;
      const hasSort = !!this.selectedSort;

      if (hasCategory) this.clearCategory();
      if (hasSort) this.clearSort();
    },

    onDocumentClick(e) {
      if (!this.activeDropdown) return;
      const root = this.$el;
      const clickedInsideRoot = root && root.contains(e.target);
      if (!clickedInsideRoot) {
        this.activeDropdown = null;
        this.dropdownStyle.display = 'none';
        this.activeButtonEl = null;
      }
    },

    onWindowResize() {
      if (this.activeDropdown && this.activeButtonEl) {
        const rect = this.activeButtonEl.getBoundingClientRect();
        const padding = 8;
        const top = rect.bottom + padding;
        const left = Math.max(padding, rect.left + padding);
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const maxWidth = vw - left - padding;
        const width = Math.min(Math.max(rect.width - padding * 2, 160), maxWidth);

        this.dropdownStyle = {
          position: 'fixed',
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          display: 'block',
          zIndex: 1050
        };
      }
    },

    parentForCategory(cat) {
      if (!cat) return null;
      if (this.fictionSubs.includes(cat) || cat === 'Fiction') return 'Fiction';
      if (this.nonfictionSubs.includes(cat) || cat === 'Non-Fiction') return 'Non-Fiction';
      if (this.childrenSubs.includes(cat) || cat === 'Children') return 'Children';
      if (cat === 'Daily Deals') return 'Daily Deals';
      return null;
    },

    labelForParent(parentName) {
      if (!this.selected) return parentName;
      const parent = this.parentForCategory(this.selected);
      if (parent === parentName && this.selected !== parentName) {
        return this.selected;
      }
      if (this.selected === parentName) return parentName;
      return parentName;
    },

    isParentSelected(parentName) {
      if (!this.selected) return false;
      const parent = this.parentForCategory(this.selected);
      return parent === parentName;
    }
  },

  computed: {
    fictionSubs() {
      return ["Dystopian", "Post-Apocalyptic", "Science Fiction", "Fantasy", "Literary", "Gothic", "Adventure", "Romance", "Mystery", "Horror", "Historical"];
    },
    nonfictionSubs() {
      return ["Science", "History", "Biography", "Self-Help", "Magazines", "Education", "Technology"];
    },
    childrenSubs() {
      return ["Young Adult", "Middle Grade", "Picture Books"];
    },
    sortOptions() {
      return [
        { key: 'price-asc', label: 'Price: Low → High' },
        { key: 'price-desc', label: 'Price: High → Low' },
        { key: 'favorites', label: 'Favorites First' },
        { key: 'rating', label: 'Rating (High → Low)' }
      ];
    },
    // label for the unified clear button
    clearLabel() {
      if (this.selected && this.selectedSort) return 'Clear Filters';
      if (this.selected) return 'Clear Category';
      if (this.selectedSort) return 'Clear Sort';
      return 'Clear';
    }
  },

  mounted() {
    this.selected = this.selectedCategory || null;
    document.addEventListener('click', this.onDocumentClick);
    window.addEventListener('resize', this.onWindowResize);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
    window.removeEventListener('resize', this.onWindowResize);
  },
}
</script>

<template>
  <div>
    <!-- Mobile: single select with optgroups (parent "All" options included) -->
    <div class="mb-3 d-block d-md-none">
      <select class="form-select" :value="selectedCategory || ''" @change="setCategory($event.target.value || null)">
        <option value="">All Categories</option>

        <optgroup label="Fiction">
          <option value="Fiction">All Fiction</option>
          <option v-for="s in fictionSubs" :key="s" :value="s">{{ s }}</option>
        </optgroup>

        <optgroup label="Non-Fiction">
          <option value="Non-Fiction">All Non-Fiction</option>
          <option v-for="s in nonfictionSubs" :key="s" :value="s">{{ s }}</option>
        </optgroup>

        <optgroup label="Children">
          <option value="Children">All Children</option>
          <option v-for="s in childrenSubs" :key="s" :value="s">{{ s }}</option>
        </optgroup>

        <option value="Daily Deals">Daily Deals</option>
      </select>
    </div>

    <!-- Desktop: parent buttons only open dropdown (do not select parent when clicked) -->
    <div class="row g-3 d-none d-md-flex align-items-stretch category-row" style="overflow: visible;">
      <div class="col-md-2" v-for="(meta, idx) in [{name:'Fiction', subs: fictionSubs},{name:'Non-Fiction', subs: nonfictionSubs},{name:'Children', subs: childrenSubs}]" :key="meta.name">
        <div class="d-grid position-relative">
          <button
              type="button"
              class="btn category-btn"
              :class="selected === meta.name || isParentSelected(meta.name) ? 'btn-primary' : 'btn-outline-primary'"
              @click="toggleDropdown(meta.name, $event)"
          >
            <span class="text-truncate">{{ labelForParent(meta.name) }}</span>
            <span class="ms-2" aria-hidden="true">▾</span>
          </button>
        </div>
      </div>

      <!-- Daily Deals as a single solid button -->
      <div class="col-md-2">
        <div class="d-grid position-relative">
          <button
              class="btn category-btn"
              :class="selected === 'Daily Deals' ? 'btn-primary' : 'btn-outline-primary'"
              @click="setCategory('Daily Deals')"
          >
            <span class="text-truncate">Daily Deals</span>
          </button>
        </div>
      </div>

      <!-- SORT button (far right) -->
      <div class="col-md-2">
        <div class="d-grid position-relative">
          <button
              type="button"
              class="btn category-btn"
              :class="selectedSort ? 'btn-primary' : 'btn-outline-primary'"
              @click="toggleDropdown('Sort', $event)"
          >
            <span>{{ selectedSort ? (sortOptions.find(o => o.key === selectedSort) || {}).label || 'Sort' : 'Sort' }}</span>
            <span class="ms-2" aria-hidden="true">▾</span>
          </button>
          <!-- small clear control removed; unified clear button used below -->
        </div>
      </div>

      <!-- Clear button row: shown when category or sort is active -->
      <div class="col-12 mt-2" v-if="selected || selectedSort">
        <button class="btn btn-sm btn-outline-danger" @click="clearFilters">{{ clearLabel }}</button>
      </div>
    </div>

    <!-- Fixed-position dropdown rendered once per component -->
    <div v-if="activeDropdown" :style="dropdownStyle" class="list-group text-start shadow" role="menu">
      <!-- If showing a parent category -->
      <template v-if="activeDropdown !== 'Sort'">
        <button
            class="list-group-item list-group-item-action"
            :class="{'active': selectedCategory === activeDropdown || selected === activeDropdown}"
            @click="setCategory(activeDropdown)"
        >All {{ activeDropdown }}</button>

        <div class="dropdown-divider"></div>

        <!-- Sub-genre items -->
        <button
            class="list-group-item list-group-item-action"
            v-for="sub in (activeDropdown === 'Fiction' ? fictionSubs : activeDropdown === 'Non-Fiction' ? nonfictionSubs : childrenSubs)"
            :key="sub"
            :class="{'active': selectedCategory === sub || selected === sub}"
            @click="setCategory(sub)"
        >
          {{ sub }}
        </button>
      </template>

      <!-- Sort dropdown -->
      <template v-else>
        <div class="list-group-item list-group-item-action" :class="{'active': selectedSort === null}" @click="setSort(null)">
          Default
        </div>
        <div class="dropdown-divider"></div>
        <button
            v-for="opt in sortOptions"
            :key="opt.key"
            class="list-group-item list-group-item-action"
            :class="{'active': selectedSort === opt.key}"
            @click="setSort(opt.key)"
        >
          {{ opt.label }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>