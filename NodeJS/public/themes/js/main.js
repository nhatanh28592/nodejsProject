var socket ;
$(document).ready(function () {
  if (!socket) {
    socket = io();
  }
  var infoLogin = $("input[name='key']").val();
  if (infoLogin) {
    alert("VERSION: " + navigator.appVersion);
    var user = '{"user_info" : "' + infoLogin + '"}';
    socket.emit('login', user);
  }

  $( window ).unload(function() {
    socket.emit('disconnect_user', user);
  });
});

$(function () {
    //window.onscroll = function() {myFunction()};
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

    $("#removeClass").click(function () {
        $('#qnimate').removeClass('popup-box-on');
    });

    $('#sing_up').click(function(){
      var userName = $(this).parent().children("input.user_name").val();
      var password = $(this).parent().children("input.password").val();
      $.ajax({
            type: 'POST',
            url: "/check_singup",
            async: true,
            data:JSON.stringify({
                    user_name: userName,
                    password: password
            }),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {  
              if(data.status == "ok") {
                document.getElementById("form_singup").submit();
              } else {
                $("div.error_sing_up", "#form_singup").text(data.status);
                $("div.error_sing_up", "#form_singup").show();
              }
            },
            error: function (xhr, ajaxOptions, thrownError) { 
              alert("error");
            }
      });
    });

    $("#create_account").click(function(){
      $("div.error_sing_up", "#form_singup").hide();
    });
});

function myFunction(sticky) {
    var header = document.getElementById("myHeader");
    var sticky = header.offsetTop;
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}