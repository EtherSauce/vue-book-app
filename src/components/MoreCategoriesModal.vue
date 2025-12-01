<script>
export default {
  name: 'MoreCategoriesModal',
  data: function(){
    return {}
  },

  // props:   Data passed into the component via attributes.
  //          Props can be optional or required. Objects and arrays
  //          are pass-by-reference. Primitives (number, string, boolean)
  //          are pass-by-value.
  props: {
    categories: { type: Array, required: true }
  },

  // methods: Usually "events" triggered by v-on:
  methods: {
    setCategory(category) {
      this.$emit('category-selected', category);
      this.closeModal();
    },
    closeModal() {
      this.$emit('close');
    }
  },

  // computed:    Values that are updated and cached if dependencies change.
  //              Computed value functions need to return a value.
  //              Treat these like regular values that you would use
  //              in data or props.
  computed: {

  },
};
</script>

<template>
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title">More Categories</h5>
      <button type="button" class="btn-close" @click="closeModal"></button>
    </div>
    <div class="modal-body">
      <button v-for="cat in categories" :key="cat" class="btn btn-light w-100 mb-2" @click="setCategory(cat)">
        {{ cat }}
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>