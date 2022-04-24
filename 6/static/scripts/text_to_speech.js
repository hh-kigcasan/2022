$(document).ready(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    let item_count = 0;
    let logs = $('#quiz_log');
    let html = '';
    let openedWindow;
    let questions = [];
    let is_game_running = false;
    let score = 0;
    let subject_code;
    const commands = `
        <p><span class="red">---------- Quiz Command ----------</span></p>
        <p><span class="green">mic</span> - turn on / off Microphone.</p>
        <p><span class="green">start</span> - start the quiz.</p>
        <p><span class="green">stop</span> - stop the quiz.</p>
        <p><span class="green">pass / skip</span> - proceed to next question.</p>
        <p><span class="green">repeat / one more</span> - repeat the question.
        <p><span class="red">---------- Marvin Commands ----------</span></p>
        <p><span class="green">marvin open {url} [ex. google.com]</span> - open url in new tab.</p>
        <p><span class="green">marvin close</span> - closes the new tab.</p>
        <p><span class="green">marvin date / time</span> - tells the time and date today.</p>
        <p><span class="green">marvin play {video_name} [ex. cocomelon]</span> - opens youtube and search for video.</p>
        <p><span class="green">marvin help</span> - display available commands on screen.</p>
        <p><span class="red">---------- Tips ----------</span></p>
        <p><span class="green">Tip 1:</span> Once existing quiz is running, you are not allowed to select new subject.</p>
        <p><span class="green">Tip 2:</span> Press the "green button" / "red button" with labled mic to turn on / off the microphone.</p>
        <p><span class="green">Tip 3:</span> When button is "green" it means "off" and "red" when its "on".</p>
    `;

    html = '<p><span class="red">Marvin: </span>type "marvin help" for list of commands</p>' + html;
    logs.html(html);

    recognition.continuous = true;
    const socket = io();

    socket.emit('new_user', { id: $('#user_id').val(), name: $('#user_name').val() });

    $.post('/load_subjects', (subjects) => {
        let ul = '';
        const subj = JSON.parse(subjects);
        for(let i = 0; i < subj.length; i++) {
            ul = `<li><label name="subject">${subj[i].subject_name}</label><input type="radio" name="subjects" value="${subj[i].subject_code}" /></li>` + ul;
        }

        $('ul').html(ul);
    });

    $('form').on('change', 'input:text', () => {
        const transcript = $('form').find('input:text').val();
        const myText = transcript.split(' ');

        listen(myText, transcript);
        $('form').find('input:text').val(' ');
    });

    $('ul').on('change', 'input:radio', () => {
        subject_code = $("input[name='subjects']:checked").val();
        if(!is_game_running) {
            $.post('/load_questions', { subject_code: subject_code }, (data) => {
                const obj = JSON.parse(data);
                questions = JSON.parse(obj[0].question_data);
            });
        }
    });

    recognition.onresult = function(event) {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        let myText = transcript.split(" ");

        listen(myText, transcript);

    };

    function listen(myText, transcript) {
        html = `<p><span class="green">You: </span>${transcript}</p>` + html;
        const is_global_command = myText.includes('marvin');

        for(let i = 0; i < myText.length; i++) {
            if(is_game_running && transcript.trim().toLocaleLowerCase() === `${questions[item_count].answer}`.trim().toLocaleLowerCase()) {
                talk('Correct!');
                score++;
                item_count++;
                if(item_count >= questions.length) {
                    talk('Okay, that\s it, tallying up your score...!');
                    $.post('/update_score', { subject_code: subject_code, score: score });
                    const name = $('#user_name').val().charAt(0).toUpperCase() + $('#user_name').val().slice(1);
                    socket.emit('logs', { message: `${name} scored ${score}/${questions.length} in ${subject_code}` });
                    talk(`You scored ${score}/${questions.length} in ${subject_code}`);
                    is_game_running = false;
                    item_count = 0;
                    score = 0;
                    break;
                }
                askQuestion();
                break;
            } else if(is_game_running && (myText[i] == 'pass' || myText[i] == 'skip') && item_count + 1 <= questions.length) {
                talk('Okay, next question!');
                item_count++;
                askQuestion();
                break;
            } else if(!is_game_running && myText[i] == 'start' || (myText[i] == 'let\'s' && myText[i + 1] == 'go')) {
                if(questions.length <= 0) {
                    talk('Please select a subject.');
                } else {
                    is_game_running = true;
                    talk('Lets go!');
                    askQuestion();
                }
                break;
            } else if(is_game_running && myText[i] == 'repeat' || (myText[i] == 'one' && myText[i + 1] == 'more')) {
                talk('I\'ll repeat it again...');
                askQuestion();
                break;
            } else if(myText[i] == 'mic' || myText[i] == 'mike') {
                try {
                    recognition.start();
                    talk('Initiating Microphone....');
                    $('h3').css('background-color', 'red');
                    $('h3').css('color', 'white');
                } catch(e) {
                    recognition.stop();
                    talk('Deactivating Microphone...');
                    $('h3').css('background-color', 'greenyellow');
                    $('h3').css('color', 'black');
                }
                break;
            } else if(is_game_running && myText[i] == 'stop') {
                talk('Okay, that\s it, tallying up your score...!');
                $.post('/update_score', { subject_code: subject_code, score: score });
                const name = $('#user_name').val().charAt(0).toUpperCase() + $('#user_name').val().slice(1);
                socket.emit('logs', { message: `${name} scored ${score}/${questions.length} in ${subject_code}` });
                talk(`You scored ${score}/${questions.length} in ${subject_code}`);
                is_game_running = false;
                item_count = 0;
                score = 0;
                break;
            } else if(is_global_command && myText[i] == 'open') {
                if(myText[i + 1] != undefined) {
                    talk(`Opening ${myText[i + 1]}`);
                    openedWindow = window.open(`https://${myText[i + 1]}`);
                }
                break;
            } else if(is_global_command && (myText[i] == 'date' || myText[i] == 'time')) {
                var today = get_date();
                talk(today);
                break;
            } else if(is_global_command && myText[i] == 'play') {
                talk('Opening Youtube');
                talk(`Select video!, ${myText[i + 1]}`);
                openedWindow = window.open(`https://www.youtube.com/results?search_query=${myText[i + 1]}`);
                break;
            } else if(is_global_command && myText[i] == 'close') {
                talk('Closing window');
                openedWindow.close();
                break;
            } else if(is_global_command && myText[i] == 'help') {
                html = commands + html;
                break;
            }
        }

        logs.html(html);
    }

    $('#quiz_frame').on('click', 'h3', function(e) {
        try {
            recognition.start();
            talk('Initiating Microphone....');
            $('h3').css('background-color', 'red');
            $('h3').css('color', 'white');
        } catch(e) {
            recognition.stop();
            talk('Deactivating Microphone...');
            $('h3').css('background-color', 'greenyellow');
            $('h3').css('color', 'black');
        }
        logs.html(html);
    });

    recognition.onspeechend = function() {
        talk('You are too quiet, I will Deactivate the Microphone...');
        $('h3').css('background-color', 'greenyellow');
        $('h3').css('color', 'black');
        
        logs.html(html);
    }

    recognition.onerror = function() {
        talk('You are too quiet, I will Deactivate the Microphone...');
        $('h3').css('background-color', 'greenyellow');
        $('h3').css('color', 'black');
        
        logs.html(html);
    }

    function askQuestion() {
        try {
            talk(questions[item_count].question);
        } catch(e) {
            talk('Okay, that\s it, tallying up your score...!');
            $.post('/update_score', { subject_code: subject_code, score: score });
            const name = $('#user_name').val().charAt(0).toUpperCase() + $('#user_name').val().slice(1);
            socket.emit('logs', { message: `${name} scored ${score}/${questions.length} in ${subject_code}` });
            talk(`You scored ${score}/${questions.length} in ${subject_code}`);
            is_game_running = false;
            item_count = 0;
            score = 0;
        }
    }

    function talk(text) {
        const speech = new SpeechSynthesisUtterance();
        html = `<p><span class="red">Marvin: </span>${text.trim()}</p>` + html;
        text = text.replace(/_____/g, "blank");
        // Set the text and voice attributes.
        speech.text = text;
        speech.volume = 1;
        speech.rate = 1.1;
        speech.pitch = 1.85;
        
        window.speechSynthesis.speak(speech);
    }

    function get_date() {
        var objToday = new Date(),
            weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
            dayOfWeek = weekday[objToday.getDay()],
            domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
            dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
            months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
            curMonth = months[objToday.getMonth()],
            curYear = objToday.getFullYear(),
            curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
            curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
            curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
            curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
        var today = curHour + ":" + curMinute + " " + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;

       return today;
    }
})