$(document).ready(function(){
    
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();

    $("#voice_speaking").hide("");

    $("#voice").click(function(){
        $("#voice_speaking").fadeIn("");
        recognition.start();
    });

    // This runs when the speech recognition service starts
    recognition.onstart = function() {
        $("#voice_speaking").html("I am listening. Try speaking");
    };

    recognition.onspeechend = function() {
        // when user is done speaking
        $("#voice_speaking").fadeOut(5000);
        recognition.stop();
    }
                
    // This runs when the speech recognition service returns result
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        var confidence = event.results[0][0].confidence;
        $("#voice_speaking").html(transcript);
        Commands.anaylyze(transcript);
    };
});