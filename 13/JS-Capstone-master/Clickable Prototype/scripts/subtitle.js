$(document).ready(function() {
    let speechRecognition = window.webkitSpeechRecognition;
    let speechEvent = window.speechRecognitionEvent || webkitSpeechRecognitionEvent;
    let recognition = new speechRecognition();
    let textbox = $("#subtitle");

    let content = '';
    recognition.continuous = true;

    recognition.onstart = function() {
        console.log('start');
    }

    recognition.onresult = function(event) {
        let current = event.resultIndex;
        console.log(event);
        let transcript = event.results[current][0].transcript;
        content += transcript;
        textbox.val(content);
    }

    
    
    $("#start-btn").click(function(event) {
        if(content.length) {
            content += "";
        }

        recognition.start();
    });
});