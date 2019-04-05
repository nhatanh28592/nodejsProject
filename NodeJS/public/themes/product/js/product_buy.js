$(document).ready(function(){
	$("#mobile").keypress(function (e) {
     //if the letter is not digit then display error and don't type anything
     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
        $("#errmsg_mobile").html("Vui lòng chỉ nhập số !").show().fadeOut(3000);
               return false;
    }
   });
  $("button.btn-delete").click(function(){
    var id = $(this).parent().next().val();
    $.ajax({
          type: 'POST',
          url: "/delete_product_from_cart",
          async: true,
          data:JSON.stringify({
                  id: id
          }),
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          success: function (data) {  
            alert("status: " + data.delete_status);
          },
          error: function (xhr, ajaxOptions, thrownError) { 
            alert("error");
            return false;
          }
    });
  });
});

function validate_activity() {
	var error  = validate.single($("input[name='email']").val(), {presence: true, email: true});
	return error;
}