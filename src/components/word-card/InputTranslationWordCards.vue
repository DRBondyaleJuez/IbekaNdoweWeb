<template>
  <div class="input-translation-word-cards">
    <div class="word-card-container word-card-container--input">
      <WordCard
        :word-text=inputWordText
        :word-phonetic=inputWordPhonetic
        :word-audio-url=inputWordAudioUrl
        :type-of-lexicon=inputWordSenseContent.inputSenseTypeOfLexicon
        :conceptual-domain=inputWordSenseContent.inputSenseConceptualDomain
        :main-lang-definition=inputWordSenseContent.inputSenseDefinition
        :main-lang-example-text=inputWordSenseContent.inputSenseExampleSentence
        :main-lang-example-audio=inputWordSenseContent.inputSenseExampleAudioUrl
        :other-lang-definition=inputWordSenseContent.inputSenseDefinitionInOutputLanguage
        :other-lang-example-text=inputWordSenseContent.inputSenseExampleInOutputLanguage
        :other-lang-example-audio=inputWordSenseContent.inputSenseExampleInOutputLanguageAudioUrl
      ></WordCard>
    </div>
    <div class="word-card-container word-card-container--translated">
      <WordCard
        :word-text=translatedWordDetails.translatedWord
        :word-phonetic=translatedWordDetails.translatedWordPhonetic
        :word-audio-url=translatedWordDetails.translatedWordAudioUrl
        :type-of-lexicon=translatedSenseDetails.translatedSenseTypeOfLexicon
        :conceptual-domain=translatedSenseDetails.translatedSenseConceptualDomain
        :main-lang-definition=translatedSenseDetails.translatedSenseDefinition
        :main-lang-example-text=translatedSenseDetails.translatedSenseExampleSentence
        :main-lang-example-audio=translatedSenseDetails.translatedSenseExampleAudioUrl
        :other-lang-definition=translatedSenseDetails.translatedSenseDefinitionInInputLanguage
        :other-lang-example-text=translatedSenseDetails.translatedSenseExampleInInputLanguage
        :other-lang-example-audio=translatedSenseDetails.translatedSenseExampleInInputLanguageAudioUrl
      ></WordCard>
    </div>
  </div>
</template>

<script>
  import WordCard from '../word-card/WordCard.vue';

  export default {
    name: 'InputTranslationWordCards',

    components: {
      WordCard
    },

    props: {
      inputWordText: {
        type: String,
        required: true,
        default: 'ERROR: Absent input word'
      },
      inputWordPhonetic: {
        type: String,
        required: false,
        default: ''
      },
      inputWordAudioUrl: {
        type: String,
        required: false,
        default: ''
      },
      inputWordSenseContent: {
        type: Object,
        required: true,
        default: undefined
      },
      translatedWordDetails:{
        type: Object,
        required: true,
        default: undefined
      },
      translatedSenseDetails: {
        type: Object,
        required: true,
        default: undefined
      }
    }
  }
</script>