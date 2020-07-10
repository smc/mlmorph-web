<template>
  <v-app light>
    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.mdAndUp"
      v-model="drawer"
      app
    >
      <h3>{{ $i18n("app_desc") }}</h3>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item-group color="primary">
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.href">
            <v-list-item-icon>
              <v-icon v-text="item.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="$i18n(item.title)" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="primary"
      app
      hide-on-scroll
      elevate-on-scroll
      class="pa-0"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        <v-img
          :aspect-ratio="1 / 1"
          width="32"
          height="32"
          contain
          src="@/assets/logo.svg?lazy"
      /></v-app-bar-nav-icon>
      <v-toolbar-title href="/" class="white--text">{{
        $i18n(appName)
      }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <LanguageSelector @changeLocale="onChangeLocale" />
    </v-app-bar>
    <v-content id="content">
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import LanguageSelector from "./components/LanguageSelector";

export default {
  name: "Mlmorph",
  components: {
    LanguageSelector
  },
  data: () => ({
    appName: "app_name",
    items: [
      { title: "analyser_title", icon: "mdi-home", href: "/" },
      { title: "generator_title", icon: "mdi-apps", href: "/generator" },
      { title: "ner_title", icon: "mdi-apps", href: "/ner" },
      { title: "spellchecker_title", icon: "mdi-apps", href: "/spellcheck" },
      { title: "numberspellout_title", icon: "mdi-apps", href: "/number" },
      { title: "app_about", icon: "mdi-information", href: "/about" }
    ],
    drawer: null
  }),
  methods: {
    onChangeLocale: function(locale) {
      this.i18n.locale = locale;
    }
  }
};
</script>

<style>
@import url("https://smc.org.in/fonts/manjari.css");
#app {
  font-family: "Avenir", Helvetica, "Lato", "Manjari", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#content {
  margin-top: 20px;
}
</style>
