<script>
import CheckoutForm from '../components/CheckoutForm.vue';

export default {
  components: { CheckoutForm },

  props: {
    products: Array,
    cartTotal: Number,
    shippingName: String,
    shippingAddress: String,
    shippingCity: String,
    shippingState: String,
    shippingZip: String,
    shippingEmail: String,
    cardNumber: String,
    expDate: String,
    cvv: String,
  },
  emits: ['order-placed', 'empty-cart',
    'update:shippingName','update:shippingAddress','update:shippingCity',
    'update:shippingState','update:shippingZip','update:shippingEmail',
    'update:cardNumber','update:expDate','update:cvv'],
};

</script>

<template>

  <main class="container my-4">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <checkout-form
            :products="products"
            :cart-total="cartTotal"

            :shipping-name="shippingName"
            :shipping-address="shippingAddress"
            :shipping-city="shippingCity"
            :shipping-state="shippingState"
            :shipping-zip="shippingZip"
            :shipping-email="shippingEmail"
            :card-number="cardNumber"
            :exp-date="expDate"
            :cvv="cvv"

            @update:shippingName="$emit('update:shippingName', $event)"
            @update:shippingAddress="$emit('update:shippingAddress', $event)"
            @update:shippingCity="$emit('update:shippingCity', $event)"
            @update:shippingState="$emit('update:shippingState', $event)"
            @update:shippingZip="$emit('update:shippingZip', $event)"
            @update:shippingEmail="$emit('update:shippingEmail', $event)"
            @update:cardNumber="$emit('update:cardNumber', $event)"
            @update:expDate="$emit('update:expDate', $event)"
            @update:cvv="$emit('update:cvv', $event)"

            @order-placed="$emit('order-placed')"
            @empty-cart="$emit('empty-cart')"
        />
      </div>
    </div>
  </main>

</template>

<style scoped>

</style>