/* Constantine Doukas - Text To Speech Application Using Speech Synthesis API */

(function () {
    // Initialize Speech Synthesis API
    const speechSynth = window.speechSynthesis;

    // Declare DOM elements used for the form
    const textForm = document.querySelector('form');
    const textInput = document.getElementById('text-input');
    const voiceSelect = document.getElementById('voice-select');
    const rate = document.getElementById('rate');
    const rateValue = document.getElementById('rate-value');
    const pitch = document.getElementById('pitch');
    const pitchValue = document.getElementById('pitch-value');
    const speakButton = document.getElementById('speak-button');

    // Initialize array of different speech voices
    let voices = [];

    // Fetch the voices using the API. This function is called asynchronously
    const getVoices = () => {
        voices = speechSynth.getVoices();

        // Loop through voices
        voices.forEach(voice => {
            // Create an option element for each choice
            const voiceOption = document.createElement('option');

            // Insert the voice/language into the option element 
            voiceOption.textContent = `${voice.name} (${voice.lang})`;

            // Set option attributes (data-name and data-lang)
            voiceOption.setAttribute('data-lang', voice.lang);
            voiceOption.setAttribute('data-name', voice.name);

            // Append the options to the select list
            voiceSelect.appendChild(voiceOption);

        });
    };

    getVoices();
    // Wait for an event called voiceschanged, it's fired when the contents of the SpeechSynthesisVoiceList is changed
    if (speechSynth.onvoiceschanged !== undefined) {
        speechSynth.onvoiceschanged = getVoices;
    }

    // Speech function - This will run when the submit button is clicked, also when the speaker is changed

    const speak = () => {
        // Need to check that the app is not currently speaking already when the button clicked
        if (speechSynth.speaking) {
            console.error('The app is already speaking.');
            return;
        }

        // Check if the value of the "type something" input is not an empty string
        if (textInput.value !== '') {
            // Get the input text
            const speakText = new SpeechSynthesisUtterance(textInput.value);

            // When speaking is finished, log to the console
            speakText.onend = e => {
                console.log('Speaking is complete');
            };

            // Display speaking error
            speakText.onerror = e => {
                console.error('There was an error with speaking.');
            };

            // Determine which voice  to speak with. Grab the one that we select from the dropdown menu
            const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

            // If the current voice matches what is selected, choose that voice. Loop through voices
            voices.forEach(voice => {
                if (voice.name === selectedVoice) {
                    speakText.voice = voice;
                }
            });

            // Set the pitch and rate
            speakText.rate = rate.value;
            speakText.pitch = pitch.value;

            // Actually speak..
            speechSynth.speak(speakText);
        } else {
            console.log('Message cannot be blank.');
        }
    };

    // Add event listeners for the application

    // Text form submit
    textForm.addEventListener('submit', e => {
        e.preventDefault();
        speak();
        textInput.blur();
    });

    // Rate & Pitch value change to display on the counter
    rate.addEventListener('change', e => rateValue.textContent = rate.value);
    pitch.addEventListener('change', e => pitchValue.textContent = pitch.value);

    // Voice selection value change
    voiceSelect.addEventListener('change', e => speak());


})();