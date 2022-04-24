$(document).ready(function(){
    
    $("body").css("background-image", "url(\""+background+"\")");
    $("body").css("color", color);

    $(".show").click(function(){
        location.href = "/charts/edit/" + $(this).attr("data-id");
    });

    $(".download").click(function(){
        location.href = "/charts/download/" + $(this).attr("data-id");
    });

    $(".pdf").click(function(){
        location.href = "/charts/download/" + $(this).attr("data-id");
    });
});