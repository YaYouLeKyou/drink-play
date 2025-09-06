let actions_en = []; // Will be populated from JSON
let actions_fr = []; // Will be populated from JSON
let actions_es = []; // Will be populated from JSON

let currentLanguage = 'en'; // Default language

const suggestionText = document.getElementById('suggestion-text');
const generateBtn = document.getElementById('generate-btn');
const languageToggleBtn = document.getElementById('language-toggle-btn');
const languageDropdown = document.getElementById('language-dropdown');
const langOptionButtons = document.querySelectorAll('.lang-option');

// Function to fetch actions from JSON
async function fetchActions() {
    try {
        const response = await fetch('actions.json');
        const data = await response.json();
        actions_en = data.en;
        actions_fr = data.fr;
        actions_es = data.es;
        // Initial setup after actions are loaded
        updateSuggestion();
        updateGenerateButtonText();
    } catch (error) {
        console.error('Error fetching actions:', error);
        suggestionText.textContent = 'Error loading actions. Please try again later.';
    }
}

// Function to update the suggestion based on current language
function updateSuggestion() {
    let currentActions;
    if (currentLanguage === 'en') {
        currentActions = actions_en;
    } else if (currentLanguage === 'fr') {
        currentActions = actions_fr;
    } else if (currentLanguage === 'es') {
        currentActions = actions_es;
    }
    const randomIndex = Math.floor(Math.random() * currentActions.length);
    suggestionText.textContent = currentActions[randomIndex];
}

// Function to update generate button text based on current language
function updateGenerateButtonText() {
    if (currentLanguage === 'en') {
        generateBtn.textContent = 'Generate';
    } else if (currentLanguage === 'fr') {
        generateBtn.textContent = 'Générer';
    } else if (currentLanguage === 'es') {
        generateBtn.textContent = 'Generar';
    }
}

// Event listener for generate button
generateBtn.addEventListener('click', updateSuggestion);

// Event listener for language toggle button (to show/hide dropdown)
languageToggleBtn.addEventListener('click', (event) => {
    languageDropdown.classList.toggle('show');
    event.stopPropagation(); // Prevent click from immediately closing dropdown
});

// Event listeners for language options in the dropdown
langOptionButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentLanguage = button.dataset.lang; // Get language from data-lang attribute
        updateSuggestion(); // Update suggestion
        updateGenerateButtonText(); // Update generate button text
        languageDropdown.classList.remove('show'); // Hide dropdown
    });
});

// Close the dropdown if the user clicks outside of it
window.addEventListener('click', (event) => {
    if (!event.target.matches('#language-toggle-btn')) {
        if (languageDropdown.classList.contains('show')) {
            languageDropdown.classList.remove('show');
        }
    }
});

// Fetch actions when the script loads
fetchActions();