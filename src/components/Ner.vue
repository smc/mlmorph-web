
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
    input: 'കേരളത്തിന്റെ മധ്യഭാഗത്തായി സ്ഥിതി ചെയ്യുന്ന ഒരു ജില്ലയാണ് ഇടുക്കി. ആസ്ഥാനം പൈനാവ്. തൊടുപുഴ, കട്ടപ്പന, അടിമാലി നെടുംകണ്ടം, ഇടുക്കി എന്നിവയാണ് ജില്ലയിലെ മറ്റു പ്രധാന പട്ടണങ്ങൾ. 4358 ച.കി. വിസ്തീർണ്ണമുള്ള (ഇത് കേരള സംസ്ഥാനത്തിന്റെ 11 ശതമാനം വരും) ഇടുക്കി ജില്ലയാണ് കേരളത്തിലെ ഏറ്റവും വലിയ രണ്ടാമത്തെ ജില്ല (എറണാകുളം ജില്ല, കുട്ടമ്പുഴ പഞ്ചായത്ത് വേർപെടുത്തിയതിന് ശേഷം) (ഏറ്റവും വലിയ ജില്ല പാലക്കാട് ജില്ല)[3]. ഇടുക്കി ജില്ലയുടെ 50 ശതമാനത്തിലധികവും സംരക്ഷിത വനഭൂമിയാണ്. തീവണ്ടിപ്പാത ഇല്ലാത്ത കേരളത്തിലെ രണ്ടു ജില്ലകളിൽ ഒന്നാണ് ഇത് (മറ്റേത്) വയനാട്).രാജവാഴ്ച കാലത്ത് വേണാട് സമ്രാജ്യത്തിന്റെ ഭാഗമായിരുന്നു ഇടുക്കി. ദേവീകുളം, തൊടുപുഴ, ഉടുമ്പഞ്ചോല, പീരുമേട്, ഇടുക്കി എന്നിവയാണ് ജില്ലയിലെ താലൂക്കുകൾ. തൊടുപുഴയും കട്ടപ്പനയുമാണ് ജില്ലയിലെ മുനിസിപ്പാലിറ്റികൾ. 8 ബ്ലോക്ക് പഞ്ചായത്തുകളും 51 ഗ്രാമ പഞ്ചായത്തുകളും ഉണ്ട്. ഇത് കൂടാതെ, ഇടമലക്കുടി എന്ന കേരളത്തിലെ പ്രഥമ ആദിവാസി പഞ്ചായത്തായ ഇടമലക്കുടി 2010 നവംബർ ഒന്നിന് പ്രാബല്യത്തിൽ വന്നു. മൂന്നാർ പഞ്ചായത്തിന്റെ പതിമൂന്നാം വാർഡ് അടർത്തി മാറ്റിയാണ് ഇടമലക്കുടി രൂപീകരിക്കപ്പെട്ടത്. ദേവികുളം, അടിമാലി, നെടുങ്കണ്ടം, ഇളംദേശം, തൊടുപുഴ, ഇടുക്കി, കട്ടപ്പന, അഴുത എന്നിവയാണ് ബ്ലോക്ക് പഞ്ചായത്തുകൾ. ',
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
