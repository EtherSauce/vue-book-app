<script>
import Book from './Book.vue';

export default class Cart {
  constructor(initialItems = []) {
    this.items = [];
    (initialItems || []).forEach(it => {
      const qty = it.quantity || it.qty || 1;
      this.add(it, qty);
    });
  }

  _normalizeBook(bookLike) {
    return bookLike instanceof Book ? bookLike : new Book(bookLike || {});
  }

  _findIndexById(id) {
    return this.items.findIndex(i => i.id === id);
  }

  add(bookLike, qty = 1) {
    const book = this._normalizeBook(bookLike);
    const idx = this._findIndexById(book.id);
    if (idx > -1) {
      this.items[idx].quantity = (Number(this.items[idx].quantity) || 0) + Number(qty || 1);
    } else {
      const item = Object.assign({}, book.toPlain(), { quantity: Number(qty || 1) });
      this.items.push(item);
    }
    return this.items;
  }

  updateQuantity(itemLike, newQty) {
    const id = itemLike && itemLike.id;
    const idx = this._findIndexById(id);
    if (idx === -1) return;
    newQty = Number(newQty) || 0;
    if (newQty <= 0) {
      this.items.splice(idx, 1);
    } else {
      this.items[idx].quantity = newQty;
    }
  }

  remove(itemLike) {
    const id = itemLike && itemLike.id;
    const idx = this._findIndexById(id);
    if (idx > -1) this.items.splice(idx, 1);
  }

  clear() {
    this.items = [];
  }

  total() {
    return this.items.reduce((sum, i) => sum + (Number(i.price || 0) * Number(i.quantity || 0)), 0);
  }

  count() {
    return this.items.reduce((s, i) => s + (Number(i.quantity) || 0), 0);
  }

  toArray() {
    return this.items.map(i => Object.assign({}, i));
  }
}
</script>
