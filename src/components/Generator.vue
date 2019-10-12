
<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <h2 class="headline">Morphology generator</h2>
        <v-text-field v-model="input" label="Enter morphemes" auto-grow :value="input"></v-text-field>
        <v-btn color="primary" @click="generate">generate</v-btn>
        <h2 v-if="results&&results.length>0">{{results[0]}}</h2>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Generator',
  data: () => ({
    input: 'പഞ്ചസാര<n><adj>മണൽ<n><adj>തരി<n><pl><locative>ഉം<cnj>ആണ്<aff>',
    results: ''
  }),
  methods: {
    generate () {
      const api = `/api/generate?word=${this.input}`
      axios
        .get(api)
        .then(response => {
          this.results = response.data.result
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
