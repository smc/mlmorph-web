import Vue from "vue";
import Router from "vue-router";

const routerOptions = [
  { path: "/", component: "Analyser" },
  { path: "/generator", component: "Generator" },
  { path: "/ner", component: "Ner" },
  { path: "/number", component: "Number" },
  { path: "/spellcheck", component: "Spellchecker" },
  { path: "/about", component: "About" },
  { path: "*", component: "404" }
];

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/components/${route.component}.vue`)
  };
});

Vue.use(Router);

export default new Router({
  routes,
  mode: "history"
});
