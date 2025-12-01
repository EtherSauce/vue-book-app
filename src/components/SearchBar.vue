<script>
export default {
  name: "SearchBar",
  data: function(){
    return {}
  },

  // props:   Data passed into the component via attributes.
  //          Props can be optional or required. Objects and arrays
  //          are pass-by-reference. Primitives (number, string, boolean)
  //          are pass-by-value.
  props: {
    searchQuery: { type: String, default: "" }
  },

  // methods: Usually "events" triggered by v-on:
  methods: {
    updateSearchQuery(eventOrValue) {
      const value = typeof eventOrValue === 'string'
          ? eventOrValue
          : (eventOrValue && eventOrValue.target ? eventOrValue.target.value : '');
      this.$emit('update:searchQuery', value);
      this.$emit('search', value);
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
  <div class="search-bar">
    <input
        type="search"
        class="form-control"
        :value="searchQuery"
        @input="updateSearchQuery"
        @search="updateSearchQuery"
        placeholder="Search for books..."
        aria-label="Search"
    />
  </div>
</template>

<style scoped>

</style>