<script>
export default {
  name: 'Wishlist',
  props: { items: { type: Array, default: () => [] } }
};
</script>

<template>
  <div>
    <h5>Wishlist</h5>
    <div v-if="!items.length" class="text-muted">No items in wishlist.</div>
    <div v-for="it in items" :key="it.id" class="d-flex align-items-center card p-2 mb-2">
      <div class="flex-grow-1">
        <strong>{{ it.title }}</strong><br />
        <small class="text-muted">{{ it.author }}</small>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-success" @click="$emit('add-to-cart', it)">Add to Cart</button>
        <button class="btn btn-sm btn-outline-danger" @click="$emit('remove', it)">Remove</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>