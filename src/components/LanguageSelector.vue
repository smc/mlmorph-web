<template>
    <v-flex xs4 sm2 d-flex>
    <v-select
        dark
        v-model="i18n.locale"
        :items="locales"
        item-text="autonym"
        item-value="code"
        prepend-icon="mdi-translate"
        @change="onChange"
    ></v-select>
    </v-flex>
</template>

<script>
export default {
  name: 'LanguageSelector',
  data: () => ({
    locales: [
      { code: 'en', autonym: 'English' },
      { code: 'ml', autonym: 'മലയാളം' }
    ]
  }),
  methods: {
    onChange: function (locale) {
      this.$emit('changeLocale', locale)
      this.i18n.locale = locale
    }
  }
}
</script>
