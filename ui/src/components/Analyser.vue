
<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <h2 class="headline">Morphology analyser</h2>
        <v-textarea v-model="input" label="Enter text" auto-grow :value="input"></v-textarea>

        <v-btn color="primary" @click="analyse">Analyse</v-btn>
      </v-flex>
    </v-layout>
    <v-sheet :elevation="1">
      <table class="v-datatable v-table theme--light" v-if="results && Object.keys(results).length">
        <thead>
          <tr>
            <th class="text-xs-left">Word</th>
            <th class="text-xs-left">Analysis</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="key" v-if="key.trim()" v-for="(result, key) in results">
            <td class="text-xs-left">{{ key }}</td>
            <td class="text-xs-left">
              <v-sheet
                class="d-flex analysis ma-2"
                color="transparent"
                v-if="aindex==0"
                :elevation="0"
                :key="aindex"
                v-for="(analysis, aindex) in result"
              >
                <v-sheet
                  class="morpheme pa-2 ma-2 column"
                  :elevation="3"
                  :key="mindex"
                  v-for="(morpheme, mindex) in analysis.morphemes"
                >
                  <v-layout column fill-height>
                    <v-chip class="text-xs-left" color="primary" text-color="white">
                      <v-icon>bookmark_border</v-icon>
                      {{ morpheme.root }}
                    </v-chip>
                    <v-chip
                      class="text-xs-left"
                      color="teal"
                      text-color="white"
                      :key="posindex"
                      v-for="(pos, posindex) in morpheme.pos"
                    >
                      <v-icon>code</v-icon>
                      {{getTag(pos).tag}}
                    </v-chip>
                  </v-layout>
                </v-sheet>
              </v-sheet>
            </td>
          </tr>
        </tbody>
      </table>
    </v-sheet>
  </v-container>
</template>

<script>
import axios from 'axios'
import tags from '../tags.json'
export default {
  name: 'Analyser',
  data: () => ({
    input: '',
    results: ''
  }),
  methods: {
    getTag (pos) {
      return tags.find(item => item.id === pos) || {tag: pos}
    },
    analyse () {
      const api = `/api/analyse`
      axios
        .post(api, {
          text: this.input
        })
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
