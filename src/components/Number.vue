
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
    </v-text-field>
    <h2 v-if="result&&result.length>0">{{result[0]}}</h2>
    <h3 class="grey--text" v-if="result&&result.length>1">{{result[1]}}</h3>
    <h3 class="grey--text" v-if="result&&result.length>2">{{result[2]}}</h3>
    <v-footer absolute class="pa-3">
      <p class="text-sm-left text-md-left">
        For more details on see the article
        <a
          href="http://thottingal.in/blog/2017/12/10/number-spellout-and-generation-in-malayalam-using-morphology-analyser/"
        >
          Number
          spellout and generation in Malayalam using Morphology analyser
        </a>
      </p>
    </v-footer>
  </v-container>
</template>

<script>
import axios from 'axios'
const onesStr = [
  'പൂജ്യം',
  'ഒന്ന്',
  'രണ്ട്',
  'മൂന്ന്',
  'നാല്',
  'അഞ്ച്',
  'ആറ്',
  'ഏഴ്',
  'എട്ട്',
  'ഒമ്പത്'
]

export default {
  name: 'NumberSpellout',
  data: () => ({
    input: '',
    result: '',
    status: ''
  }),
  methods: {
    positionValues (value) {
      let result = ''
      let crores = value >= 10000000 ? parseInt(value / 10000000) : 0
      let lakhs = parseInt((value % 10000000) / 100000)
      let thousands = parseInt((value % 100000) / 1000)
      let hundreds = parseInt((value % 1000) / 100)
      let tens = parseInt((value % 100) / 10)
      let ones = parseInt((value % 10) / 1)
      result =
        (crores > 0 ? this.positionValues(crores) + '<crores>' : '') +
        (lakhs > 0 ? this.positionValues(lakhs) + '<lakhs>' : '') +
        (thousands > 0 ? this.positionValues(thousands) + '<thousands>' : '') +
        (hundreds > 0 ? this.positionValues(hundreds) + '<hundreds>' : '') +
        (tens > 0 ? this.positionValues(tens) + '<tens>' : '') +
        (ones > 0 ? onesStr[ones] + '<ones>' : '') +
        (value === 0 ? onesStr[ones] + '<zero>' : '')

      return this.clean(result)
    },
    clean (result) {
      result = result.replace('<ones><hundreds>', '<hundreds>')
      result = result.replace('<ones><tens>', '<tens>')
      result = result.replace('ഒന്ന്<ones><hundredsa>', '<hundreds>')
      result = result.replace('ഒന്ന്<ones><thousands>', '<thousands>')
      return result
    },
    update () {
      let numberMorphemes =
        this.positionValues(Number(this.input)) + '<cardinal>'
      this.spellout(numberMorphemes)
    },
    spellout (numberMorphemes) {
      const api = `/api/generate?word=${numberMorphemes}`
      axios
        .get(api)
        .then(response => {
          this.result = response.data.result
          this.progress = 30
        })
        .catch(error => {
          console.log(error)
          this.progress = 0
        })
    }
  }
}
</script>
