$(document).ready(function(){
	$("#mobile").keypress(function (e) {
     //if the letter is not digit then display error and don't type anything
     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
        $("#errmsg_mobile").html("Vui lòng chỉ nhập số !").show().fadeOut(3000);
               return false;
    }
   });
});

function validate_activity() {
	var error  = validate.single($("input[name='email']").val(), {presence: true, email: true});
	return error;
}