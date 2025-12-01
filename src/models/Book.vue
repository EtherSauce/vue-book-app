<script>
export default class Book {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.title = data.title ?? '';
    this.author = data.author ?? '';
    this.price = Number(data.price ?? 0) || 0;
    this.image = data.image ?? data.img ?? '';
    this.category = data.category ?? '';
    this.parentCategory = data.parentCategory ?? '';
    this.categories = Array.isArray(data.categories) ? data.categories.slice() : (data.categories ? [data.categories] : []);
    this.description = data.description ?? '';
    this.dailyDeal = !!data.dailyDeal;
  }

  toPlain() {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      price: this.price,
      image: this.image,
      category: this.category,
      parentCategory: this.parentCategory,
      categories: this.categories.slice(),
      description: this.description,
      dailyDeal: this.dailyDeal,
    };
  }
}
</script>
