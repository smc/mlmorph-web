<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <h2 class="headline">Morphology analyser</h2>
        <v-textarea
          v-model="input"
          label="Enter text"
          auto-grow
          :value="input"
        ></v-textarea>

        <v-btn color="primary" @click="analyse">Analyse</v-btn>
        <v-progress-linear
          :active="loading"
          :indeterminate="true"
        ></v-progress-linear>
      </v-flex>
    </v-layout>
    <v-flex xs12>
      <v-sheet
        elevation="1"
        class="my-2"
        :key="word"
        v-for="(result, word) in analysis"
      >
        <v-flex xs3 sm3 md3 lg3 class="title text-left px-2 mb-2">
          {{ word }}
        </v-flex>
        <v-flex md9 lg9 v-if="result">
          <v-row
            class="d-flex analysis mx-4"
            :key="aindex"
            v-for="(analysis, aindex) in result"
          >
            <template v-if="aindex == 0">
              <v-card
                class="morpheme ma-2 py-0"
                tile
                flat
                outlined
                :key="mindex"
                v-for="(morpheme, mindex) in analysis.morphemes"
              >
                <v-card-title
                  class="grey lighten-3 pa-1 text-left body-1 root mx-0"
                  >{{ morpheme.root }}</v-card-title
                >
                <v-list dense>
                  <v-list-item-group>
                    <v-list-item
                      v-for="(pos, posindex) in morpheme.pos"
                      :key="posindex"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-tag-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title
                          class="text-left"
                          v-text="getTag(pos).tag"
                        ></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </template>
          </v-row>
        </v-flex>
      </v-sheet>
    </v-flex>
  </v-container>
</template>

<script>
import axios from "axios";
import tags from "../tags.json";
export default {
  name: "Analyser",
  data: () => ({
    input:
      "ഇന്നലെയും മലപ്പുറത്ത് നല്ല മഴ പെയ്തിരുന്നു. കുട്ടികൾ സ്കൂളിൽ പോയില്ല",
    analysis: {},
    loading: false
  }),
  methods: {
    getTag(pos) {
      return tags.find(item => item.id === pos) || { tag: pos };
    },
    analyse() {
      const api = `/api/analyse`;
      const words = this.input.split(" ");
      this.analysis = {};
      this.loading = true;
      axios
        .post(api, {
          text: this.input
        })
        .then(response => {
          const results = response.data.result;
          for (let i = 0; i < words.length; i++) {
            this.$set(this.analysis, words[i], results[words[i]]);
          }
          this.loading = false;
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
