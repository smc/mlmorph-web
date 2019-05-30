
<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <h2 class="headline">Morphology analyser</h2>
            </v-card-title>
            <v-textarea
              v-model="generate_input"
              label="Enter text"
              auto-grow
              :value="generate_input"
            ></v-textarea>

          <v-card-actions>
            <v-btn color="primary" @click="analyse">Analyse</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <h2 class="headline">Morphology generator</h2>
          </v-card-title>
          <v-text-field
            v-model="generate_input"
            label="Enter morphemes"
            auto-grow
            :value="generate_input"
            @input="update"
          ></v-text-field>
          <v-card-actions>
            <v-btn color="primary" @click="generate">generate</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "Morph",
  data: () => ({
    generate_input: "",
    generate_input: "",
    analyse_result: "",
    generate_result: ""
  }),
  methods: {
    generate() {
      const api = `https://morph.smc.org.in/api/analyse`;
      axios
        .post(api, {
          text: this.generate_input
        })
        .then(response => {
          this.result = response.data.results;
        })
        .catch(error => {
          console.log(error);
        });
    },
    analyse() {
      const api = `https://morph.smc.org.in/api/analyse`;
      axios
        .post(api, {
          text: this.generate_input
        })
        .then(response => {
          this.result = response.data.results;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
