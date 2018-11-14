$(document).ready(function(){
   	$("#add_color").click(function() {
   		$("#color").append('<input type="color" class="form-control" name="color" calss="color">');
   	});
   	$("#add_type").click(function() {
   		var value = $("#valueType").val();
   		var type_main = $("#type_main").val();
   		var name = $("#typeAdd").val();
   		var newValue = parseInt(value) + 1;
   		$.ajax({
            type: 'POST',
            url: "/add_type",
            async: true,
            data:JSON.stringify({
            	type_main: type_main,
                name: name 
            }),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {  
             	$("#type").append('<option value="' + data.id + '">' + name + '</option>');
              $("#type").val(data.id);
            },
            error: function (xhr, ajaxOptions, thrownError) { 
            	alert("error");
            }
    });
   	});
});