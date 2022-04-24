$(document).ready(function () {

    /*  DOCU: The following functions below are written for admin template functionalities.
        Owner: Jette
    */

    $(document).on('click', '.admin .history ul li', function() { // triggered when record is played
        const selected = $('.admin .history .ul li.selected');
        selected.children('.iconify').attr('data-icon', 'gg:play-button-o');
        selected.removeClass('selected');

        $(this).children('.iconify').attr('data-icon', 'gg:play-stop-o');
        $(this).addClass('selected');

        $('.admin .history .video .settings .play').attr('data-icon', 'gg:play-pause-o');
        $('.admin .history .video .settings .play').removeClass('play').addClass('pause');

        $('.admin .history .video .settings .playback_speed span').removeClass('selected');
        $('.admin .history .video .settings .playback_speed span:first-child').addClass('selected');

        $('.admin .history .video').show();
    });

    $(document).on('click', '.admin .history ul li.selected', function() { // triggered when record is stopped
        const selected = $('.admin .history ul li.selected');
        selected.children('.iconify').attr('data-icon', 'gg:play-button-o');
        selected.removeClass('selected');

        $('.admin .history .video').hide();
    });

    $(document).on('click', '.admin .rankings table tr', function() { // triggered when user is selected from rankings
        $('.admin .rankings table tr').removeClass('selected');
        $(this).addClass('selected');
    });

    /*  DOCU: The following functions below are written for profile template functionalities.
        Owner: Jette
    */

    $(document).on('click', '.records .record', function() { // triggered when record is played
        const selected = $('.records .selected');
        selected.children('.iconify').attr('data-icon', 'gg:play-button-o');
        selected.removeClass('selected');

        $(this).children('.iconify').attr('data-icon', 'gg:play-stop-o');
        $(this).addClass('selected');

        $('.settings .play').attr('data-icon', 'gg:play-pause-o');
        $('.settings .play').removeClass('play').addClass('pause');

        $('.playback_speed span').removeClass('selected');
        $('.playback_speed span:first-child').addClass('selected');

        $('.video').show();
    });

    $(document).on('click', '.records .selected', function() { // triggered when record is stopped
        const selected = $('.records .selected');
        selected.children('.iconify').attr('data-icon', 'gg:play-button-o');
        selected.removeClass('selected');

        $('.video').hide();
    });

    $(document).on('click', '.playback_speed span', function() { // triggered when playback speed is changed
        $('.playback_speed span').removeClass('selected');
        $(this).addClass('selected');
    });

    $(document).on('click', '.settings .play', function() { // triggered when video is paused
        $(this).attr('data-icon', 'gg:play-pause-o');
        $(this).removeClass('play').addClass('pause');
    });

    $(document).on('click', '.settings .pause', function() { // triggered when video is played
        $(this).attr('data-icon', 'gg:play-button-o');
        $(this).removeClass('pause').addClass('play');
    });

    $(document).on('submit', '.challenge .editor', function() { // triggered when code is submitted
        alert('Run code');

        return false;
    });

    $(document).on('click', '.available_challenges p', function() { // triggered when any of the available challenges is selected
        $('.available_challenges p').removeClass('selected');
        $(this).addClass('selected');
    });

});