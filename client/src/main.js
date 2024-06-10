import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import vi from 'element-plus/dist/locale/vi.js'
import { createStore } from 'vuex';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

// Nucleo Icons
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";

import materialKit from "./material-kit";

const store = createStore({
  state() {
      const storedCart = localStorage.getItem('cart');
      const parsedCart = JSON.parse(storedCart);

      if (Array.isArray(parsedCart)) {
          const cartTotalQty = parsedCart.reduce((acc, data) => acc + data.qty, 0);
          const cartTotalAmount = parsedCart.reduce((acc, data) => acc + data.price * data.qty, 0);
          return {
              cart: parsedCart,
              cartTotalQty: cartTotalQty,
              cartTotalAmount: cartTotalAmount
          };
      } else {
          return {
              cart: [],
              cartTotalQty: 0,
              cartTotalAmount: 0
          };
      }
  },
  mutations: {
      updateToCart(state) {
          const storedCart = localStorage.getItem('cart');
          const parsedCart = JSON.parse(storedCart);

          if (Array.isArray(parsedCart)) {
              state.cart = parsedCart;
              state.cartTotalQty = parsedCart.reduce((acc, data) => acc + data.qty, 0);
              state.cartTotalAmount = parsedCart.reduce((acc, data) => acc + data.price * data.qty, 0);
          } else {
              state.cart = [];
              state.cartTotalQty = 0;
              state.cartTotalAmount = 0;
          }

      },
  },
});

const app = createApp(App);

app.use(store); 
app.use(ToastPlugin);
app.use(createPinia());
app.use(router);
app.use(materialKit);
app.use(ElementPlus, {
    locale: vi,
  })
app.mount("#app");
