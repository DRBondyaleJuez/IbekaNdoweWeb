<template>
  <div class="word-display">
    <!-- Display the word and its translation, passed as props -->
    <h2 class="word-display__ndowe-word">{{ ndoweWord }}</h2>
    <p class="word-display__translation">{{ translation }}</p>

    <!--
      New: Using the AudioPlayerButton component!
      We pass the audioUrl as a prop and listen for the 'play-requested' event
      to call our component's playAudio method.
    -->

    <!--
    <AudioPlayerButton
      :audio-src="audioUrl"
      @play-requested="playAudio"
      class="word-display__audio-button"
    />
    -->

    <!-- Display local component data -->
    <div class="word-display__interactions">
      <p>Times viewed: {{ viewCount }}</p>
      <button @click="incrementViewCount" class="word-display__button">
        Increment View
      </button>
      <button @click="resetViewCount" class="word-display__button --secondary">
        Reset View
      </button>
      <p class="word-display__status">{{ statusMessage }}</p>
    </div>

    <!-- Display a computed property -->
    <p class="word-display__info">Word Length: {{ wordLength }} characters</p>
  </div>
</template>

<script>
// 1. IMPORTING ANOTHER COMPONENT:
// We need to import the new component from its file path.
// Assume AudioPlayerButton.vue is in the same directory or a sub-directory like 'components/'.
//import AudioPlayerButton from './AudioPlayerButton.vue'; // Adjust path as needed

export default {
  // 1. name: Defines the component's name, useful for debugging and recursive components.
  name: 'NdoweWordDisplay',

  // 2. REGISTERING THE IMPORTED COMPONENT:
  // Components that you want to use within this template must be registered here.
  components: {
    //AudioPlayerButton // This makes <AudioPlayerButton/> available in the template
  },

  // 3. props: Properties passed down from a parent component.
  //    Define their types and whether they are required.
  props: {
    ndoweWord: {
      type: String,
      required: true,
      default: 'Unknown Word'
    },
    translation: {
      type: String,
      required: true,
      default: 'No Translation'
    }
  },

  // 4. data(): A function that returns the initial reactive data for the component.
  //    Each instance of the component gets its own copy of the data.
  data() {
    return {
      viewCount: 0,
      statusMessage: 'Ready to display word.',
      // You could simulate an audio URL here, though in a real app it would likely come from props/API
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Example public audio URL
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

  // 7. Lifecycle Hooks: Functions that are called at specific stages of a component's life.

  //    created(): Called synchronously after the instance is created.
  //    Data observation is set up, computed properties and watchers are initialized.
  //    Useful for fetching initial data, setting up non-DOM related properties.
  created() {
    console.log('NdoweWordDisplay created! Initial data setup complete.');
    this.statusMessage = `Welcome! Displaying word: ${this.ndoweWord}`;
  },

  //    mounted(): Called after the component is mounted to the DOM.
  //    Useful for direct DOM manipulation, integrating third-party libraries,
  //    or making API calls that require the DOM to be ready.
  mounted() {
    console.log('NdoweWordDisplay mounted to the DOM!');
  },

  // Other common lifecycle hooks (not included in this simple example but good to know):
  // - updated(): Called after a component has updated its DOM due to a reactive data change.
  // - beforeUnmount(): Called right before a component is unmounted. Useful for cleanup (event listeners).
  // - unmounted(): Called after a component has been unmounted from the DOM.

  // 8. methods: Functions that encapsulate component logic.
  //    They can access component data, props, and other methods via `this`.
  methods: {
    incrementViewCount() {
      this.viewCount++;
    },
    resetViewCount() {
      this.viewCount = 0;
      this.statusMessage = 'View count reset.';
    },
    // This method is now called when the AudioPlayerButton emits 'play-requested'
    playAudio(audioSrc) {
      // In a real app, you'd use HTMLAudioElement or a library
      // We receive the audioSrc from the emitted event, ensuring we play the correct one
      const audio = new Audio(audioSrc);
      audio.play()
        .then(() => {
          this.statusMessage = 'Playing audio...';
        })
        .catch(e => {
          console.error("Error playing audio:", e);
          this.statusMessage = 'Failed to play audio.';
        });
    }
  }
};
</script>

<!--
<style lang="scss">
/*
  9. style: Styles for the component.
  `lang="scss"` tells Vue CLI/Vite to process this block with Sass.
  `scoped` attribute (e.g., <style lang="scss" scoped>) would limit these styles
  to only affect elements within this component, preventing style conflicts.
  For simplicity, 'scoped' is omitted here, meaning styles are global unless
  explicitly targeted.
*/

.word-display {
  font-family: 'Lato', sans-serif; // Using the suggested content font
  background-color: #FFFFFF; // Light background
  padding: 2rem;
  margin: 1.5rem auto;
  border-radius: 0.75rem; // Rounded corners
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); // Subtle shadow
  max-width: 600px;
  text-align: center;
  color: #333333; // Dark text color

  &__ndowe-word {
    font-family: 'Lusitana', serif; // Using the suggested logo font for the word itself
    font-size: 2.5rem;
    color: #2E7D32; // Primary accent color
    margin-bottom: 0.5rem;
  }

  &__translation {
    font-size: 1.5rem;
    color: #FFB300; // Secondary accent color
    margin-bottom: 1.5rem;
  }

  &__audio-button {
    margin-bottom: 1.5rem; /* Space below the audio button */
  }

  &__interactions {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #E0E0E0; // Light grey border
  }

  &__button {
    background-color: #2E7D32; // Primary accent
    color: #FFFFFF;
    border: none;
    padding: 0.8rem 1.5rem;
    margin: 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease, transform 0.1s ease;

    &:hover {
      background-color: darken(#2E7D32, 10%);
      transform: translateY(-2px);
    }

    &.--secondary {
      background-color: #9E9E9E; // Neutral grey
      &:hover {
        background-color: darken(#9E9E9E, 10%);
      }
    }
  }

  &__status {
    margin-top: 1rem;
    font-style: italic;
    color: #9E9E9E;
    font-size: 0.9rem;
  }

  &__info {
    margin-top: 1.5rem;
    font-size: 1.1rem;
    color: #333333;
  }
}
</style>
-->
