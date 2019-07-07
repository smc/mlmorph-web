
<template>
  <v-container fluid grid-list-md>
    <h2>{{$i18n('spell_spellchecker')}}</h2>
    <v-textarea
      name="spell_input"
      v-model="input"
      :label="$i18n('spell_input_label')"
      auto-grow
      :value="input"
      @input="update"
    ></v-textarea>
    <table class="v-datatable v-table theme--light" v-if="results && Object.keys(results).length">
      <thead>
        <tr>
          <th class="text-xs-left">{{$i18n('spell_wrong_word')}}</th>
          <th class="text-xs-left">{{$i18n('spell_suggestions')}}</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="key" v-for="(result, key) in results" v-if="!result.correct && key.trim()">
          <td class="text-xs-left">{{ key }}</td>
          <td class="text-xs-left">
            <v-chip
              :key="sindex"
              class="text-xs-left"
              v-for="(suggestion, sindex) in result.suggestions"
            >{{ suggestion }}</v-chip>
          </td>
        </tr>
      </tbody>
    </table>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Spellchecker',
  data: () => ({
    input: '',
    results: {}
  }),
  methods: {
    update () {
      this.spellcheck(this.input)
    },
    spellcheck () {
      const api = `${process.env.BASE_URL}/api/spellcheck`
      axios
        .post(api, {
          text: this.input
        })
        .then(response => {
          this.results = response.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
