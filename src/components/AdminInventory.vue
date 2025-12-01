<script>
export default {
  name: 'AdminInventory',
  props: { products: { type: Array, default: () => [] } },
  data() {
    return { editing: null };
  },
  methods: {
    openCreate() { this.editing = { title: '', author: '', price: 0 }; },
    edit(p) { this.editing = { ...p }; },
    closeEditor() { this.editing = null; },
    saveProduct() {
      if (!this.editing) return;
      if (this.editing.id) this.$emit('edit-product', this.editing);
      else this.$emit('add-product', { ...this.editing, id: Date.now() });
      this.closeEditor();
    }
  }
};
</script>

<template>
  <div>
    <h5>Inventory</h5>
    <div class="mb-3 d-flex gap-2">
      <button class="btn btn-success" @click="openCreate">Add Product</button>
    </div>

    <div v-if="!products.length" class="text-muted">No products.</div>
    <div v-for="p in products" :key="p.id" class="card p-2 mb-2 d-flex align-items-center">
      <div class="w-100 d-flex justify-content-between align-items-center">
        <div>
          <strong>{{ p.title }}</strong><br />
          <small class="text-muted">{{ p.author }} — ${{ (p.price || 0).toFixed(2) }}</small>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-primary" @click="edit(p)">Edit</button>
          <button class="btn btn-sm btn-outline-danger" @click="$emit('delete-product', p.id)">Delete</button>
        </div>
      </div>
    </div>

    <!-- simple modal-like inline editor -->
    <div v-if="editing" class="card p-3 mt-3">
      <h6>{{ editing.id ? 'Edit' : 'Create' }} Product</h6>
      <div class="mb-2">
        <input class="form-control" v-model="editing.title" placeholder="Title" />
      </div>
      <div class="mb-2">
        <input class="form-control" v-model="editing.author" placeholder="Author" />
      </div>
      <div class="mb-2">
        <input class="form-control" type="number" v-model.number="editing.price" placeholder="Price" />
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-primary" @click="saveProduct">Save</button>
        <button class="btn btn-outline-secondary" @click="closeEditor">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>