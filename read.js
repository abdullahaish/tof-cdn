let isReading = false; // Variable to track if text is currently being read
let utterance; // Variable to hold the SpeechSynthesisUtterance instance
let currentWordIndex = 0; // Variable to keep track of the current word being spoken
let isPaused = false; // Variable to track if reading is paused

const readAloudButton = document.getElementById('read-aloud-button');
const contentDiv = document.getElementById('article-content');
const words = contentDiv.textContent.split(' ');

// Add an event listener to handle page refresh
window.addEventListener('beforeunload', () => {
    const speechSynthesis = window.speechSynthesis;
    speechSynthesis.cancel(); // Cancel the current speech synthesis
});

function clearHighlight() {
    const spans = contentDiv.querySelectorAll('span');
    for (const span of spans) {
        span.classList.remove('highlighted-word');
    }
}

readAloudButton.addEventListener('click', () => {
    if (!isReading) { // If not currently reading, start reading
        const speechSynthesis = window.speechSynthesis;

        if (isPaused) {
            // If paused, create a new utterance from the current word index
            utterance = new SpeechSynthesisUtterance(words.slice(currentWordIndex).join(' '));
        } else {
            // If not paused, create a new utterance from the beginning
            utterance = new SpeechSynthesisUtterance(contentDiv.textContent);
        }

        speechSynthesis.speak(utterance);

        isReading = true; // Set the flag to true
        isPaused = false; // Reset the pause flag
        readAloudButton.textContent = 'Stop'; // Change the button text to 'Stop'

        utterance.onstart = () => {
            if (!isPaused) {
                currentWordIndex = 0; // Reset the current word index when speech starts
            }
        };

        utterance.onend = () => {
            isReading = false; // Set the flag to false when speech ends
            readAloudButton.textContent = 'Read Aloud'; // Change the button text to 'Read Aloud'
            clearHighlight();
        };

        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                currentWordIndex++; // Move to the next word
            }
        };
    } else { // If currently reading, stop or pause reading
        const speechSynthesis = window.speechSynthesis;
        if (!isPaused) {
            speechSynthesis.pause(); // Pause the current speech synthesis
            isPaused = true; // Set the pause flag
            readAloudButton.textContent = 'Resume'; // Change the button text to 'Resume'
        } else {
            speechSynthesis.resume(); // Resume the paused speech synthesis
            isPaused = false; // Reset the pause flag
            readAloudButton.textContent = 'Stop'; // Change the button text to 'Stop'
        }
    }
});

// Event listener for the page unload event (before page reload)
window.addEventListener('beforeunload', () => {
    if (isReading) {
        stopReading(); // Stop reading aloud if the user reloads the page
    }
});