<!-- vue -->
<!-- File: `src/components/CheckoutForm.vue` -->
<script>
import AccordionSection from './AccordionSection.vue';
import CartSummary from './CartSummary.vue';
import OrderConfirmationModal from './OrderConfirmationModal.vue';
import { auth } from '@/firebase/index.js';
import createOrder from '@/utils/orders.js'; // helper created above

export default {
  name: "CheckoutForm",
  data() {
    return {
      sectionOpen: [true, false, false],
      showConfirmation: false,
      localShippingName: this.shippingName || "",
      localShippingAddress: this.shippingAddress || "",
      localShippingCity: this.shippingCity || "",
      localShippingState: this.shippingState || "",
      localShippingZip: this.shippingZip || "",
      localShippingEmail: this.shippingEmail || "",
      localCardNumber: this.cardNumber || "",
      localExpDate: this.expDate || "",
      localCvv: this.cvv || "",
      errors: {}
    };
  },

  props: {
    products: { type: Array, required: true },
    cartTotal: { type: Number, required: true },
    shippingName: String,
    shippingAddress: String,
    shippingCity: String,
    shippingState: String,
    shippingZip: String,
    shippingEmail: String,
    cardNumber: String,
    expDate: String,
    cvv: String
  },

  methods: {
    clearErrors() {
      this.errors = {};
    },

    setSection(idx) {
      this.sectionOpen = [idx === 0, idx === 1, idx === 2];
    },

    validateShipping(setFirstInvalid) {
      const trim = v => (v || '').trim();
      let valid = true;

      if (!trim(this.localShippingName)) {
        this.errors.shippingName = "Please enter your name.";
        valid = false;
        if (setFirstInvalid) setFirstInvalid(0);
      }

      if (!trim(this.localShippingAddress)) {
        this.errors.shippingAddress = "Please enter your address.";
        valid = false;
        if (setFirstInvalid) setFirstInvalid(0);
      }

      if (!trim(this.localShippingCity)) {
        this.errors.shippingCity = "Please enter your city.";
        valid = false;
        if (setFirstInvalid) setFirstInvalid(0);
      }

      if (!trim(this.localShippingState)) {
        this.errors.shippingState = "Please enter your state.";
        valid = false;
        if (setFirstInvalid) setFirstInvalid(0);
      }

      if (!trim(this.localShippingZip)) {
        this.errors.shippingZip = "Please enter your zip code.";
        valid = false;
        if (setFirstInvalid) setFirstInvalid(0);
      }

      const email = trim(this.localShippingEmail);
      if (!email || !/.+@.+\..+/.test(email)) {
        this.errors.shippingEmail = "Please enter a valid email address.";
        valid = false;
        if (setFirstInvalid) setFirstInvalid(0);
      }

      return valid;
    },

    validatePayment(setFirstInvalid) {
      const trim = v => (v || '').trim();
      let valid = true;
      const digits = (this.localCardNumber || '').replace(/\s+/g, '');

      if (!trim(this.localCardNumber)) {
        this.errors.cardNumber = "Card number is required.";
        valid = false;
        if (setFirstInvalid) setFirstInvalid(1);
      } else if (!/^\d{13,19}$/.test(digits)) {
        this.errors.cardNumber = "Enter a valid card number.";
        valid = false;
        if (setFirstInvalid) setFirstInvalid(1);
      }

      if (!trim(this.localExpDate)) {
        this.errors.expDate = "Expiration date is required.";
        valid = false;
        if (setFirstInvalid) setFirstInvalid(1);
      }

      if (!trim(this.localCvv) || !/^\d{3,4}$/.test(trim(this.localCvv))) {
        this.errors.cvv = "Enter a valid CVV.";
        valid = false;
        if (setFirstInvalid) setFirstInvalid(1);
      }

      return valid;
    },

    validateForm() {
      this.clearErrors();

      let firstInvalid = null;
      const setFirstInvalid = idx => {
        if (firstInvalid === null) firstInvalid = idx;
      };

      const shippingValid = this.validateShipping(setFirstInvalid);
      const paymentValid = this.validatePayment(setFirstInvalid);

      if (!shippingValid || !paymentValid) {
        if (firstInvalid !== null) this.setSection(firstInvalid);
        return false;
      }

      return true;
    },

    // Single merged placeOrder method (fixed duplicate declaration)
    async placeOrder() {
      if (!this.validateForm()) {
        this.$nextTick(() => {
          const invalidInput = document.querySelector('.is-invalid');
          if (invalidInput) invalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        return;
      }

      // Build order payload
      const user = auth.currentUser;
      const items = (this.products || []).map(p => ({
        id: p.id,
        title: p.title,
        price: Number(p.price) || 0,
        quantity: Number(p.quantity) || 1
      }));

      const digits = (this.localCardNumber || '').replace(/\s+/g, '');
      const last4 = digits ? digits.slice(-4) : null;

      const orderPayload = {
        userId: user ? user.uid : null,
        userEmail: user ? user.email : (this.localShippingEmail || null),
        shipping: {
          name: this.localShippingName,
          address: this.localShippingAddress,
          city: this.localShippingCity,
          state: this.localShippingState,
          zip: this.localShippingZip,
          email: this.localShippingEmail
        },
        payment: {
          cardLast4: last4,
          expDate: this.localExpDate
        },
        items,
        total: Number(this.cartTotal) || 0
        // status and createdAt handled in createOrder
      };

      try {
        let orderNumber = null;

        if (user) {
          // record order for signed-in users
          orderNumber = await createOrder(orderPayload);
          this.$emit('order-placed', orderNumber);
        } else {
          // guests: do not write to DB, still allow confirmation
          this.$emit('order-placed', null);
        }

        // show confirmation and clear cart via existing UI flow
        this.showConfirmation = true;
      } catch (e) {
        console.error('Failed to create order:', e);
        alert('Failed to place order. Please try again.');
      }
    },

    toggleSection(idx) {
      this.sectionOpen = this.sectionOpen.map((open, i) => i === idx ? !open : false);
    },

    // Updated: close confirmation should clear local fields, emit empty-cart and navigate home
    closeConfirmation() {
      this.showConfirmation = false;

      // clear local form state
      this.localShippingName = '';
      this.localShippingAddress = '';
      this.localShippingCity = '';
      this.localShippingState = '';
      this.localShippingZip = '';
      this.localShippingEmail = '';
      this.localCardNumber = '';
      this.localExpDate = '';
      this.localCvv = '';

      // inform parent to clear cart
      this.$emit('empty-cart');

      // navigate back to Home
      if (this.$router) {
        this.$router.push({ name: 'Home' });
      }
    },

    updateParent(field, value) {
      this.$emit(`update:${field}`, value);
      // remove the specific field warning as soon as the user types
      if (this.errors && this.errors[field]) {
        const { [field]: removed, ...rest } = this.errors;
        this.errors = rest;
      }
    }
  },

  components: { AccordionSection, CartSummary, OrderConfirmationModal },
}
</script>

<template>
  <div class="row justify-content-center align-items-start w-100" style="min-height: 80vh;">
    <div class="col-md-7 d-flex flex-column align-items-center">
      <form @submit.prevent="placeOrder" novalidate style="width:100%;">
        <div class="accordion mb-4 mx-auto" id="checkoutAccordion" style="max-width: 700px; width: 100%;">

          <!-- SHIPPING SECTION -->
          <accordion-section title="Shipping Information" :isOpen="sectionOpen[0]" @toggle="toggleSection(0)">
            <div class="mb-3">
              <input type="text" class="form-control" :class="{'is-invalid': errors.shippingName}" placeholder="Name"
                     v-model="localShippingName" @input="updateParent('shippingName', localShippingName)">
              <div class="invalid-feedback">{{ errors.shippingName }}</div>
            </div>
            <div class="mb-3">
              <input type="text" class="form-control" :class="{'is-invalid': errors.shippingAddress}" placeholder="Address"
                     v-model="localShippingAddress" @input="updateParent('shippingAddress', localShippingAddress)">
              <div class="invalid-feedback">{{ errors.shippingAddress }}</div>
            </div>
            <div class="mb-3">
              <input type="text" class="form-control" :class="{'is-invalid': errors.shippingCity}" placeholder="City"
                     v-model="localShippingCity" @input="updateParent('shippingCity', localShippingCity)">
              <div class="invalid-feedback">{{ errors.shippingCity }}</div>
            </div>
            <div class="mb-3">
              <input type="text" class="form-control" :class="{'is-invalid': errors.shippingState}" placeholder="State"
                     v-model="localShippingState" @input="updateParent('shippingState', localShippingState)">
              <div class="invalid-feedback">{{ errors.shippingState }}</div>
            </div>
            <div class="mb-3">
              <input type="text" class="form-control" :class="{'is-invalid': errors.shippingZip}" placeholder="Zip"
                     v-model="localShippingZip" @input="updateParent('shippingZip', localShippingZip)">
              <div class="invalid-feedback">{{ errors.shippingZip }}</div>
            </div>
            <div class="mb-3">
              <input type="email" class="form-control" :class="{'is-invalid': errors.shippingEmail}" placeholder="Email"
                     v-model="localShippingEmail" @input="updateParent('shippingEmail', localShippingEmail)">
              <div class="invalid-feedback">{{ errors.shippingEmail }}</div>
            </div>
            <button class="btn btn-primary w-100" type="button" @click="sectionOpen=[false,true,false]">
              Next: Payment
            </button>
          </accordion-section>

          <!-- 🟢 PAYMENT SECTION -->
          <accordion-section title="Payment Information" :isOpen="sectionOpen[1]" @toggle="toggleSection(1)">
            <div class="mb-3">
              <input type="text" class="form-control" :class="{'is-invalid': errors.cardNumber}" placeholder="Card Number"
                     v-model="localCardNumber" @input="updateParent('cardNumber', localCardNumber)">
              <div class="invalid-feedback">{{ errors.cardNumber }}</div>
            </div>
            <div class="mb-3">
              <input type="text" class="form-control" :class="{'is-invalid': errors.expDate}" placeholder="Expiration Date"
                     v-model="localExpDate" @input="updateParent('expDate', localExpDate)">
              <div class="invalid-feedback">{{ errors.expDate }}</div>
            </div>
            <div class="mb-3">
              <input type="text" class="form-control" :class="{'is-invalid': errors.cvv}" placeholder="CVV"
                     v-model="localCvv" @input="updateParent('cvv', localCvv)">
              <div class="invalid-feedback">{{ errors.cvv }}</div>
            </div>
            <button class="btn btn-outline-secondary w-100 mb-2" type="button" @click="sectionOpen=[true,false,false]">
              Back
            </button>
            <button class="btn btn-primary w-100" type="button" @click="sectionOpen=[false,false,true]">
              Next: Review
            </button>
          </accordion-section>

          <!-- REVIEW SECTION -->
          <accordion-section title="Review & Place Order" :isOpen="sectionOpen[2]" @toggle="toggleSection(2)">
            <div>
              <strong>Shipping Address:</strong><br>
              {{ localShippingName }}<br>
              {{ localShippingAddress }}<br>
              {{ localShippingCity }}, {{ localShippingState }} {{ localShippingZip }}<br>
              <span v-if="localShippingEmail"><br><strong>Email:</strong> {{ localShippingEmail }}</span>
              <br><br>
              <strong>Card:</strong> **** **** **** {{ localCardNumber ? localCardNumber.slice(-4) : '' }}<br><br>
              <strong>Items:</strong>
              <ul>
                <li v-for="item in products" :key="item.id">
                  {{ item.title }} (x{{ item.quantity }}) - ${{ (item.price * item.quantity).toFixed(2) }}
                </li>
              </ul>
              <strong>Total:</strong> ${{ cartTotal.toFixed(2) }}
            </div>
            <button type="submit" class="btn btn-primary w-100 mt-3">Place Order</button>
            <button class="btn btn-outline-secondary w-100 mt-2" type="button" @click="sectionOpen=[false,true,false]">
              Back
            </button>
          </accordion-section>
        </div>

        <order-confirmation-modal
            v-if="showConfirmation"
            @close="closeConfirmation"
        />

      </form>
    </div>
    <div class="col-md-5 d-flex flex-column align-items-center">
      <cart-summary :products="products" :cart-total="cartTotal" style="max-width: 500px; width: 100%;" />
    </div>
  </div>
</template>

<style scoped>

</style>
