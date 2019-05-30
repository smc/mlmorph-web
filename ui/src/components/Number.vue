
<template>
  <v-container fluid grid-list-md>
    <h2>Number spellout</h2>
    <v-text-field
      type="number"
      v-model="input"
      label="Enter a number to spellout it in Malayalam"
      auto-grow
      :value="input"
      @input="update"
    >
      <template v-slot:progress>
        <v-progress-linear v-if="custom" :value="progress" :color="color" height="7"></v-progress-linear>
      </template>
    </v-text-field>
    <div class="result">{{result}}</div>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "NumberSpellout",
  data: () => ({
    input: "",
    result: "",
    status: "",
    progress: 10
  }),
  computed: {
    color() {
      return ["error", "wait", "progress", "warning", "success"][
        Math.floor(this.progress / 10)
      ];
    }
  },
  methods: {
    update() {
      this.progress = 10;
      this.spellout(this.input);
    },
    spellout() {
      this.progress = 20;
      const api = `https://morph.smc.org.in/api/spellcheck`;
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
