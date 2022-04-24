$(document).ready(function() {
    let socket = io();
    let speechRecognition = window.webkitSpeechRecognition;
    let speechEvent = window.speechRecognitionEvent || webkitSpeechRecognitionEvent;
    let recognition = new speechRecognition();
    let textbox = $("#subtitle");
    const room_id = $("#room-id").text();
    let user_id = $("#sess-id").text();
    let content;
     
	$("#languages").change(function() {
		var selectedVal = $("#languages option:selected").val();
        content = "";
        socket.emit("change_lang", {new_lang: selectedVal, user_id: user_id});
	});

    recognition.continuous = true;

    recognition.onresult = function(event) {
        let current = event.resultIndex;
        let transcript = event.results[current][0].transcript;
        socket.emit("translate_text", {text: transcript, room_id: room_id, user_id: user_id});
    }

    socket.on("show_translate", function(data) {
        if(content && content.length < 100) {
            content += data.new_text;
        }
        else {
            content = "";
            content += data.new_text;
        }
        textbox.text(content);
    });

    socket.on("subtitle", function(data) {
        textbox.text(data.text);
    });

    $("#mic").click(function(event) {
        if($(this).val() == "off") {
            $("#mic").attr("value", "on");
            $("#mic").addClass("mic-on");
            recognition.start();
        }
        else {
            $("#mic").attr("value", "off");
            $("#mic").removeClass("mic-on");
            recognition.stop();
        }
    });
});