<script>
import CartItem from './CartItem.vue';

export default {
  name: "CartBody",
  data: function(){
    return {}
  },

  // props:   Data passed into the component via attributes.
  //          Props can be optional or required. Objects and arrays
  //          are pass-by-reference. Primitives (number, string, boolean)
  //          are pass-by-value.
  props: {
    products: { type: Array, required: true }
  },

  // methods: Usually "events" triggered by v-on:
  methods: {
    updateQuantity(item, newQty) {
      this.$emit('update-quantity', item, newQty);
    },
    removeFromCart(item) {
      this.$emit('remove-item', item);
    },
    checkout() {
      this.$emit('checkout');
    }
  },
  components: {
    CartItem
  },

  // computed:    Values that are updated and cached if dependencies change.
  //              Computed value functions need to return a value.
  //              Treat these like regular values that you would use
  //              in data or props.
  computed: {
    cartTotal() {
      return this.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  },
}
</script>

<template>
  <div>
    <h2>Your Cart</h2>
    <div v-if="products.length">
      <cart-item
          v-for="item in products"
          :key="item.id"
          :item="item"
          @update-quantity="updateQuantity"
          @remove-item="removeFromCart"
      />
      <div class="text-end fw-bold">Total: ${{ cartTotal.toFixed(2) }}</div>
      <section class="container my-4 d-flex justify-content-between">
        <!-- use router navigation instead of static href -->
        <button class="btn btn-secondary" type="button" @click="$router.push({ name: 'Home' })">Continue Shopping</button>
        <button class="btn btn-success" type="button" @click="checkout">Checkout</button>
      </section>
    </div>
    <div v-else class="alert alert-info mt-4">Your cart is empty.</div>
  </div>
</template>

<style scoped>

</style>