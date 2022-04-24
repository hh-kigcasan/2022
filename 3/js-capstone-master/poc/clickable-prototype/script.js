$(document).ready(function () {
    $('li').mouseenter(function() {
        if ($(this).children('.play').length) {
            $(this).children('.remove').css('display', 'inline-block');
        }
    }).mouseleave(function() {
        $(this).children('.remove').css('display', 'none');
    });

    $(document).on('click', '.remove', function() {
        $(this).parent().remove();
    });

    $(document).on('click', '.play', function() {
        $('.stop').attr('data-icon', 'bx:play-circle');
        $('.stop').attr('class', 'iconify play');


        $(this).attr('data-icon', 'fa-regular:stop-circle');
        $(this).attr('class', 'iconify stop');
    });

    $(document).on('click', '.stop', function() {
        $(this).attr('data-icon', 'bx:play-circle');
        $(this).attr('class', 'iconify play');
    });
});