import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import VuetifyConfirm from 'vuetify-confirm';
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.min.css";


const vuetify = new Vuetify({
    icons: {
        iconFont: "md",
    },
     theme: { dark: true }
});

Vue.use(vuetify);
Vue.use(VuetifyConfirm, {
  vuetify,
  iconfont: "md",
});

