var express = require("express");
var app = express();

var connectOnce = require('connect-once');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
const NodeCache = require( "node-cache" );
var mongodb = require('mongodb');
var passport = require("passport");   
var LocalStrategy = require("passport-local");   
var passportLocalMongoose = require("passport-local-mongoose");
var multer  = require('multer');
var cookieParser = require('cookie-parser');
var mongoose = require("mongoose");
 
var MongoClient = mongodb.MongoClient;

var autoIncrement = require("mongodb-autoincrement");
 
//var url = 'mongodb://mongodb58394-nhatanhtest.jelastic.tsukaeru.net/mongodb-connect';
//var url = 'mongodb://localhost:27017/test';
var url = 'mongodb://nhatanh285:hna2851992@ds113835.mlab.com:13835/nhatanh_test';
// Number of page
var numberPager = 4;

var connection = new connectOnce({ 
    retries: 60, 
    reconnectWait: 1000
}, MongoClient.connect, url);
 
// Login
mongoose.connect(url);
app.use(require("express-session")({
    secret:"Rusty is the best og in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Send mail
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nhatanh2852@gmail.com',
    pass: 'hna2851993'
  }
});

//app.use(expressValidator);
var jsonInfoMultiFile = "";
var mainFile = "";

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Save product buffer
const myCache = new NodeCache();;

// save cookie
app.use(cookieParser());
// set a cookie
app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.cookieName;
  if (cookie === undefined)
  {
    // no: set a new cookie
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
  } 
  else
  {
    // yes, cookie was already present 
  } 
  next(); // <-- important!
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload');
  },
  filename: function (req, file, cb) {
  	var d = new Date();
    var n = d.getTime()
    var res = file.originalname.split(".");
    var fileNameUpload = n + "." + res[res.length -1];
    cb(null, fileNameUpload);
    if (mainFile == "") {
    	mainFile = fileNameUpload;
    }
    jsonInfoMultiFile += '{"fileName":"' + fileNameUpload + '"}' + ",";
  }
});

var uploadMultiFile = multer({ storage: storage }).array('multiFile');

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.listen(8080);

app.get("/", function(req, res){
	var pageStr = req.query.page;
	var search = req.query.search;
	console.log("Page: " + page);
	var page = 0;
	if (pageStr != undefined) {
		page = parseInt(pageStr);
	}
	if (search == undefined) {
		search = '';
	}
	// Get the documents collection
	connection.when('available', function (err, db) {

    // Do stuff
        var collection = db.collection('product');
 		var collectionType = db.collection('type_main');
        // Find some state

        collection.find({"info_product.name_utf":new RegExp(utf8(search), "i")}).toArray
        (
            function (err, result) {
                if (err) {
                    console.log(err);
                } else if (result.length) {
                    //var result=result.length;
                    var total;
                	var cookie = req.cookies.cookieName;
                	if (cookie == undefined) {
                		total = 0;
                	} else {
                		var productData = myCache.get(cookie);
	            		if (productData == undefined)
	            			total = 0;
	            		else
	            			total = productData.length;
                	}
                	// Data link left
 
			 		collectionType.aggregate([{
					    	$lookup: {
						        from: "type",
						        localField: "_id",
						        foreignField: "type_main",
						        as: "type_info"
					    	}
						}]).toArray(
			 
			            function (err, res_type) {
			                if (err) {
			                    console.log(err);
			                } else if (res_type.length) {
			                	var prevPager = page - 1;
			                	var nextPager = page + 1;

        	 					res.render("index", {products: result.slice(numberPager*page, numberPager*page + numberPager) , 
        	 						total_product: total, types: res_type, 
        	 						count: (result.length/numberPager),
        	 						prevPager: prevPager,
        	 						nextPager: nextPager,
        	 						page: page,
        	 						list: false
        	 					});

			                } else {
			                    console.log('No document(s) found with defined "find" criteria!');
			                    res.send("Error");
			                }
			            }
			 
			        );
                } else {
                    console.log('No document(s) found with defined "find" criteria!');
                    res.send("Error");
                }
            }
 
        );
	});
});

app.get("/product_list", function(req, res){
	var pageStr = req.query.page;
	console.log("Page: " + page);
	var page = 0;
	if (pageStr != undefined) {
		page = parseInt(pageStr);
	}
	var type_main = req.query.type_main;
	var type = req.query.type;
	// Get the documents collection
	connection.when('available', function (err, db) {
        var collection = db.collection('product');
 		var collectionType = db.collection('type_main');
        // Find some state
        collection.find({ "type" : {
	        "type_main" : type_main,
	        "type" : type
	    }}).toArray(
 
            function (err, result) {
                if (err) {
                    console.log(err);
                } else if (result.length) {
                    //var result=result.length;
                    var total;
                	var cookie = req.cookies.cookieName;
                	console.log("cookie da co la: " + cookie)
                	if (cookie == undefined) {
                		total = 0;
                	} else {
                		var productData = myCache.get(cookie);
	            		if (productData == undefined)
	            			total = 0;
	            		else
	            			total = productData.length;
                	}
 
			 		collectionType.aggregate([{
					    	$lookup: {
						        from: "type",
						        localField: "_id",
						        foreignField: "type_main",
						        as: "type_info"
					    	}
						}]).toArray(
			 
			            function (err, res_type) {
			                if (err) {
			                    console.log(err);
			                } else if (res_type.length) {
			                	var prevPager = page - 1;
			                	var nextPager = page + 1;
			                    console.log("DATA: " +  JSON.stringify(res_type));
        	 					res.render("index", {products: result.slice(numberPager*page, numberPager*page + numberPager) , 
        	 						total_product: total, types: res_type, 
        	 						count: (result.length/numberPager),
        	 						prevPager: prevPager,
        	 						nextPager: nextPager,
        	 						page: page,
        	 						list: true,
        	 						type_main: type_main,
        	 						type: type
        	 					});

			                } else {
			                    console.log('No document(s) found with defined "find" criteria!');
			                    res.send("Error");
			                }
			            }
			 
			        );
                } else {
                    console.log('No document(s) found with defined "find" criteria!');
                    res.send("Error");
                }
            }
 
        );
    });
});

app.get("/add_product", function(req, res){
	connection.when('available', function (err, db) {
    	// Get the documents collection
        var collection = db.collection('type');
        // Find some state
        collection.find().toArray
        (
 
            function (err, result) {
                if (err) {
                    console.log(err);
                } else if (result.length) {
 					res.render("add_product", {types: result , total_product: 0, value: result.length});
                } else {
                    console.log('No document(s) found with defined "find" criteria!');
                    res.render("add_product", {types: result , total_product: 0, value: result.length});
                }
            }
 
        );
    });
});

app.post("/saveData", function(req, res){
	uploadMultiFile(req, res, function(err){
		if(err) {
			res.send("Error");
		} else {
			connection.when('available', function (err, db) {
			    autoIncrement.getNextSequence(db, 'product', function (err, autoIndex) {
			        var collection = db.collection('product');
			        var color = [];
			        if( Object.prototype.toString.call( req.body.color ) === '[object Array]' ) {
					    color = req.body.color;
					} else {
						color.push(req.body.color);
					}
			        collection.insert({
			            _id: autoIndex,
			            type:{
			            	type_main : req.body.type_main,
			            	type : req.body.type
			            },
			            info_product: {
			            	name : req.body.name,
			            	name_utf: utf8(req.body.name),
			            	price : req.body.price, 
			            	description: req.body.description, 
			            	main_file: mainFile,
			            	color: color
			            },
			            file: JSON.parse("[" + jsonInfoMultiFile.substring(0, jsonInfoMultiFile.length -1) + "]")
			        });
			        jsonInfoMultiFile = "";
			        mainFile = "";
			    });
			});
			res.send("Save success!");
		}
	});
});


app.post("/save_location_info", function(req, res){
	console.log("save map");
	connection.when('available', function (err, db) {
		var collection = db.collection('map');
		collection.find({ "type" : req.body.type}).toArray(
            function (err, result) {
                if (err) {
                    console.log(err);
                    res.send({info:"Error"});
                } else if (result.length) {
                	var mapInfoArr = result[0].location
                	for (var i = 0; i < req.body.location.length; i++) {
                		var mapInfo = req.body.location[i];
                		if (mapInfoArr.filter(e => e.lat == mapInfo.lat && e.lng == mapInfo.lng).length == 0) {
                			mapInfoArr.push(mapInfo);
                		} else {
                			console.log("duplicate");
                		}
                	}

                	collection.update(
					   { _id: result[0]._id },
					   { $set:
					      {
					      	total : mapInfoArr.length,
					        location : mapInfoArr
					      }
					   }
					)
                    res.send({info:"Update success"});
                } else {
                    autoIncrement.getNextSequence(db, 'map', function (err, autoIndex) {
				        collection.insert({
				            _id: autoIndex,
				            type: req.body.type,
				            total: req.body.location.length,
				            location : req.body.location
				        });
				        res.send({info: "Insert success"});
				    });
                }
            }
 
        );
	});
});

app.get("/product_details", function(req, res){
	var pageStr = req.query.page;
	console.log("Page: " + page);
	var page = 0;
	var resultData;
	connection.when('available', function (err, db) {
	    if (err) {
	        console.log('Unable to connect to the mongoDB server. Error:', err);
	    } 
	    else 
	    {
   		    console.log('Connection established to', url);
	    	console.log('Connection correct user', url);
	    	// Get the documents collection
	        var collection = db.collection('product');
	        var collectionType = db.collection('type_main');
	 
	 		collection.find({ "type" : {
		        "type_main" : req.query.type_main,
		        "type" : req.query.type
		    }}).toArray
	        (
	 
	            function (err, result) {
	                if (err) {
	                    console.log(err);
	                } else if (result.length) {
	                    console.log(result);
	                    //var result=result.length;
	                    var total;
                    	var cookie = req.cookies.cookieName;
                    	console.log("cookie da co la: " + cookie)
                    	if (cookie == undefined) {
                    		total = 0;
                    	} else {
                    		var productData = myCache.get(cookie);
		            		if (productData == undefined)
		            			total = 0;
		            		else
		            			total = productData.length;
                    	}
	 					resultData = result;
	                } else {
	                    console.log('No document(s) found with defined "find" criteria!');
	                    res.send("ERROR");
	                }
	                //Close connection
	            }
	 
	        );

	        // Find some state
	        collection.findOne({'_id': parseInt(req.query.productId)}, function(err, document) {
			  	console.log("data: " + document._id);
			  	var total;
            	var cookie = req.cookies.cookieName;
            	if (cookie == undefined) {
            		total = 0;
            	} else {
            		var productData = myCache.get(cookie);
            		if (productData == undefined)
            			total = 0;
            		else
            			total = productData.length;
            	}
            	collectionType.aggregate([{
				    	$lookup: {
					        from: "type",
					        localField: "_id",
					        foreignField: "type_main",
					        as: "type_info"
				    	}
					}]).toArray(
		 
		            function (err, res_type) {
		                if (err) {
		                    console.log(err);
		                } else if (res_type.length) {
		                	var prevPager = page - 1;
		                	var nextPager = page + 1;
    	 					res.render("product_details", {product: document, products: resultData.slice(numberPager*page, numberPager*page + numberPager) , total_product: total, types: res_type,
    	 					count: (resultData.length/numberPager),
            	 						prevPager: prevPager,
            	 						nextPager: nextPager,
            	 						page: page,
            	 					    type_main: req.query.type_main,
            	 					    type: req.query.type,
            	 					    productId: req.query.productId});

		                } else {
		                    console.log('No document(s) found with defined "find" criteria!');
		                    res.send("ERROR");
		                }
		                //Close connection
		            }
		 
		        );
	         
			});


	    }
	});
});

app.post("/product_details", function(req, res){
	connection.when('available', function (err, db) {
	    if (err) {
	        console.log('Unable to connect to the mongoDB server. Error:', err);
	    } 
	    else 
	    {
   		    console.log('Connection established to', url);
	    	console.log('Connection correct user', url);
	    	// Get the documents collection
	        var collection = db.collection('product');
	 
	        // Find some state
	        collection.findOne({'_id': parseInt(req.body.product_id)}, function(err, document) {
			  	console.log("data: " + document._id);
			  	var total;
            	var cookie = req.cookies.cookieName;
            	if (cookie == undefined) {
            		total = 0;
            	} else {
            		var productData = myCache.get(cookie);
            		if (productData == undefined)
            			total = 0;
            		else
            			total = productData.length;
            	}
	          res.send({product: document});
			});
	    }
	});
});

app.post('/add_product_to_cart',multer().array(), function (req, res) {
	console.log("Thong tin don hang: " + req.body.product_info[0].main_file);
	var cookie = req.cookies.cookieName;
	var productData = myCache.get(cookie);
	if (productData == undefined) {
		var data = [];
		data.push(req.body);
		myCache.set( cookie, data, function( err, success ){
	  	if( !err && success ){
		    console.log( success ); 
		    console.log("SIZE: " + myCache.get(cookie).length) 
		  }
		});
	    res.send({product_total: myCache.get(cookie).length});
	} else {
		productData.push(req.body);
		myCache.set( cookie, productData, function( err, success ){
	  	if( !err && success ){
		    console.log( success ); 
		    console.log("SIZE: " + myCache.get(cookie).length) 
		  }
		});
	    res.send({product_total: myCache.get(cookie).length});
	}
});

app.post('/add_type',multer().array(), function (req, res) {
	connection.when('available', function (err, db) {
	    autoIncrement.getNextSequence(db, 'type', function (err, autoIndex) {
	        var collection = db.collection('type');
	        collection.insert({
	            _id: autoIndex,
	            type_main: req.body.type_main,
	            name: req.body.name
	    	});
	    	res.send({info: "save success"});
    	});
	});
});

app.post("/buy_now", function(req, res){
	console.log("data:" + req.body.product_id);
	var cookie = req.cookies.cookieName;
	if (cookie == null || cookie == undefined) {
		res.send("ERROR please go home page");
	} else {
		var productData = myCache.get(cookie);
		var productBuyList = [];
		var productDetail;
		var totalPrice = 0;
		if (productData != undefined) {
			for (var i = 0; i < productData.length; i++) {
		    	productDetail = productData[i].product_info;

		    	for (var j = 0; j < productDetail.length; j++) {
		    		totalPrice += parseInt(productDetail[j].price)*parseInt(productDetail[j].number);
		    	}

		    	var jsonData;
			  	jsonData = {
		            		product_info: productDetail
			  				};
			  	productBuyList.push(jsonData);
		    }
		    var total;
			if (cookie == undefined) {
				total = 0;
			} else {
				if (productData == undefined)
					total = 0;
				else
					total = productData.length;
			}

			connection.when('available', function (err, db) {
			    if (err) {
			        console.log('Unable to connect to the mongoDB server. Error:', err);
			    } 
			    else 
			    {
			    	// Get the documents collection
			        var collection = db.collection('type_main');	 
			 		collection.aggregate([{
					    	$lookup: {
						        from: "type",
						        localField: "_id",
						        foreignField: "type_main",
						        as: "type_info"
					    	}
						}]).toArray(
			 
			            function (err, result) {
			                if (err) {
			                    console.log(err);
			                } else if (result.length) {
			                    console.log("DATA: " +  JSON.stringify(result));
			                    res.render("product_buy", {products: productBuyList, total_product: total, total_price: totalPrice.toLocaleString(), types: result});
			                } else {
			                    console.log('No document(s) found with defined "find" criteria!');
			                    res.send("ERROR");
			                }
			                //Close connection
			            }
			 
			        );
			    }

			});
		} else {
			res.send("ERROR please go home page");
		}
	}
    
});

app.get("/buy_now", function(req, res){
	console.log("data:" + req.body.product_id);
	var cookie = req.cookies.cookieName;
	if (cookie == null || cookie == undefined) {
		res.send("ERROR please go home page");
	} else {
		var productData = myCache.get(cookie);
		var productBuyList = [];
		var productDetail;
		var totalPrice = 0;
		if (productData != undefined) {
			for (var i = 0; i < productData.length; i++) {
		    	productDetail = productData[i].product_info;

		    	for (var j = 0; j < productDetail.length; j++) {
		    		totalPrice += parseInt(productDetail[j].price)*parseInt(productDetail[j].number);
		    	}

		    	var jsonData;
				  	jsonData = {
			            		product_info: productDetail
				  				};
			  	productBuyList.push(jsonData);
		    }
		    var total;
			if (cookie == undefined) {
				total = 0;
			} else {
				if (productData == undefined)
					total = 0;
				else
					total = productData.length;
			}

			connection.when('available', function (err, db) {
			    if (err) {
			        console.log('Unable to connect to the mongoDB server. Error:', err);
			    } 
			    else 
			    {
			    	// Get the documents collection
			        var collection = db.collection('type_main');	 
			 		collection.aggregate([{
					    	$lookup: {
						        from: "type",
						        localField: "_id",
						        foreignField: "type_main",
						        as: "type_info"
					    	}
						}]).toArray(
			 
			            function (err, result) {
			                if (err) {
			                    console.log(err);
			                } else if (result.length) {
			                    res.render("product_buy", {products: productBuyList, total_product: total, total_price: totalPrice.toLocaleString(), types: result});
			                } else {
			                    console.log('No document(s) found with defined "find" criteria!');
			                    res.send("ERROR");
			                }
			                //Close connection
			            }
			 
			        );
			    }

			});
		} else {
			res.send("ERROR please go home page");
		}
	}
    
});

app.post("/buy_now_next_step", function(req, res){
	var mailSend = req.body.email;
	var fullUrl = req.protocol + '://' + req.get('host');
	var cookie = req.cookies.cookieName;
	var productData = myCache.get(cookie);
	var productBuyList = [];
	var productDetail;
	var totalPrice = 0;
	connection.when('available', function (err, db) {
	    autoIncrement.getNextSequence(db, 'product_booking', function (err, autoIndex) {
	        var collection = db.collection('product_booking');
	        collection.insert({
	            _id: autoIndex,
	            info_personal: req.body,
	            info_booking:productData
	        });
	        jsonInfoMultiFile = "";
	        mainFile = "";
	        var infoProductHtml = '';
			for (var i = 0; i < productData.length; i++) {
				infoProductHtml += '<div style="margin: auto;width: 60%;border: 2px solid red;padding: 10px;border-radius:5px">' +
							      	'<div  style="position:relative;">' + 
									    '<div><img src="' + fullUrl + '/upload/' + productData[i].product_info[0].main_file +'" alt="Logo" title="Logo" style="display:block;border: 1px solid;border-radius: 5px;" width="120" height="120" /></div>' + 
									    '<div style="position:absolute;width:250px;right:0;top:0;">'+
									    	'<p><b>Name: </b>' + productData[i].product_info[0].name + '</p>' +
									    	'<p><b>Số lượng: </b>' + productData[i].product_info[0].number + '</p>' +
									    	'<p><b>Màu sắc: </b>' + '<input type="color" value="' + productData[i].product_info[0].color +'" class="form-control" name="color" calss="color">' + '</p>' +
									    	'<p><b>Giá: </b><span style="color:red"><b>'+  productData[i].product_info[0].price +'</b></span></p>' +
									    '</div>' + 
									'</div>' + 
							      	'<a href="'+ fullUrl +'/product_booking_detail?id=' + autoIndex + '"><button style="font-size: 20px;color: red;">XEM CHI TIẾT ĐƠN HÀNG</button></a>' +
							      	'</div> <br>';
			}
			console.log("HYML: " + infoProductHtml);
			//Send mail 
			var mailOptions = {
					from: 'nhatanh2852@gmail.com',
					to: mailSend,
					subject: 'Thông báo đặt hàng thành công',
					forceEmbeddedImages: true,
					html: '<div style="margin: auto;width: 60%;border: 3px solid #73AD21;padding: 10px;border-radius: 10px;">' + 
					      	'<h1 style="color:red; text-align:center">XÁC NHẬN ĐẶT HÀNG THÀNH CÔNG</h1>' +
					      	'<p>Xin chào ! <span style="color:red">'+ req.body.name +'</span> chúng tôi đã nhận được đơn đặt hàng của bạn, cảm ơn vì đã đặt hàng của chúng tôi, chúng tôi sẽ liên hệ và giao hàng đến bạn một cách sớm nhất</p>' +
					      	infoProductHtml +
					      	'<div>' +
					      		'<img src="' + fullUrl + '/themes/img/logo.png" alt="Logo" title="Logo" style="display:block;" /> <br> <b>ĐIỆN NƯỚC HOÀNG PHI</b>' +
					      		'<br><br><p>ĐC : Mai Đăng Chơn, Hoà Quý, Ngũ Hành Sơn, TP Đà Nẵng</p>' +
					      		'<p>SDT: 01667288158</p>' +
					      	'</div>' +
					      '</div>'
				};
			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});
	    });

	});


    for (var i = 0; i < productData.length; i++) {
    	productDetail = productData[i].product_info;

    	for (var j = 0; j < productDetail.length; j++) {
    		totalPrice += parseInt(productDetail[j].price)*parseInt(productDetail[j].number);
    	}

    	var jsonData;
	  	jsonData = {
            		product_info: productDetail
	  				};
	  	productBuyList.push(jsonData);
    }
    var total;
	if (cookie == undefined) {
		total = 0;
	} else {
		if (productData == undefined)
			total = 0;
		else
			total = productData.length;
	}
	connection.when('available', function (err, db) {
		var collectionType = db.collection('type_main');
			collectionType.aggregate([{
		    	$lookup: {
			        from: "type",
			        localField: "_id",
			        foreignField: "type_main",
			        as: "type_info"
		    	}
			}]).toArray(
	        function (err, result) {
	            if (err) {
	                console.log(err);
	            } else if (result.length) {
	                console.log("DATA: " +  JSON.stringify(result));
	               
	                res.render("product_buy_next", {products: productBuyList, total_product: 0, total_price: totalPrice.toLocaleString(), types: result});
	                productData.length =0;
	            } else {
	                console.log('No document(s) found with defined "find" criteria!');
	                res.render("add_product");
	            }
	            //Close connection
	        }

	    );
	});

});

app.get("/product_booking_detail", function(req, res){
	var cookie = req.cookies.cookieName;
	var total = 0;
	if(cookie != undefined) {
   		 total = myCache.get(cookie).length;
	}
	connection.when('available', function (err, db) {
		var collectionType = db.collection('type_main');
		var colectionBooking = db.collection('product_booking');
		colectionBooking.findOne({'_id': parseInt(req.query.id)}, function(err, document) {
			var totalPrice = 0;
			for (var i = 0; i < document.info_booking.length; i++) {
				for (var j = 0; j < document.info_booking[i].product_info.length; j++) {
					totalPrice += parseInt(document.info_booking[i].product_info[j].price)*parseInt(document.info_booking[i].product_info[j].number);
				}
			}
        	collectionType.aggregate([{
			    	$lookup: {
				        from: "type",
				        localField: "_id",
				        foreignField: "type_main",
				        as: "type_info"
			    	}
				}]).toArray(
	 
	            function (err, res_type) {
	                if (err) {
	                    console.log(err);
	                } else if (res_type.length) {
	 					res.render("product_booking_detail", {product_booking: document, types: res_type, total_product: total, total_price :totalPrice.toLocaleString()});

	                } else {
	                    console.log('No document(s) found with defined "find" criteria!');
	                    res.send("ERROR");
	                }
	                //Close connection
	            }
	 
	        );
         
		});
			
	});
});

//LOGIN 


app.get("/map", function(req, res){
	res.render("map")
});

app.get("/map_view", function(req, res){
	connection.when('available', function (err, db) {
		var collection = db.collection('map');
		collection.find({},{ type:1, _id:0}).toArray(
            function (err, result) {
                res.render("map_view",{types:result});
            }
 
        );
	});
});

app.post("/near_by_search", function(req, res){
	var lat = parseFloat(req.body.lat);
	var lng = parseFloat(req.body.lng);
	var radius = parseFloat(req.body.radius);
	var distance = radius/100000;
	var latMin = lat - distance;
	var latMax = lat + distance;
	var lngMin = lng - distance;
	var lngMax = lng + distance;
	//.filter(e => e.lat >= latMin && e.lat <= latMax && e.lng >= lngMin && e.lng <= lngMax )
	connection.when('available', function (err, db) {
		var collection = db.collection('map');
		collection.find({ "type" : req.body.type}).toArray(
            function (err, result) {
                res.send({
                	map_info_arr: result[0].location.filter(e => e.lat >= latMin && e.lat <= latMax && e.lng >= lngMin && e.lng <= lngMax ), 
                	lat: lat, 
                	lng: lng, 
                	radius: radius});
            }
 
        );
	});
});

app.post("/save_location_info", function(req, res){
	console.log("save map");
	connection.when('available', function (err, db) {
		var collection = db.collection('map');
		collection.find({ "type" : req.body.type}).toArray(
            function (err, result) {
                if (err) {
                    console.log(err);
                    res.send({info:"Error"});
                } else if (result.length) {
                	var mapInfoArr = result[0].location
                	for (var i = 0; i < req.body.location.length; i++) {
                		var mapInfo = req.body.location[i];
                		if (mapInfoArr.filter(e => e.lat == mapInfo.lat && e.lng == mapInfo.lng).length == 0) {
                			mapInfoArr.push(mapInfo);
                		} else {
                			console.log("duplicate");
                		}
                	}

                	collection.update(
					   { _id: result[0]._id },
					   { $set:
					      {
					      	total : mapInfoArr.length,
					        location : mapInfoArr
					      }
					   }
					)
                    res.send({info:"Update success"});
                } else {
                    autoIncrement.getNextSequence(db, 'map', function (err, autoIndex) {
				        collection.insert({
				            _id: autoIndex,
				            type: req.body.type,
				            total: req.body.location.length,
				            location : req.body.location
				        });
				        res.send({info: "Insert success"});
				    });
                }
            }
 
        );
	});
});

function utf8(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}
