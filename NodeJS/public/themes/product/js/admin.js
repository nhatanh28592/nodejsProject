$(document).ready(function(){
    $("button.product").click(function(){
        $("div.map").hide();
        $("button.add").attr('data-target','#modalProduct');
        $.ajax({
            type: 'POST',
            url: "/admin_product",
            async: true,
            data:JSON.stringify({
                id: null
            }),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {  
                renderTableProduct(data.data);
            },
            error: function (xhr, ajaxOptions, thrownError) { 
                alert("error");
                return false;
            }
        });
    });

    $("button.product_booking").click(function(){
        $.ajax({
            type: 'POST',
            url: "/admin_product_booking",
            async: true,
            data:JSON.stringify({
                id: null
            }),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {  
                renderTableProductBooking(data.data);
            },
            error: function (xhr, ajaxOptions, thrownError) { 
                alert("error");
                return false;
            }
        });
    });

    $("button.user").click(function(){
        $("div.map").hide();
        $.ajax({
            type: 'POST',
            url: "/admin_user",
            async: true,
            data:JSON.stringify({
                id: null
            }),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {  
                renderTableUser(data.data);
            },
            error: function (xhr, ajaxOptions, thrownError) { 
                alert("error");
                return false;
            }
        });
    });

    $("div.data").on("click", "button.btn_edit", function() {
        var productId = $(this).next().val();
        $.ajax({
            type: 'POST',
            url: "/product_info_edit",
            async: true,
            data:JSON.stringify({
                productId: productId
            }),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {  
                var productData = data.product;
                var typeData = data.type_data;
                var typeMainData = data.type_main_data;
                var htmlType = "";
                var htmlTypeMain = "";
                var htmlColor = "";

                for (var i = 0; i < typeData.length; i++) {
                    var type = typeData[i];
                    htmlType += '<option value="' + type._id + '">' + type.name + '</option>';
                }

                for (var i = 0; i < typeMainData.length; i++) {
                    var typeMain = typeMainData[i];
                    htmlTypeMain += '<option value="' + typeMain._id + '">' + typeMain.name + '</option>';
                }

                for (var i = 0; i < productData.info_product.color.length; i++) {
                    var color = productData.info_product.color[i];
                    htmlColor += '<input type="color" value="' + color + '" class="form-control" name="color"><button class="btn btn-danger">Delete</button>';
                }

                $("select[name='type']", "#modalProductEdit").empty();
                $("select[name='type']", "#modalProductEdit").append(htmlType);
                $("select[name='type']", "#modalProductEdit").val(data.type);

                $("select[name='type_main']", "#modalProductEdit").empty();
                $("select[name='type_main']", "#modalProductEdit").append(htmlTypeMain);
                $("select[name='type_main']", "#modalProductEdit").val(data.type_main);

                $("div.color", "#modalProductEdit").empty();
                $("div.color", "#modalProductEdit").append(htmlColor);

                $("input[name='name']", "#modalProductEdit").val(productData.info_product.name);
                $("input[name='price']", "#modalProductEdit").val(productData.info_product.price);
                $("input[name='description']", "#modalProductEdit").val(productData.info_product.description);

                $("input[name='product_id']", "#modalProductEdit").val(productData._id);

            },
            error: function (xhr, ajaxOptions, thrownError) { 
                alert("error");
                return false;
            }
        });
    });

    $("div.data").on("change", "input.map_point", function() {
        if($(this).prop("checked")) {
            $("form.input_map").show();
        }
    });
});

function renderTableProduct(data) {
    var htmlTbStart = "";
    htmlTbStart += '<table class="table table-striped" style=""><thead><tr><th style="width:4%">Id</th><th style="width:38%">Tên sản phẩm</th><th style="width:38%">Hình ảnh</th><th style="width:10%"></th><th style="width:10%"></th></thead><tbody class="">';

    var htmlTbBody = "";
    for (var i = 0; i < data.length; i++) {
        var product = data[i];
        htmlTbBody += '<tr>';
        htmlTbBody += '<td>' + product._id + '</td>';
        htmlTbBody += '<td>' + product.info_product.name + '</td>';
        htmlTbBody += '<td><img src="upload/'+ product.info_product.main_file + '" width="50px" height="50px"></td>';
        htmlTbBody += '<td class="text-center"><button type="button" data-toggle="modal" data-target="#modalProductEdit" class="btn_edit btn btn-info"><span class="glyphicon glyphicon-edit"></span> Edit </button><input type="hidden" name="product_id" value="' + product._id + '"></td>';
        htmlTbBody += '<td class="text-center"><button type="button" class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span> Delete </button></td>';
        htmlTbBody += '</tr>';
    }

    var htmlTbEnd = "";
    htmlTbEnd += '</tbody></table>';
    $("div.data").empty();
    $("div.data").append(htmlTbStart + htmlTbBody + htmlTbEnd);
}

function renderTableProductBooking(data) {
    var htmlTbStart = "";
    htmlTbStart += '<table class="table table-striped" style=""><thead><tr><th style="width:4%">Id</th><th style="width:33%">Thông tin khách hàng</th><th style="width:33%">Thông tin đơn hàng</th><th style="width:10%"></th><th style="width:10%"></th></th><th style="width:10%"><span class="glyphicon glyphicon-map-marker"></span></th></thead><tbody class="">';

    var htmlTbBody = "";
    for (var i = 0; i < data.length; i++) {
        var productBooking = data[i];
        htmlTbBody += '<tr>';
        htmlTbBody += '<td>' + productBooking._id + '</td>';
        htmlTbBody += '<td>' + '<label>Name: </label> ' + productBooking.info_personal.name + '<br>';
        htmlTbBody += '<label>Email: </label> ' + productBooking.info_personal.email + '<br>';
        htmlTbBody += '<label>SDT: </label> ' + productBooking.info_personal.mobile + '<br>';
        htmlTbBody += '<label>Địa chỉ: </label> ' + productBooking.info_personal.address + '</td>';
        htmlTbBody += '<td>';
        for (var j = 0; j < productBooking.info_booking.length; j++) {
            productBookingInfo = productBooking.info_booking[j];
            for (var k = 0; k < productBookingInfo.product_info.length; k++) {
                var productInfo = productBookingInfo.product_info[k];
                htmlTbBody += '<div style="border:1px solid red;border-radius:5px;">';
                htmlTbBody += '<img src="upload/' + productInfo.main_file + '" width="50px" height="50px" style="padding: 2px;">';
                htmlTbBody += '<div style="margin-left:53px;"> <label>Tên sản phẩm: </label> ' + productInfo.name + '<br>';
                htmlTbBody += '<label>Số lượng: </label> ' + productInfo.number + '<br>';
                htmlTbBody += '<label>Màu sắc: </label> <input type="color" name="" value="' + productInfo.color + '" disabled><br>';
                htmlTbBody += '<label>Giá: </label> ' + productInfo.price + '</div></div>';
                if(k != (productBookingInfo.product_info.length -1)) {
                    htmlTbBody += '<br>';
                }
            }
        }
        htmlTbBody += '</td>';
        htmlTbBody += '<td class="text-center"><button type="button" class="btn btn-info"><span class="glyphicon glyphicon-edit"></span> Edit </button></td>';
        htmlTbBody += '<td class="text-center"><button type="button" class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span> Delete </button></td>';
        htmlTbBody += '<td class="text-center"><label class="checkbox-inline"><input type="checkbox" class="map_point" value="' + productBooking.info_personal.address + '"></label></td>';
        htmlTbBody += '</tr>';
    }

    var htmlTbEnd = "";
    htmlTbEnd += '</tbody></table>';
    $("div.data").empty();
    $("div.data").append(htmlTbStart + htmlTbBody + htmlTbEnd);
}

function renderTableUser(data) {
    var htmlTbStart = "";
    htmlTbStart += '<table class="table table-striped" style=""><thead><tr><th style="width:10%">Hình ảnh</th><th style="width:38%">User name</th><th style="width:38%">Loại đăng ký</th><th style="width:10%"></th><th style="width:10%"></th></thead><tbody class="">';

    var htmlTbBody = "";
    for (var i = 0; i < data.length; i++) {
        var user = data[i];
        htmlTbBody += '<tr>';
        if (user.facebook_id) {
            htmlTbBody += '<td><img src="http://graph.facebook.com/' + user.facebook_id + '/picture?type=normal" width="50px" height="50px" style="padding: 2px;border-radius:50%;"></td>';
        } else {
            htmlTbBody += '<td><img src="' + user.picture + '" width="50px" height="50px" style="padding: 2px;border-radius:50%;"></td>';
        }
        htmlTbBody += '<td>' + user.user_name + '</td>';
        if(user.facebook_id) {
            htmlTbBody += '<td><img src="themes/images/facebook_logo.png" width="50px" height="50px" style="padding: 2px;border-radius:50%;"></td>';
        } else {
            if(user.google_id) {
                htmlTbBody += '<td><img src="themes/images/google_logo.png" width="50px" height="50px" style="padding: 2px;border-radius:50%;"></td>';
            } else {
                htmlTbBody += '<td><img src="themes/images/user_logo.png" width="50px" height="50px" style="padding: 2px;border-radius:50%;"></td>';
            }
        }
        htmlTbBody += '<td class="text-center"><button type="button" class="btn btn-info"><span class="glyphicon glyphicon-edit"></span> Edit </button></td>';
        htmlTbBody += '<td class="text-center"><button type="button" class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span> Delete </button></td>';
        htmlTbBody += '</tr>';
    }

    var htmlTbEnd = "";
    htmlTbEnd += '</tbody></table>';
    $("div.data").empty();
    $("div.data").append(htmlTbStart + htmlTbBody + htmlTbEnd);
}