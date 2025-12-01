<script>
export default {
  name: "OrderConfirmationModal",
  data: function(){
    return {}
  },

  // props:   Data passed into the component via attributes.
  //          Props can be optional or required. Objects and arrays
  //          are pass-by-reference. Primitives (number, string, boolean)
  //          are pass-by-value.
  props: {

  },

  // methods: Usually "events" triggered by v-on:
  methods: {
    closeConfirmation() {
      console.log("Modal closeConfirmation emitted");
      this.$emit('close');
    }
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
  <div class="modal show" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Order Confirmation</h5>
          <button type="button" class="btn-close" @click="closeConfirmation"></button>
        </div>
        <div class="modal-body">
          <p>Your order has been placed! A confirmation and e-receipt have been sent to your email.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="closeConfirmation">Back to Home</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>