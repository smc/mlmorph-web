// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import i18n from 'vue-banana-i18n'
import 'vuetify/dist/vuetify.min.css'
import App from './App'
import router from './router'
import ml from './i18n/ml.json'
import en from './i18n/en.json'

Vue.use(Vuetify)

Vue.use(i18n, {
  locale: navigator.language || 'en',
  messages: { en, ml }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
