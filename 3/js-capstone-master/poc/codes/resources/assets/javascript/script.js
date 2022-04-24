$(document).ready(function () {
    const socket = io();

    socket.emit('display_challenge', 0);

    socket.on('display_challenge', (data) => {
        console.log(data);
        $('.input .test_cases div').html(data.test_cases);
    });

    socket.on('start_record', function() {
        $('input[type=submit]').css('display', 'inline-block');
    });

    socket.on('end_record', function(response) {
        $('#timestamp').html(response);
        //$('form')[0].reset();
        $('input[type=submit]').css('display', 'none');
    });

    socket.on('set_timestamp', function(response) {
        $('#timestamp').html(response);

        socket.emit('add_record', $('textarea').val());
    });

    socket.on('save_record', function (response) {
        $('ul').append(response);
    });

    socket.on('start_playing_record', function(response) {
        $('.output textarea').val(response.text);
        $('.output .progress span').css('left', `${response.progress}%`);
        $(`#${response.record_id} #timestamp`).html(response.timestamp);
        $(`#${response.record_id}`).css('background-color', 'lightyellow');
        $('.stop').attr('data-icon', 'bx:play-circle');
        $('.stop').attr('class', 'iconify play');
        $(`#${response.record_id} .play`).attr('data-icon', 'fa-regular:stop-circle');
        $(`#${response.record_id} .play`).attr('class', 'iconify stop');
    });

    socket.on('stop_playing_record', function(response) {
        //$('.output textarea').val('');
        $('.output .progress span').css('left', `0%`);
        $(`#${response.record_id} #timestamp`).html(response.ended_at);
        $(`#${response.record_id}`).css('background-color', 'transparent');
        $(`#${response.record_id} .stop`).attr('data-icon', 'bx:play-circle');
        $(`#${response.record_id} .stop`).attr('class', 'iconify play');

        $('.playback_speed span:first-child').click();
    });

    socket.on('remove_record', function(response) {
        $(`#${response}`).remove();
    });

    socket.on('display_test_cases', (response) => {
        $('.input .test_cases div').html(response);
    });

    socket.on('display_output', (response) => {
        console.log('out', response)
        $('.input .console div').html(response);
    });

    socket.on('replay_display_test_cases', (response) => {
        $('.output .test_cases div').html(response);
    });

    socket.on('replay_display_output', (response) => {
        $('.output .console div').html(response);
    });

    $('textarea').bind('input propertychange', function() {
        socket.emit('start_record');
    });

    $(document).on('keydown', 'textarea', function (event) {
        if (event.code === 'Tab') {
            $(this).val(function(i, text) {
               return text + '\t';
            });
            event.preventDefault();
        }
    });

    $(document).on('submit', 'form', function() { // triggered when submit button is clicked
        socket.emit('run_code', $(this).children('textarea').val());
        return false;
    });

    $(document).on({ // triggered when record is hovered and not hovered
        mouseenter: function() {
            if ($(this).children('.play').length) {
                $(this).children('.remove').css('display', 'inline-block');
            }
        },
        mouseleave: function() {
            $(this).children('.remove').css('display', 'none');
        }
    }, 'li');

    $(document).on('click', '.remove', function() { // triggered when remove button is clicked
        socket.emit('remove_record', $(this).parent().attr('id'));
    });

    $(document).on('click', '.play', function() { // triggered when play button is clicked
        socket.emit('stop_playing_record', $('.stop').parent().attr('id'));
        socket.emit('start_playing_record', $(this).parent().attr('id'));
    });

    $(document).on('click', '.stop', function() { // triggered when stop button is clicked
        socket.emit('stop_playing_record', $(this).parent().attr('id'));
    });

    $(document).on('click', '.playback_speed span', function() { // triggered when the playback speed is changed
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');

        socket.emit('change_playback_speed', $(this).index());
    });

    window.addEventListener("beforeunload", function() { // triggered when page is about to unload
        socket.disconnect();;
    });

    $(document).on('click', '.output .progress', function(event) { // triggered when progress is clicked
        socket.emit('jump', {
            progress_x: $(this).offset().left,
            progress_width: $(this).width(),
            x: event.clientX
        });
    });
});