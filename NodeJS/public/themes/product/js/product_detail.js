
$(document).ready(function(){
   	$("input[name='input_number_product']").bind('keyup mouseup', function () {
   		var number_choose = 0;
   		$("input[name='input_number_product']").each(function(){
   			var data = $(this).val();
   			if (data != "" && data != "0") {
   				var number = parseInt($(this).val());
	   			if (number < 0) {
	   				$(this).val("0");
	   			} else {
	   				number_choose += number;
	   			}
   			}
   		});
   		var price = parseInt($("input[name='price']").val());
   		var total = number_choose*price;
   		$("input[name='total']").val(number_choose);
   		$("#money").text(total + " $");
	});

	$("button[name='add_cart']").click(function(){
		addToCart();
	});

	$(".money").each(function(){
        var money = $(this).text();
        $(this).text(money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
    });

});

function addToCart_buyNow() {
	var checkAdd = false;
	var productId = $("input[name='product_id']").val();
	var dataInfoProduct = "";
	var price = parseInt($("input[name='price']").val());
	var name = $("input[name='product_name']").val();
	var product_main_file = $("input[name='product_main_file']").val();
	$("input[name='input_number_product']").each(function(){
			var data = $(this).val();
			if (data != "" && data != "0") {
				checkAdd = true;
				var number = parseInt(data);
   				dataInfoProduct += '{"number":"' + number + '", "color":"' + $(this).next().val() + '", "name":"' + name  + '", "main_file":"' + product_main_file +'", "price":"' +  price +'"},';
			}
		});
	if (checkAdd) {
		$.ajax({
            type: 'POST',
            url: "/add_product_to_cart",
            async: true,
            data:JSON.stringify({
                    product_id: productId,
                    product_info: JSON.parse("[" + dataInfoProduct.substring(0, dataInfoProduct.length -1) + "]")
            }),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {  
             	$(".product_add").text(data.product_total);
             	$(".product_add").parent().parent().parent().removeClass("disabled");
             	return true;
            },
            error: function (xhr, ajaxOptions, thrownError) { 
            	alert("error");
            	return false;
            }
    	});
	} else {
		swal({
		 title: "Thông báo",
		 text: "Vui lòng nhập số lượng sản phẩm !",
		 type: "error",
		 confirmButtonText: "close"
		}); 
		return false;
	}
	
}

function addToCart() {
	var checkAdd = false;
	var productId = $("input[name='product_id']").val();
	var dataInfoProduct = "";
	var price = parseInt($("input[name='price']").val());
	var name = $("input[name='product_name']").val();
	var product_main_file = $("input[name='product_main_file']").val();
	$("input[name='input_number_product']").each(function(){
		var data = $(this).val();
		if (data != "" && data != "0") {
			checkAdd = true;
			var number = parseInt(data);
				dataInfoProduct += '{"number":"' + number + '", "color":"' + $(this).next().val() + '", "name":"' + name  + '", "main_file":"' + product_main_file +'", "price":"' +  price*number +'"},';
		}
	});
	if (checkAdd) {
		$.ajax({
            type: 'POST',
            url: "/add_product_to_cart",
            async: true,
            data:JSON.stringify({
                    product_id: productId,
                    product_info: JSON.parse("[" + dataInfoProduct.substring(0, dataInfoProduct.length -1) + "]")
            }),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {  
             	$(".product_add").text(data.product_total);
             	$(".product_add").parent().parent().parent().removeClass("disabled");
             	$('#myModal').modal('hide');
             	swal({
					 title: "Thông báo",
					 text: "1 sản phẩm đã được thêm thành công vào giỏ hàng, click vào giỏ hàng để xem chi tiết",
					 type: "success",
					 confirmButtonText: "close"
				}); 
             	$("div.alert-success").show().fadeOut(30000);
            },
            error: function (xhr, ajaxOptions, thrownError) { 
            	alert("error");
            }
    	});
	} else {
		swal({
		 title: "Thông báo",
		 text: "Vui lòng nhập số lượng sản phẩm !",
		 type: "error",
		 confirmButtonText: "close"
		}); 
	}

}