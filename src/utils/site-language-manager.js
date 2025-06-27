const userLanguage = localStorage.getItem('selectedLanguage') || 'en'; // Get from localStorage or default to English
let translations = {}; // This will store the loaded translations

async function loadTranslations(lang) {
  try {
    const response = await fetch(`./languages/${lang}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    translations = await response.json();
    applyTranslations(); // Apply translations after loading
  } catch (error) {
    console.error('Error loading translations:', error);
    // Fallback to default language or display an error message
    if (lang !== 'en') { // Prevent infinite loop if English also fails
      loadTranslations('en'); // Try loading English as a fallback
    }
  }
}

// Function to get a translated string
function translate(key) {
  return translations[key] || `[Missing translation for ${key}]`;
}

// Function to apply translations to your HTML elements
function applyTranslations() {
  document.querySelectorAll('[data-translate-key]').forEach(element => {
    const key = element.getAttribute('data-translate-key');
    element.textContent = translate(key);
  });
  // You might need to handle other attributes like placeholders or titles:
  document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
    const key = element.getAttribute('data-translate-placeholder');
    element.placeholder = translate(key);
  });
  // ... and so on for other attributes
}

// Initial load based on user's preference or default
loadTranslations(userLanguage);

// ... (previous code) ...

const languageSwitcher = document.getElementById('language-switcher');

// Set the initial value of the switcher
languageSwitcher.value = userLanguage;

languageSwitcher.addEventListener('change', (event) => {
  const newLang = event.target.value;
  localStorage.setItem('selectedLanguage', newLang); // Save user preference
  loadTranslations(newLang); // Load new language translations
});

// Add a key for the placeholder example in your language files
// en.json: "search_placeholder": "Enter your search term"
// es.json: "search_placeholder": "Introduce tu término de búsqueda"
// fr.json: "search_placeholder": "Saisissez votre terme de recherche"