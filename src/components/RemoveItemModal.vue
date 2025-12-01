<script>
export default {
  name: "RemoveItemModal",
  data: function(){
    return {}
  },

  // props:   Data passed into the component via attributes.
  //          Props can be optional or required. Objects and arrays
  //          are pass-by-reference. Primitives (number, string, boolean)
  //          are pass-by-value.
  props: {
    show: { type: Boolean, required: true },
    item: { type: Object, required: true }
  },

  // methods: Usually "events" triggered by v-on:
  methods: {
    confirm() { this.$emit('confirm'); },
    cancel() { this.$emit('cancel'); }
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
  <div v-if="show" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5); z-index: 1055;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Remove Item</h5>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to remove <strong>{{ item.title }}</strong> from your cart?</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cancel">No</button>
          <button class="btn btn-danger" @click="confirm">Yes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>