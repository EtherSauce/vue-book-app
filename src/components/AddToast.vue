<script>
export default {
  name: "AddToast",
  data: function(){
    return {}
  },

  // props:   Data passed into the component via attributes.
  //          Props can be optional or required. Objects and arrays
  //          are pass-by-reference. Primitives (number, string, boolean)
  //          are pass-by-value.
  props: {
    show: { type: Boolean, required: true },
    message: { type: String, required: true }
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
  <div v-if="show" class="toast align-items-center text-bg-success show"
       style="position: absolute; bottom: 10px; left: 2%; right: 2%; width: 96%; z-index: 20; box-sizing: border-box;">
    <div class="d-flex">
      <div class="toast-body text-center w-100">{{ message }}</div>
    </div>
  </div>
</template>

<style scoped>

</style>