
<template>
  <v-container fluid grid-list-md>
    <h2>Named entity recognition</h2>
    <v-textarea v-model="input" label="Enter text" auto-grow :value="input"></v-textarea>
    <v-btn color="primary" @click="ner">Process</v-btn>
    <v-divider></v-divider>
    <v-layout row wrap>
      <v-card
        class="ma-2"
        width="30%"
        :elevation="3"
        :key="title"
        v-if="pageInfo.description||pageInfo.extract"
        v-for="(pageInfo, title) in entities"
      >
        <v-img v-if="pageInfo.thumbnail" :src="pageInfo.thumbnail.source" aspect-ratio="2.75"></v-img>

        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{title}}</h3>
            <h4 class="mb-0">{{pageInfo.description}}</h4>
            <div class="overflow-y-hidden extract text-xs-left">{{ pageInfo.extract}}</div>
          </div>
        </v-card-title>
        <v-card-actions v-if="pageInfo.content_urls && pageInfo.content_urls.desktop">
          <v-btn flat color="gray" :href="pageInfo.content_urls.desktop.page">
            <v-icon>link</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>
     <v-footer absolute class="pa-3">
      <p class="text-sm-left text-md-left">
        For more details on see the article
        <a
          href="https://thottingal.in/blog/2019/03/10/malayalam-named-entity-recognition-using-morphology-analyser/"
        >
          Malayalam Named Entity Recognition using morphology analyser
        </a>
      </p>
    </v-footer>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'NER',
  data: () => ({
    input: '',
    entities: {}
  }),
  methods: {
    process (result) {
      var entities = {}
      let tokens = this.input.split(/\s+/)
      for (let i = 0; i < tokens.length; i++) {
        let key = tokens[i]
        let values = result[key]
        if (!values) continue
        for (let i = 0; i < values.length; i++) {
          let entity = this.findEntity(values[i])
          if (entity.length > 1) {
            entities[entity] = {}
            this.getWikiInfo(entity).then(pageInfo => {
              entities[entity] = pageInfo
            })
          }
          // For now, take only first analysis
          if (i >= 1) break
        }
      }
      return entities
    },
    getWikiInfo (title) {
      return axios
        .get(`https://ml.wikipedia.org/api/rest_v1/page/summary/${title}`)
        .then(res => res.data)
    },
    findEntity (result) {
      let morphemes = result.morphemes
      for (let i = 0; i < morphemes.length; i++) {
        let morpheme = morphemes[i]
        let tags = morpheme.pos
        if (tags[0] === 'np' || tags[0] === 'n') return morpheme.root
      }
      return false
    },

    ner () {
      this.entities = {}
      const api = `${process.env.BASE_URL}/api/analyse`
      return axios
        .post(api, {
          text: this.input
        })
        .then(response => {
          this.entities = this.process(response.data.result)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style>
.extract {
  max-height: 200px;
}
</style>
