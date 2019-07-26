<template>
  <v-app light>
    <v-navigation-drawer fixed v-model="drawer" app>
      <h1>{{$i18n(appName)}}</h1>

      <h3>{{$i18n('app_desc')}}</h3>
      <v-divider></v-divider>
      <v-list dense class="pt-0">
        <v-list-tile v-for="item in items" :key="item.title" :to="item.href">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{$i18n(item.title)}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app color="primary">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" class="white--text"></v-toolbar-side-icon>
      <v-toolbar-title href="/" class="white--text">{{$i18n(appName)}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <LanguageSelector @changeLocale="onChangeLocale"/>
    </v-toolbar>
    <v-content id="content">
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import LanguageSelector from './components/LanguageSelector'

export default {
  name: 'Mlmorph',
  components: {
    LanguageSelector
  },
  data: () => ({
    appName: 'app_name',
    items: [
      { title: 'analyser_title', icon: 'apps', href: '/' },
      { title: 'generator_title', icon: 'apps', href: '/generator' },
      { title: 'ner_title', icon: 'apps', href: '/ner' },
      { title: 'spellchecker_title', icon: 'apps', href: '/spellcheck' },
      { title: 'numberspellout_title', icon: 'apps', href: '/number' },
      { title: 'app_about', icon: 'question_answer', href: '/about' },
      { title: 'app_code', icon: 'code', href: 'https://gitlab.com/smc/mlmorph' }
    ],
    drawer: null
  }),
  methods: {
    onChangeLocale: function (locale) {
      console.log(locale)
      this.i18n.locale = locale
    }
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, "Lato", "Manjari", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#content {
  margin-top: 20px;
}
</style>
