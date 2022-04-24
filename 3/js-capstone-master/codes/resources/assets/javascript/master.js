$(document).ready(function() {

    const socket = io();

    socket.on('alert_success_message', function (response) {
        alert(response);
    });

    socket.on('display_new_record_history', function() { // signaled when the code finished running
        alert('Congratulations! You passed all the test cases for this challenge!');
        $('.video .editor input[type=submit]').css('display', 'none');
    });

    socket.on('display_challenge_logs', function(response) { // signaled when the code finished running
        $('.video .test_cases .response').html(response.test_cases);
        $('.video .output .response').html(response.output);
    });

    $(document).on('submit', '.video .editor', function() { // triggered when run and submit button is clicked
        socket.emit('run_code', $(this).children('textarea').val());
        return false;
    });

    socket.on('display_timer_running', function (timer) { // signaled while recording is in progress
        $('.video .settings .duration').html(timer);
        socket.emit('add_frame', $('.video .editor textarea').val());
    });

    $(document).on('keydown', '.video .editor textarea', function() { // triggered when text editor is changed for the first time
        $(this).siblings('input[type=submit]').show();
        socket.emit('start_recording', $('.available_challenges table tr.selected').attr('id'));
    });

    $(document).on('click', '.video .progress', function(event) { // triggered when video frame jumped
        socket.emit('jump_frame', {progress_x: $(this).offset().left, progress_width: $(this).width(), x: event.clientX});
    });

    $(document).on('click', '.video .settings .playback_speed span', function() { // triggered when video playback speed is changed
        $(this).parent().children().removeClass('selected');
        $(this).addClass('selected')

        socket.emit('change_playback_speed', $(this).index());
    });

    socket.on('stop_playing', function() { // signaled when video has stopped
        $('.history ul li.selected svg').attr('data-icon', 'fe:loop');
        $('.history ul li svg').attr('data-icon', 'gg:play-button-o');
        $('.video .settings svg').attr('data-icon', 'gg:play-button-o');
    });

    socket.on('clear_replay_output', function () { // signaled to clear output logs from video
        $('.history .video .output .response').html('');
    });

    socket.on('display_replay_logs', (response) => { // signaled to display logs from video
        $('.history .video .test_cases .response').html(response.test_cases);
        $('.history .video .output .response').html(response.output);
    });

    socket.on('display_frame', function(response) { // signaled to display each video frame
        $('.video .editor textarea').val(response.current_frame);
        $('.video .settings .duration').html(response.current_timer);
        $('.video .progress .indicator').css('left', `${response.progress_percentage}%`);
        $('.video .settings svg, .history ul li.selected svg').attr('data-filepath', response.filepath).attr('data-icon', 'fe:loop');
    });

    $(document).on('click', '.video .settings svg, .history ul li svg', function() { // triggered when video is played
        $('.history ul li').removeClass('selected');
        $('.history ul li svg').attr('data-icon', 'gg:play-button-o');
        $(this).parent().addClass('selected');

        socket.emit('start_playing', $(this).attr('data-filepath'));
    });

    $(document).on('click', '#get_editor, #get_video, #get_all_user_challenges_history', function() { // triggered when there's any api request
        const request = $(this);

        $.get(request.attr('href'), function(response) {
            $('#partial').html(response);
        });

        $(this).parent().parent().parent().children().removeClass('selected');
        $(this).parent().parent().addClass('selected');

        socket.emit('kill_processes');

        return false;
    });

    $(document).on('keydown', '.video .editor textarea', function (event) { // allow indent in textarea editor
        if (event.code === 'Tab') {
            $(this).val(function(i, text) {
                return text + '\t';
            });

            event.preventDefault();
        }
    });

    /*  DOCU: The following functions below are written for login and registration functionalities.
        Owner: Jette
    */

    socket.on('redirect', function (response) { // signaled when login is successful
        window.location.href = response;
    });

    socket.on('reset_form', function(response) { // signaled when add user is successful
        $(`form[action='${response}']`)[0].reset();
        setTimeout(function() {
            $('#partial p').remove();
        }, 1000);
    });

    $(document).on('submit', '.no_user form', function() { // triggered when form is submitted
        const form = $(this);

        $.post(form.attr('action'), form.serialize(), function(response) {
            $('#partial').html(response);
        });

        return false;
    });
});