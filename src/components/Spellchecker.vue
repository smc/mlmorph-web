
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
    input: 'കേരളത്തിന് വേൺട വൈദ്യുതിയുടെ 66 ശതമാനവും ഇഡുക്കി ജില്ലയിലെ ജലവൈദ്യുത പദ്ധതികളിൽ നിന്നാണ് ലബിക്കുന്നത്.  ഏഷ്യയിലെ ഏറ്റവും വലിയ അണക്കെട്ടുകളിൽ ഒന്നാണ്. ഇതു ഇന്ത്യയിലെ രണ്ടാമത്തെ ഏററവും ഉയരം കൂടിയ അണക്കെട്ടാണ്. കേരളത്തിലെ ഏറ്റവും വലിയ ജലവൈദ്യുതപദ്ധതിയും ഇതാണ്. വിനോധസഞ്ചാരമേഖലയാണ് എടുത്തു പറയേണ്ട മറ്റൊരു സവിശേഷത.',
    results: {}
  }),
  methods: {
    update () {
      this.spellcheck(this.input)
    },
    spellcheck () {
      const api = `/api/spellcheck`
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
