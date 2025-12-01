import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import Navbar from './components/Navbar.vue'
import BookCard from './components/BookCard.vue'
import CategorySelector from './components/CategorySelector.vue'
import ItemDetailsModal from './components/ItemDetailsModal.vue'
import CartBody from './components/CartBody.vue'
import CheckoutForm from './components/CheckoutForm.vue'
import AppFooter from './components/AppFooter.vue'
import RemoveItemModal from './components/RemoveItemModal.vue'
import MoreCategoriesModal from './components/MoreCategoriesModal.vue'
import LoginModal from './components/LoginModal.vue'
import CreateAccountModal from './components/CreateAccountModal.vue'

import '@/scss/style.scss';

const app = createApp(App)
app.use(router);

app.component('NavBar', Navbar)
app.component('BookCard', BookCard)
app.component('CategorySelector', CategorySelector)
app.component('ItemDetailsModal', ItemDetailsModal)
app.component('CartBody', CartBody)
app.component('CheckoutForm', CheckoutForm)
app.component('AppFooter', AppFooter)
app.component('RemoveItemModal', RemoveItemModal)
app.component('MoreCategoriesModal', MoreCategoriesModal)
app.component('LoginModal', LoginModal)
app.component('CreateAccountModal', CreateAccountModal)

app.mount('#app');
