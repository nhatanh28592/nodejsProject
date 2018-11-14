$(document).ready(function () {
    var header = document.getElementById("myHeader");
    var sticky = header.offsetTop;
    window.onscroll = function() {myFunction(sticky)};

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

    $("#addClass").click(function () {
        $('#qnimate').addClass('popup-box-on');
    });

    $("#removeClass").click(function () {
        $('#qnimate').removeClass('popup-box-on');
    });
});

function myFunction(sticky) {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}