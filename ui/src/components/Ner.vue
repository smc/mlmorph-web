
<template>
  <v-container fluid grid-list-md>
    <h2>Named entity recognition</h2>
    <v-textarea v-model="input" label="Enter text" auto-grow :value="input"></v-textarea>
    <v-btn color="primary" @click="process">Process</v-btn>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "NER",
  data: () => ({
    input: "",
    result: "",
    status: ""
  }),
  methods: {
    process() {
      if (this.input) {
        this.ner(this.input);
      }
    },
    ner(text) {
      this.progress = 20;
      const api = `https://morph.smc.org.in/api/ner`;
      axios
        .post(api, {
          text: this.input
        })
        .then(response => {
          this.result = response.data.results;
          this.progress = 30;
        })
        .catch(error => {
          console.log(error);
          this.progress = 0;
        });
    }
  }
};
</script>
