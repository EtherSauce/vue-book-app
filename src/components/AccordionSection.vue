<script>
export default {
  name: "AccordionSection",
  data: function(){
    return {}
  },

  // props:   Data passed into the component via attributes.
  //          Props can be optional or required. Objects and arrays
  //          are pass-by-reference. Primitives (number, string, boolean)
  //          are pass-by-value.
  props: {
    title: { type: String, required: true },
    isOpen: { type: Boolean, default: false }
  },

  // methods: Usually "events" triggered by v-on:
  methods: {
    toggle() {
      this.$emit('toggle');
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
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" :class="{collapsed: !isOpen}" type="button" @click="toggle">
        {{ title }}
      </button>
    </h2>
    <div class="accordion-collapse collapse" :class="{show: isOpen}">
      <div class="accordion-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>