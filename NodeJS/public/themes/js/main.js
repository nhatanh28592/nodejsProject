$(document).ready(function () {
    $('.fdi-Carousel .item').each(function () {
        var next = $(this).next();
        if (!next.length) {
            next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));

        if (next.next().length > 0) {
            next.next().children(':first-child').clone().appendTo($(this));
        }
        else {
            $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
        }
    });
    $("input[name='search']").on('keypress', function (e) {
         if(e.which === 13){
             window.location.href = "/?search=" + $(this).val();
         }
   });
    $("button[name='search']").on('click', function (e) {
        window.location.href = "/?search=" + $("input[name='search']").val();
   });
});