
<template>
  <v-container fluid grid-list-md>
    <h2>Spellchecker</h2>
    <v-textarea name='spell_input' v-model="input" label='Enter text to spellcheck' auto-grow :value=input @input="update"></v-textarea>
    <template v-for='(suggestion, index) in suggestions'>
      <v-btn flat :key='index'>{{ suggestion }}</v-btn>
    </template>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Spellchecker',
  data: () => ({
    input: '',
    results: {}
  }),
  computed: {
    suggestions: function (word) {
      return this.results[word] || ['Suggestion1']
    }
  },
  methods: {
    update() {
      this.spellcheck(this.input)
    },
    spellcheck() {
      const api = `https://morph.smc.org.in/api/spellcheck`
      axios.post(api, {
        text: this.input
      })
      .then(response => {
        this.results = response.data.results
      })
      .catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
