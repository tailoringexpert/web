import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import VuetifyConfirm from 'vuetify-confirm';
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.min.css";

import { createApp } from "vue"
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App).use(vuetify).mount('#app')
