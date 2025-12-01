<script>
import RemoveItemModal from '../components/RemoveItemModal.vue';

export default {
  components: { RemoveItemModal },

  props: {
    products: Array,
    itemToRemove: Object,
    showRemoveModal: Boolean,
  },
  emits: ['update-quantity', 'remove-item', 'confirm-remove', 'cancel-remove'],
};

</script>

<template>
  <main class="container my-4">
    <cart-body
        :products="products"
        @update-quantity="(item, newQty) => $emit('update-quantity', item, newQty)"
        @remove-item="item => $emit('remove-item', item)"
        @checkout="$router.push('/checkout')"
    />

    <remove-item-modal
        v-if="itemToRemove"
        :show="showRemoveModal"
        :item="itemToRemove"
        @confirm="$emit('confirm-remove')"
        @cancel="$emit('cancel-remove')"
    />
  </main>
</template>

<style scoped>

</style>