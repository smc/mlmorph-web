<template>
  <v-container fluid>
    <v-form>
      <h2>Named entity recognition</h2>
      <v-textarea
        v-model="input"
        label="Enter text"
        auto-grow
        :value="input"
      ></v-textarea>
      <v-btn color="primary" @click="ner">Process</v-btn>
      <v-progress-linear
        :active="loading"
        :indeterminate="true"
      ></v-progress-linear>
      <v-divider></v-divider>
    </v-form>
    <v-layout justify-center wrap class="ma-2" align-center>
      <v-card
        class="ma-2"
        height="300px"
        min-width="250px"
        max-width="250px"
        :elevation="3"
        :key="entity.title"
        v-for="entity in entities"
        :href="entity.content_urls && entity.content_urls.desktop.page"
      >
        <v-img
          :src="entity.thumbnail && entity.thumbnail.source"
          cover
          height="250px"
        >
          <v-row class="fill-height align-end mb-0" style="opacity: 0.85;">
            <v-col class="py-0">
              <v-card-title
                class="px-2 grey darken-3 white--text overflow-hidden text-no-wrap"
              >
                <h3 class="headline">{{ entity.title }}</h3>
              </v-card-title>
            </v-col>
          </v-row>
        </v-img>
        <v-card-text class="px-2 overflow-hidden text-no-wrap">
          <p class="subtitle">{{ entity.description }}</p>
        </v-card-text>
      </v-card>
    </v-layout>
    <v-footer class="pa-3">
      <p class="text-sm-left text-md-left">
        For more details on see the article
        <a
          href="https://thottingal.in/blog/2019/03/10/malayalam-named-entity-recognition-using-morphology-analyser/"
          >Malayalam Named Entity Recognition using morphology analyser</a
        >
      </p>
    </v-footer>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "NER",
  data: () => ({
    input:
      "കേരളത്തിന്റെ മധ്യഭാഗത്തായി സ്ഥിതി ചെയ്യുന്ന ഒരു ജില്ലയാണ് ഇടുക്കി. ആസ്ഥാനം പൈനാവ്. തൊടുപുഴ, കട്ടപ്പന, അടിമാലി നെടുംകണ്ടം, ഇടുക്കി എന്നിവയാണ് ജില്ലയിലെ മറ്റു പ്രധാന പട്ടണങ്ങൾ. 4358 ച.കി. വിസ്തീർണ്ണമുള്ള (ഇത് കേരള സംസ്ഥാനത്തിന്റെ 11 ശതമാനം വരും) ഇടുക്കി ജില്ലയാണ് കേരളത്തിലെ ഏറ്റവും വലിയ രണ്ടാമത്തെ ജില്ല (എറണാകുളം ജില്ല, കുട്ടമ്പുഴ പഞ്ചായത്ത് വേർപെടുത്തിയതിന് ശേഷം) (ഏറ്റവും വലിയ ജില്ല പാലക്കാട് ജില്ല)[3]. ഇടുക്കി ജില്ലയുടെ 50 ശതമാനത്തിലധികവും സംരക്ഷിത വനഭൂമിയാണ്. തീവണ്ടിപ്പാത ഇല്ലാത്ത കേരളത്തിലെ രണ്ടു ജില്ലകളിൽ ഒന്നാണ് ഇത് (മറ്റേത്) വയനാട്).രാജവാഴ്ച കാലത്ത് വേണാട് സമ്രാജ്യത്തിന്റെ ഭാഗമായിരുന്നു ഇടുക്കി. ദേവീകുളം, തൊടുപുഴ, ഉടുമ്പഞ്ചോല, പീരുമേട്, ഇടുക്കി എന്നിവയാണ് ജില്ലയിലെ താലൂക്കുകൾ. തൊടുപുഴയും കട്ടപ്പനയുമാണ് ജില്ലയിലെ മുനിസിപ്പാലിറ്റികൾ. 8 ബ്ലോക്ക് പഞ്ചായത്തുകളും 51 ഗ്രാമ പഞ്ചായത്തുകളും ഉണ്ട്. ഇത് കൂടാതെ, ഇടമലക്കുടി എന്ന കേരളത്തിലെ പ്രഥമ ആദിവാസി പഞ്ചായത്തായ ഇടമലക്കുടി 2010 നവംബർ ഒന്നിന് പ്രാബല്യത്തിൽ വന്നു. മൂന്നാർ പഞ്ചായത്തിന്റെ പതിമൂന്നാം വാർഡ് അടർത്തി മാറ്റിയാണ് ഇടമലക്കുടി രൂപീകരിക്കപ്പെട്ടത്. ദേവികുളം, അടിമാലി, നെടുങ്കണ്ടം, ഇളംദേശം, തൊടുപുഴ, ഇടുക്കി, കട്ടപ്പന, അഴുത എന്നിവയാണ് ബ്ലോക്ക് പഞ്ചായത്തുകൾ. ",
    entities: [],
    loading: false
  }),
  methods: {
    process(result) {
      var entities = {};
      let tokens = this.input.split(/\s+/);
      for (let i = 0; i < tokens.length; i++) {
        let key = tokens[i];
        let values = result[key];
        if (!values) continue;
        for (let i = 0; i < values.length; i++) {
          let entity = this.findEntity(values[i]);
          if (entity.length > 1) {
            entities[entity] = {};
          }
          // For now, take only first analysis
          if (i >= 1) break;
        }
      }
      return entities;
    },
    getWikiInfo(title) {
      return axios
        .get(`https://ml.wikipedia.org/api/rest_v1/page/summary/${title}`)
        .then(res => res.data);
    },
    findEntity(result) {
      let morphemes = result.morphemes;
      for (let i = 0; i < morphemes.length; i++) {
        let morpheme = morphemes[i];
        let tags = morpheme.pos;
        if (tags[0] === "np" || tags[0] === "n") return morpheme.root;
      }
      return false;
    },

    ner() {
      this.entities = [];
      const api = `/api/analyse`;
      this.loading = true;
      return axios
        .post(api, {
          text: this.input
        })
        .then(response => {
          const entities = this.process(response.data.result);
          for (var entity in entities) {
            this.getWikiInfo(entity)
              .then(pageInfo => {
                if (
                  pageInfo.title &&
                  pageInfo.title.trim() &&
                  pageInfo.thumbnail
                )
                  this.entities.push(pageInfo);
                this.loading = false;
              })
              .catch(error => {
                // eslint-disable-next-line no-console
                console.log(error);
                this.loading = false;
              });
          }
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log(error);
          this.loading = false;
        });
    }
  }
};
</script>
