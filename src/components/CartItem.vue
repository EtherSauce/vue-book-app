<script>
import RemoveItemModal from "./RemoveItemModal.vue";

export default {
  name: "CartItem",
  data: function(){
    return {
      showRemoveModal: false
    }
  },

  // props:   Data passed into the component via attributes.
  //          Props can be optional or required. Objects and arrays
  //          are pass-by-reference. Primitives (number, string, boolean)
  //          are pass-by-value.
  props: {
    item: { type: Object, required: true }
  },

  // methods: Usually "events" triggered by v-on:
  methods: {
    incrementQty() {
      this.$emit('update-quantity', this.item, this.item.quantity + 1);
    },
    decrementQty() {
      if (this.item.quantity > 1) {
        this.$emit('update-quantity', this.item, this.item.quantity - 1);
      }
    },
    removeItem() {
      this.showRemoveModal = true;
    },
    confirmRemove() {
      this.$emit('remove-item', this.item);
      this.showRemoveModal = false;
    },
    cancelRemove() {
      this.showRemoveModal = false;
    }
  },

  // computed:    Values that are updated and cached if dependencies change.
  //              Computed value functions need to return a value.
  //              Treat these like regular values that you would use
  //              in data or props.
  computed: {
    itemTotal() {
      return (this.item.price * this.item.quantity).toFixed(2);
    }
  },

  components: { RemoveItemModal },
}
</script>

<template>
  <div>
    <div class="row border rounded mb-3 p-3 align-items-center">
      <div class="col-12 col-md-3 mb-2 mb-md-0">
        <div><strong class="d-md-none">Book:</strong> {{ item.title }}</div>
        <div class="text-muted small"><strong class="d-md-none">Author:</strong> {{ item.author }}</div>
      </div>
      <div class="col-12 col-md-2 mb-2 mb-md-0"></div>
      <div class="col-12 col-md-3 mb-2 mb-md-0">
        <strong class="d-md-none">Quantity:</strong>
        <div class="input-group" style="max-width: 120px;">
          <button
              class="btn btn-outline-secondary"
              type="button"
              @click="decrementQty"
              :disabled="item.quantity <= 1"
          >-</button>
          <span class="btn btn-outline-secondary bg-white text-dark" style="pointer-events: none;">{{ item.quantity }}</span>
          <button class="btn btn-outline-secondary" type="button" @click="incrementQty">+</button>
        </div>
      </div>
      <div class="col-12 col-md-2 mb-2 mb-md-0">
        <strong class="d-md-none">Price:</strong> ${{ itemTotal }}
      </div>
      <div class="col-12 col-md-2">
        <button class="btn btn-danger btn-sm mt-2 mt-md-0" @click="removeItem">Remove</button>
      </div>
    </div>
    <remove-item-modal
        :show="showRemoveModal"
        :item="item"
        @confirm="confirmRemove"
        @cancel="cancelRemove"
    />
  </div>
</template>

<style scoped>

</style>