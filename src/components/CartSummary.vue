<script>
export default {
  name: "CartSummary",
  data: function(){
    return {}
  },

  // props:   Data passed into the component via attributes.
  //          Props can be optional or required. Objects and arrays
  //          are pass-by-reference. Primitives (number, string, boolean)
  //          are pass-by-value.
  props: {
    products: { type: Array, required: true },
    cartTotal: { type: Number, required: true }
  },

  // methods: Usually "events" triggered by v-on:
  methods: {

  },

  // computed:    Values that are updated and cached if dependencies change.
  //              Computed value functions need to return a value.
  //              Treat these like regular values that you would use
  //              in data or props.
  computed: {

  },
}
</script>

<template>
  <div>
    <h4>Your Cart</h4>
    <table class="table">
      <thead>
      <tr>
        <th>Item</th>
        <th>Price</th>
        <th>Qty</th>
        <th>Total</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in products" :key="item.id">
        <td>{{ item.title }}</td>
        <td>${{ item.price.toFixed(2) }}</td>
        <td>{{ item.quantity }}</td>
        <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
      </tr>
      <tr v-if="products.length">
        <td colspan="3" class="text-end fw-bold">Total</td>
        <td class="fw-bold">${{ cartTotal.toFixed(2) }}</td>
      </tr>
      <tr v-else>
        <td colspan="4" class="text-center text-muted">Your cart is empty.</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>