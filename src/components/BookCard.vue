<script>
import AddToast from './AddToast.vue';
import itemFlagsMixin from '../mixins/itemFlagsMixin.vue';

export default {
  name: 'BookCard',
  mixins: [itemFlagsMixin],

  data: function(){
    return {
      showToast: false,
      toastMessage: ''
    }
  },

  // props:   Data passed into the component via attributes.
  //          Props can be optional or required. Objects and arrays
  //          are pass-by-reference. Primitives (number, string, boolean)
  //          are pass-by-value.
  props: {
    book: { type: Object, required: true }
  },

  // methods: Usually "events" triggered by v-on:
  methods: {
    handleViewDetails() {
      this.$emit('view-details', this.book);
    },
    handleAddToCart() {
      this.$emit('add-to-cart', this.book);
      const qty = 1;
      this.toastMessage = `${qty} item${qty !== 1 ? 's' : ''} added to cart!`;
      this.showToast = true;
      setTimeout(() => this.showToast = false, 2000);
    },
    onFavoriteClick() {
      // uses mixin toggleFavorite
      this.toggleFavorite();
    }
  },

  // computed:    Values that are updated and cached if dependencies change.
  //              Computed value functions need to return a value.
  //              Treat these like regular values that you would use
  //              in data or props.
  computed: {

  },

  components: { AddToast },
}
</script>

<template>
  <div class="card h-100 position-relative">
    <img :src="book.image" class="card-img-top card-img-fixed" :alt="book.title">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start">
        <h5 class="card-title mb-0">{{ book.title }}</h5>
      </div>

      <p class="card-text text-success fw-bold mb-2">${{ book.price.toFixed(2) }}</p>
      <p class="card-text">Author: {{ book.author }}</p>
      <div class="d-flex justify-content-between mt-auto">
        <button class="btn btn-info" @click="handleViewDetails">View Details</button>
        <button class="btn btn-success" @click="handleAddToCart">Add to Cart</button>
      </div>
    </div>
    <add-toast :show="showToast" :message="toastMessage"/>
  </div>
</template>

<style scoped>

</style>