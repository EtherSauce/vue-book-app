<script>
import * as bootstrap from 'bootstrap';
import AddToast from './AddToast.vue';
import itemFlagsMixin from '../mixins/itemFlagsMixin.vue';

export default {
  name: 'ItemDetailsModal',
  props: {
    item: { type: Object, required: true },
    quantity: { type: Number, default: 1 }
  },
  mixins: [itemFlagsMixin],
  data() {
    return {
      localQuantity: Number(this.quantity) || 1,
      showToast: false,
      toastMessage: '',
      toastTimer: null,
      _modalEl: null,
      _hiddenHandler: null
    };
  },
  watch: {
    quantity(newVal) { this.localQuantity = Number(newVal) || 1; },
    item() { this.localQuantity = Number(this.quantity) || 1; }
  },
  methods: {
    addToCart() {
      const qty = Number(this.localQuantity) || 1;
      this.$emit('add-to-cart', this.item, qty);
      this.toastMessage = `${qty} item${qty !== 1 ? 's' : ''} added to cart!`;
      this.showToast = true;

      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        this.showToast = false;
        this.toastTimer = null;
        this.closeModal();
      }, 2000);
    },

    closeModal() {
      if (this.toastTimer) { clearTimeout(this.toastTimer); this.toastTimer = null; }

      // If wrapped by a Bootstrap modal, hide that modal instance so backdrop is removed
      const modalEl = this.$el && this.$el.closest ? this.$el.closest('.modal') : null;
      if (modalEl) {
        try {
          const inst = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
          inst.hide();
          // do NOT emit 'close' here directly; we rely on hidden.bs.modal to emit after it's fully hidden
          return;
        } catch (e) {
          // fallback to emitting close if hiding fails
        }
      }

      this.$emit('close');
    },

    onRatingChange(e) {
      this.setRating(e.target.value);
    },
    onFavClick() {
      this.toggleFavorite();
    }
  },
  mounted() {
    // listen for the Bootstrap modal 'hidden' event so we can tell parent to clear state
    this._modalEl = this.$el && this.$el.closest ? this.$el.closest('.modal') : null;
    if (this._modalEl) {
      this._hiddenHandler = () => {
        // ensure any lingering toast timer is cleared
        if (this.toastTimer) { clearTimeout(this.toastTimer); this.toastTimer = null; }
        this.$emit('close');
      };
      this._modalEl.addEventListener('hidden.bs.modal', this._hiddenHandler);
    }
  },
  beforeUnmount() {
    if (this._modalEl && this._hiddenHandler) {
      this._modalEl.removeEventListener('hidden.bs.modal', this._hiddenHandler);
      this._hiddenHandler = null;
      this._modalEl = null;
    }
    if (this.toastTimer) { clearTimeout(this.toastTimer); this.toastTimer = null; }
  },
  components: { AddToast },
}
</script>

<template>
  <div class="modal-content position-relative" v-if="item">
    <div class="modal-header">
      <h5 class="modal-title">{{ item.title || item.name }}</h5>
      <div class="ms-2 d-flex align-items-center">
        <button class="btn btn-sm me-2" @click="onFavClick">
          <span v-if="localFavorite">♥</span><span v-else>♡</span>
        </button>
        <select class="form-select form-select-sm" style="width: 5rem;" :value="localRating" @change="onRatingChange">
          <option value="0">Rate</option>
          <option v-for="n in 5" :key="n" :value="n">{{ n }}★</option>
        </select>
      </div>
      <button type="button" class="btn-close" @click="closeModal"></button>
    </div>

    <div class="modal-body">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-7">
            <slot name="details">
              <p v-if="item.author">Author: {{ item.author }}</p>
              <p v-if="item.price" class="card-text text-success fw-bold">${{ item.price.toFixed(2) }}</p>

              <!-- Rating display added -->
              <p v-if="localRating && Number(localRating) > 0" class="mb-2">
                <strong>Rating:</strong>
                <span v-for="n in 5" :key="n" class="text-warning">
                  <span v-if="n <= Number(localRating)">★</span><span v-else>☆</span>
                </span>
                <small class="text-muted">({{ Number(localRating) }})</small>
              </p>

              <p v-if="item.categories && item.categories.length">Category: {{ item.categories.join(' / ') }}</p>
              <p v-else-if="item.parentCategory">Category: {{ item.parentCategory }} / {{ item.category }}</p>
              <p v-else-if="item.category">Category: {{ item.category }}</p>
              <p v-if="item.description">Description: {{ item.description }}</p>
            </slot>
          </div>

          <div class="col-md-5 text-end d-flex align-items-start justify-content-end">
            <img :src="item.image || item.img || ''" :alt="item.title || item.name" class="img-fluid mb-3 shadow" style="max-height:200px;">
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <slot name="actions">
        <input type="number" min="1" v-model.number="localQuantity" class="form-control quantity-input me-2" aria-label="Quantity" style="width: 60px" />
        <button class="btn btn-success" @click="addToCart">Add to Cart</button>
        <button class="btn btn-secondary" @click="closeModal">Close</button>
      </slot>
    </div>

    <add-toast :show="showToast" :message="toastMessage"/>
  </div>
</template>

<style scoped>
</style>