$(document).ready(function() {
    $(document).on("click", ".add", function() {
        $("#confirm-box").slideDown("fast");
    });

    $(document).on("click", ".confirm", function() {
        $("#confirm-box").hide();
        $("#success-box").slideDown("fast");
    });

    $(document).on("click", "#success-box-btn", function() {
        $("#success-box").slideUp("fast");
    });

    $(document).on("click", ".cancel", function() {
        $("#confirm-box").hide();
    });

    $(document).on("input", "#user-chat", function() {
        if($(this).val().length > 0) {
            $(this).addClass("big");
        }
        else if($(this).val().length === 0) {
            $(this).removeClass("big");
        }
    });

});