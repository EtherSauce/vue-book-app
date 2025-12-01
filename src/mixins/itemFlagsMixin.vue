<script>
export default {
  data() {
    const target = this.book || this.item || {};
    return {
      localFavorite: !!target.favorite,
      localRating: target.rating || 0
    };
  },
  methods: {
    toggleFavorite() {
      this.localFavorite = !this.localFavorite;
      const target = this.book || this.item;
      if (target) target.favorite = this.localFavorite;
      this.$emit && this.$emit('favorite-changed', this.localFavorite, target);
    },
    setRating(value) {
      const r = Number(value) || 0;
      this.localRating = r;
      const target = this.book || this.item;
      if (target) target.rating = r;
      this.$emit && this.$emit('rating-changed', r, target);
    }
  }
};
</script>
