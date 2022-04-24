$(document).ready(() => {
    $('form > div > input:submit').click(() => {
        let text = $('form > textarea').val();
        if(text) {
            let questions = generate(text);
            displayQuestions(questions);
        }
    })

    $('body').on('click', '#btn', (() => {
        let json = [];
        let questions = $('textarea.questions');
        let checkbox = $(':checkbox');
        let input = $('input:text');
        let subject_name = $('#subject_name').val();
        let subject_code = $('#subject_code').val();

        input.splice(0, 2);

        for(let i = 0; i < checkbox.length; i++) {
            if(!checkbox[i].checked) {
                json.push({question: questions[i].value , answer: input[i].value});
            }
        }

        $.post('/questions', {subject_name: subject_name, subject_code: subject_code, questions: json}, (errors) => {
            $('.container, #shadow, .cookiesContent').show();
            let error = JSON.parse(errors);
            $('.container').find('p').html(error['Subject Name']);
        });
    }));

    function generate(text) {
        let sentence = text.split(/[.|,]/);
        let questions = [];
        for(let i = 0; i < sentence.length; i++) {
            
            let words =  sentence[i].split(' ');

            if(words.length > 5) {
                for(let j = 0; j < words.length; j++) {
                    if(words[j].trim() == 'called' || words[j].trim() == 'as') {
                        questions.push({ sentence: words, key_words: j + 1});
                        break;
                    }

                    if(words[j].trim() == 'is' || words[j].trim() == 'was') {
                        questions.push({ sentence: words, key_words: j - 2});
                        break;
                    }
                }
            }
        }
        return questions;
    }

    function displayQuestions(questions) {
        let html = `<h3>Please review the questions carefully.</h3>`;

        for(let i = 0; i < questions.length; i++) {
            html += `Question: ${i + 1}) irellevant <input type="checkbox" name="q${i}" value="irellevant" /><br />`;
            html += `<textarea name="q${i}" class="questions">`;

            for(let j = 0; j < questions[i].sentence.length; j++) {
                if(questions[i].key_words == j) {
                    html += `_____`;
                    j++;
                } else {
                    html += `${questions[i].sentence[j]}`.trim(); 
                }

                html += ` `;
            }
            let answer = `${(questions[i].sentence[questions[i].key_words]) || ''} ${(questions[i].sentence[questions[i].key_words + 1]) || ''}`.replace(/[\{\}\(\)\[\]\,\.]/g, '');
            
            html += '?</textarea>\n';
            html += `<input type="text" name="q${i}" value="${answer}" /> <br />`;
        }

        $('#new_container').show("slide:right");
        html += `<button id="btn">Create Questionnaire</button>`;
        $('#new_container').html(html);
    }
});