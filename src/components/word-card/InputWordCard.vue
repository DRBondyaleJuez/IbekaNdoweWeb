<template>
    <div class="input-word-card">
        <details>
            <summary>
                <div class="input-word-card__header">
                    <div clas="input-word-card__header-main">
                        <span class="input-word-card__input-word">
                            {{ wordText }}
                        </span>
                        <span class="input-word-card__input-word-phonetic">
                            {{ "["+wordPhonetic+"]" ?? 'Undefined Phonetic'  }}
                        </span>
                        <div clas="input-word-card__header-subtext">
                            <span class="input-word-card__lexicon-type">
                                {{ inputSenseTypeOfLexicon ?? 'Undefined Lexicon Type' }}
                            </span>
                            <span> | </span>
                            <span class="input-word-card__conceptual-domain">
                                {{ wordSenseContent.inputSenseConceptualDomain ?? 'Undefined Conceptual Domain' }}
                            </span>
                        </div>        
                    </div>
                    <div class="input-word-audio" :class="{ 'audio--absent': inputWordAudioUrl}" @click="playSound(wordSenseContent.inputWordAudioUrl)">
                        <img class="input-audio-icon" src="../../assets/static/icons/input-audio-icon.png">
                    </div>
                </div>
                <div class="horizontal-dashed-line"></div>
                <div class="chevron-icon-container">
                    <img class="chevron-icon" src="../../assets/static/icons/green-chevron-down-icon.png">
                </div>
            </summary>

            <div class="input-word-card__content">
                <div class="input-word-card__definition">
                    <h3>Definition:</h3>
                    <p class="definition--input-language">
                        {{ wordSenseContent.inputSenseDefinition  ?? 'Undefined Definition' }}
                    </p>
                    <p class="definition--translated-language" :class="{ 'text--absent': wordSenseContent.inputSenseDefinitionInOutputLanguage }">
                        {{ wordSenseContent.inputSenseDefinitionInOutputLanguage ?? 'Undefined Translated Definition' }}                   
                    </p>
                </div>
                <div class="input-word-card__example">
                  <h3>Examples:</h3>
                  <div class="input-word-card__example-text">
                      <p class="example--input-language" :class="{ 'text--absent': wordSenseContent.inputSenseExampleSentence }">
                          {{ wordSenseContent.inputSenseExampleSentence ?? 'Undefined Example' }}
                      </p>
                      <p class="example--translated-language" :class="{ 'text--absent': wordSenseContent.inputSenseExampleInOutputLanguageAudioUrl }">
                          {{ wordSenseContent.inputSenseExampleInOutputLanguageAudioUrl ?? 'Undefined Translated Example' }}                   
                      </p>
                  </div>
                  <div class="input-word-card__example-audio">
                      <div class="example-audio--input-language">
                          <div class="example-audio" :class="{ 'audio--absent': wordSenseContent.inputSenseExampleAudioUrl}" @click="playSound(wordSenseContent.inputSenseExampleAudioUrl)">
                              <img class="input-audio-icon" src="../../assets/static/icons/input-audio-icon.png">
                          </div>
                      </div>
                      <div class="example-audio--translated-language">
                          <div class="example-audio" :class="{ 'audio--absent': wordSenseContent.inputSenseExampleInOutputLanguageAudioUrl}" @click="playSound(wordSenseContent.inputSenseExampleInOutputLanguageAudioUrl)">
                              <img class="input-audio-icon" src="../../assets/static/icons/translated-audio-icon.png">
                          </div>
                      </div>
                  </div>
                </div>
            </div>
        </details>
    </div>
</template>

<script>

export default {
  name: 'WordCard',

  props: {
    wordText: {
      type: String,
      required: true,
      default: 'ERROR: Absent input word'
    },
    wordPhonetic: {
      type: String,
      required: false,
      default: ''
    },
    wordAudioUrl: {
      type: String,
      required: false,
      default: ''
    },
    wordSenseContent: {
      type: Object,
      required: true,
      default: undefined
    }
  },

  data() {
    return {
      currentAudio: null, // Stores the current Audio object
      currentPlayingUrl: null, // Stores the URL of the currently playing audio
      error: null, // Stores any playback errors
    };
  },

  // 5. computed: Properties that depend on other reactive data.
  //    They are cached based on their dependencies and only re-evaluate when dependencies change.
  computed: {
    wordLength() {
      // Example of a computed property based on a prop
      return this.ndoweWord.length;
    }
  },

  // 6. watch: Allows you to react to changes in data properties (props or data)
  //    or computed properties.
  watch: {
    viewCount(newValue, oldValue) {
      if (newValue > oldValue) {
        this.statusMessage = `View count increased to ${newValue}.`;
      }
      if (newValue >= 5) {
        console.log('This word has been viewed 5 or more times!');
        // In a real app, you might trigger an analytics event or a special UI
      }
    },
    ndoweWord(newWord, oldWord) {
      console.log(`Ndowe word changed from '${oldWord}' to '${newWord}'`);
      this.statusMessage = `Displaying: ${newWord}`;
      // You might reset viewCount or fetch new audio here
      this.viewCount = 0; // Reset count when word changes
    }
  },

  created() {
    console.log('NdoweWordDisplay created! Initial data setup complete.');
    this.statusMessage = `Welcome! Displaying word: ${this.ndoweWord}`;
  },

  mounted() {
    console.log('NdoweWordDisplay mounted to the DOM!');
  },

  methods: {
    /**
     * Plays an audio file from the given URL.
     * If another audio is playing, it stops it first.
     * @param {string} audioUrl - The URL of the audio file to play.
     */
    playSound(audioUrl) {
      this.error = null; // Clear previous errors

      // Stop any currently playing audio
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0; // Rewind to start
      }

      // Create a new Audio object
      this.currentAudio = new Audio(audioUrl);
      this.currentPlayingUrl = audioUrl;

      // Add event listeners for error handling (optional but recommended)
      this.currentAudio.addEventListener('error', (e) => {
        let errorMessage = 'Unknown audio error.';
        switch (e.target.error.code) {
          case e.target.error.MEDIA_ERR_ABORTED:
            errorMessage = 'Audio playback aborted.';
            break;
          case e.target.error.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error during audio playback.';
            break;
          case e.target.error.MEDIA_ERR_DECODE:
            errorMessage = 'Audio decoding error.';
            break;
          case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Audio format not supported or URL invalid.';
            break;
        }
        this.error = errorMessage;
        this.currentPlayingUrl = null; // Clear playing status
        console.error('Audio Playback Error:', errorMessage, e);
      });

      // Add listener for when audio ends
      this.currentAudio.addEventListener('ended', () => {
        this.currentPlayingUrl = null; // Clear playing status
        console.log('Audio playback ended.');
      });

      // Attempt to play the audio
      this.currentAudio.play().catch(error => {
        this.error = `Could not play audio: ${error.message}`;
        this.currentPlayingUrl = null;
        console.error('Playback failed:', error);
      });
    },

    /**
     * Stops the currently playing audio.
     */
    stopSound() {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0; // Rewind to start
        this.currentPlayingUrl = null; // Clear playing status
        this.error = null; // Clear any error if successfully stopped
      }
    }
  },
  // Lifecycle hook to clean up audio object when component is destroyed
  beforeUnmount() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }
};
</script>


