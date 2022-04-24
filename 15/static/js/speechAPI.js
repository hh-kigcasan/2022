// DomContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // check if web speech api is supported
  // if ("webkitSpeechRecognition" in window) {
  console.log("Speech Recognition API Loaded");
  // Speech recognition
  var SpeechRecognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition)();

  var recognition = SpeechRecognition;

  var textbox = $("#textbox");
  var instructions = $("#instructions");

  var content = "";
  recognition.continuous = true;
  // recognition.interimResults = true;
  recognition.lang = "en-US";
  console.log(recognition);

  // Start the recognition process
  recognition.onstart = () => {
    instructions.text(
      "Voice recognition activated. Try speaking into the microphone."
    );
  };

  recognition.onend = () => {
    instructions.text(
      "Click the Microphone Icon to start again."
    );
  };

  // If the speech is not recognized, the recognition will be ended
  recognition.onerror = (event) => {
    console.log(event.error);
    instructions.text("No speech was detected. Try again.");
  };

  recognition.onresult = (event) => {
    for (const res of event.results) {
      let transcript = res[0].transcript;
      textbox.append(transcript);
    }

    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far.
    // // We only need the current one.
    // var current = event.resultIndex;
    // console.log(event);

    // // Get a transcript of what was said.
    // var transcript = event.results[current][0].transcript;

    // content += transcript;
    // textbox.append(" " + content);
  };
  let counterClick = 0;
  $("#record-btn").click(function (e) {
    counterClick++;
    
    if (counterClick == 1) {

      $(this).toggleClass("recordActive");
      recognition.start();

      setTimeout(() => {
        instructions.text("Times Up");
        $(this).toggleClass("recordActive");
        recognition.stop();
      }, 10000);

    } else if (counterClick == 2) {

      clearTimeout();

      $(this).toggleClass("recordActive");
      recognition.stop();
      counterClick = 0;
    }
  });
  // } else {
  //   console.log("Speech Recognition API not supported by the browser.");
  // }
});
