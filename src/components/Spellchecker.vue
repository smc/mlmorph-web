<template>
  <v-container fluid grid-list-md>
    <h2>{{ $i18n("spell_spellchecker") }}</h2>
    <editor
      tinymce-script-src="/js/tinymce/tinymce.min.js"
      :initial-value="input"
      :init="editorConfig"
    ></editor>
  </v-container>
</template>

<script>
import axios from "axios";
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "Spellchecker",
  data: () => ({
    dictionary: [],
    input:
      "കേരളത്തിന് വേൺട വൈദ്യുതിയുടെ 66 ശതമാനവും ഇഡുക്കി ജില്ലയിലെ ജലവൈദ്യുത പദ്ധതികളിൽ നിന്നാണ് ലബിക്കുന്നത്.  ഏഷ്യയിലെ ഏറ്റവും വലിയ അണക്കെട്ടുകളിൽ ഒന്നാണ്. ഇതു ഇന്ത്യയിലെ രണ്ടാമത്തെ ഏററവും ഉയരം കൂടിയ അണക്കെട്ടാണ്. കേരളത്തിലെ ഏറ്റവും വലിയ ജലവൈദ്യുതപദ്ധതിയും ഇതാണ്. വിനോധസഞ്ചാരമേഖലയാണ് എടുത്തു പറയേണ്ട മറ്റൊരു സവിശേഷത."
  }),
  components: {
    editor: Editor
  },
  computed: {
    editorConfig() {
      return {
        height: 500,
        menubar: true,
        toolbar_mode: "floating",
        toolbar_sticky: true,
        plugins: [
          "advlist autolink lists link image    charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount spellchecker"
        ],
        spellchecker_languages: "Malayalam=ml",
        toolbar:
          "undo  redo | formatselect | bold italic underline strikethrough codeformat | backcolor forecolor |  fontselect | alignleft aligncenter  alignright alignjustify |  bullist numlist outdent indent | removeformat|spellchecker |  help",
        font_formats:
          "മഞ്ജരി=Manjari,helvetica,sans-serif; ഗായത്രി=Gayathri,helvetica,sans-serif; ചിലങ്ക=Chilanka,serif; രചന=Rachana,serif; മീര=Meera,sans-serif; കേരളീയം=Keraleeyam, sans-serif; ഉറൂബ്=Uroob, sans-serif;",
        spellchecker_callback: this.spellcheck
      };
    }
  },
  methods: {
    spellcheck(method, text, success, failure) {
      const api = `/api/spellcheck`;
      if (method === "spellcheck") {
        axios
          .post(api, {
            text: text
          })
          .then(response => {
            const results = response.data;
            const misspellings = {};
            Object.keys(results).forEach(word => {
              if (!results[word].correct) {
                misspellings[word] = results[word].suggestions;
              }
            });

            success({ words: misspellings, dictionary: this.dictionary });
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error);
            failure("Spellcheck error:" + error);
          });
      } else if (method === "addToDictionary") {
        this.dictionary.push(text);
        success();
      }
    }
  }
};
</script>
<style lang="css">
@import url("https://smc.org.in/fonts/gayathri.css");
@import url("https://smc.org.in/fonts/keraleeyam.css");
@import url("https://smc.org.in/fonts/uroob.css");
@import url("https://smc.org.in/fonts/chilanka.css");
@import url("https://smc.org.in/fonts/meera.css");
@import url("https://smc.org.in/fonts/rachana.css");
</style>
