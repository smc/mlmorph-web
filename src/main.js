import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import i18n from "vue-banana-i18n";
import router from "./router";

const locale = navigator.language.split("-")[0] || "en";
const finalFallback = "en";
const messages = {
  [finalFallback]: require(`@/assets/i18n/${finalFallback}.json`)
};

try {
  messages[locale] = require(`@/assets/i18n/${locale}.json`);
} catch {
  // Not localised. We have loaded fallback locale.
}

Vue.use(i18n, {
  locale,
  finalFallback: "en",
  messages
});

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
