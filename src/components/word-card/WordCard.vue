<template>
    <div class="word-card">
        <details>
            <summary>
                <div class="word-card__header">
                    <div class="word-card__header-main">
                        <span class="word-card__word-text">
                            {{ wordText }}
                        </span>
                        <span class="word-card__word-phonetic">
                            {{ "[" + wordPhonetic + "]" ?? 'Undefined Phonetic'  }}
                        </span>
                        <div class="word-card__header-subtext">
                            <span class="word-card__lexicon-type">
                                {{ typeOfLexicon ?? 'Undefined Lexicon Type' }}
                            </span>
                            <span> | </span>
                            <span class="word-card__conceptual-domain">
                                {{ conceptualDomain ?? 'Undefined Conceptual Domain' }}
                            </span>
                        </div>        
                    </div>
                    <div class="word-audio" :class="{ 'audio--absent': wordAudioUrl}" @click="playSound(wordAudioUrl)">
                        <div class="audio-icon audio-icon-main-language"></div>
                    </div>
                </div>
                <div class="horizontal-dashed-line"></div>
                <div class="chevron-icon-container">
                    <img class="chevron-icon" src="../../assets/static/icons/green-chevron-down-icon.png">
                </div>
            </summary>

            <div class="word-card__content">
                <div class="word-card__definition">
                    <h3>Definition:</h3>
                    <p class="definition--main-language main-language">
                        {{ mainLangDefinition  ?? 'Undefined Definition' }}
                    </p>
                    <p class="definition--other-language other-language" :class="{ 'text--absent': otherLangDefinition }">
                        {{ otherLangDefinition ?? 'Undefined Translated Definition' }}                   
                    </p>
                </div>
                <div class="word-card__example">
                    <h3>Examples:</h3>
                    <div class="word-card__example-content">
                        <div class="word-card__example-case word-card__example--main-language">
                            <p class="example-text main-language" :class="{ 'text--absent': mainLangExampleText }">
                                {{ mainLangExampleText ?? 'Undefined Example' }}
                            </p>
                            <div class="example-audio" :class="{ 'audio--absent': mainLangExampleAudio }" @click="playSound(mainLangExampleAudio)">
                                <div class="audio-icon audio-icon-main-language"></div>
                            </div>
                        </div>
                        <div class="word-card__example-case word-card__example--other-language">
                            <p class="example-text other-language" :class="{ 'text--absent': otherLangExampleText }">
                                {{ otherLangExampleText ?? 'Undefined Translated Example' }}                   
                            </p>
                            <div class="example-audio" :class="{ 'audio--absent': otherLangExampleAudio }" @click="playSound(otherLangExampleAudio)">
                                <div class="audio-icon audio-icon-other-language"></div>
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
      default: 'ERROR: Absent word content !!'
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
    typeOfLexicon: {
      type: String,
      required: false,
      default: ''
    },
    conceptualDomain: {
      type: String,
      required: false,
      default: ''
    },
    mainLangDefinition: {
      type: String,
      required: false,
      default: ''
    },
    mainLangExampleText: {
      type: String,
      required: false,
      default: ''
    },
    mainLangExampleAudio: {
      type: String,
      required: false,
      default: ''
    },
    otherLangDefinition: {
      type: String,
      required: false,
      default: ''
    },
    otherLangExampleText: {
      type: String,
      required: false,
      default: ''
    },
    otherLangExampleAudio: {
      type: String,
      required: false,
      default: ''
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

  },

  mounted() {

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
