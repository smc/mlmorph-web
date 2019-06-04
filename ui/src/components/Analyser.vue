
<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <h2 class="headline">Morphology analyser</h2>
        <v-textarea v-model="input" label="Enter text" auto-grow :value="input"></v-textarea>

        <v-btn color="primary" @click="analyse">Analyse</v-btn>
      </v-flex>
    </v-layout>
    <v-sheet :elevation="0" v-if="results && Object.keys(results).length">
      <v-card class="ma-2" :key="key" v-if="key.trim() && result.length" v-for="(result, key) in results">
        <v-card-title primary-title class="pa-1">
          <div>
            <h4 class="word ma-1 pa-2 text-xs-left">{{ key }}</h4>
            <v-sheet
                class="d-flex analysis"
                color="transparent"
                v-if="aindex==0"
                :elevation="0"
                :key="aindex"
                v-for="(analysis, aindex) in result"
              >
                <v-card-title primary-title class="align-start pa-1">
                  <v-card
                    class="morpheme column ma-2"
                    :elevation="3"
                    :key="mindex"
                    v-for="(morpheme, mindex) in analysis.morphemes"
                  >
                    <v-layout column fill-height>
                      <v-chip class="text-xs-left root" color="primary" text-color="white">
                        <v-icon>bookmark_border</v-icon>
                        {{ morpheme.root }}
                      </v-chip>
                      <v-chip
                        class="text-xs-left"
                        color="white"
                        :key="posindex"
                        v-for="(pos, posindex) in morpheme.pos"
                      >
                        <v-icon>code</v-icon>
                        {{getTag(pos).tag}}
                      </v-chip>
                    </v-layout>
                  </v-card>
                </v-card-title>
            </v-sheet>
          </div>
        </v-card-title>
      </v-card>
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
      return tags.find(item => item.id === pos) || { tag: pos }
    },
    analyse () {
      const api = `https://morph.smc.org.in/api/analyse`
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
<style>
.word,
.root {
  font-size: 1.2em;
}
</style>
