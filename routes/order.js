const express = require('express');
const router = express.Router();
const userManager = require('../models/user');
const productManager = require('../models/product');
const orderManager = require('../models/order');
const connection = require('../models/databaseConnection');
const deletedProduct = productID => {
	return {
		id: parseInt(productID),
		name: 'Sản phẩm đã bị xoá',
		ingredient: '',
		recipe: '',
		price: 0,
	}
}

router.get('/', function(req, res, next) {
	res.send('fuck off');
});

router.get('/list', function(req, res, next) {
	const d = new Date();
	res.redirect(`/order/list-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);
});

router.get('/list-:year-:month-:date', function(req, res, next) {
	if (req.cookies.id >= 1) {
		const currentDate = new Date(req.params.year,req.params.month - 1, req.params.date)
		orderManager.getList(
			connection,
			req.params.year,
			req.params.month, //why the fuck is month start by 0????
			req.params.date,
			function(results) {
				userID = req.cookies.id;
				if (results.code == 0) {
					var productList = [], 
						productIDList = [], 
						orderList = results.resultList;
					var left = orderList.reduce((a, b) => a + b.productIDList.length, 0);
					const ren = function() {
						userManager.getAccount(connection, userID, function(result) {
							if (!result.account.isAdmin) {
								orderList = orderList.filter(order => order.userID == userID);
							}
							console.log('ren=', productList);
							res.render(
								'order/list', 
								{
									currentDate:currentDate,
									productList:productList, 
									orderList:orderList, 
									userID:userID,
									isAdmin:!!result.account.isAdmin,
									name:req.cookies.name
								});
						});
					}
					if (orderList.length == 0) {
						ren();
					} else {
						for (let order of orderList) {
							for (let productID of order.productIDList) {
								if (!productIDList.find(p => p == productID)) {
									productIDList.push(productID);
									productManager.detail(connection, productID, 'id, name, price', function(result) {
										console.log('code=', result.code);
										if (result.code == 0) {
											productList.push(result.product);
										} else {
											productList.push(deletedProduct(productID));
										}
										if (--left == 0) {
											ren();
										}
									});
								} else if (--left == 0) {
									ren();
								}
							}
						}
					}
				} else {
					next();
				}
			});
	} else {
		next();
	}
});

router.get('/:orderID/status', function(req, res, next) {
	orderManager.getStatus(connection, req.params.orderID, function(result) {
		res.send(result);
	});
});

router.post('/add', function(req, res, next) {
	var userName, 
		productList = [], 
		productIDList = req.cookies.productIDList.split('-'), 
		productAmountList = req.cookies.productAmountList.split('-');
	const userID = req.cookies.id, totalPrice = req.body.totalPrice;
	console.log('totalprcie=', totalPrice);
	const addOrder = () => {
		res.clearCookie('productIDList');
		res.clearCookie('productAmountList');
		orderManager.add(
			connection, 
			userID, 
			userName, 
			productIDList, 
			productAmountList, 
			totalPrice,
			function(result) {
				res.redirect('/order/list');
			});
	}
	if (!req.cookies.id) {
		next();
	} else {
		userManager.getInfomation(connection, req.cookies.id, function(result) {
			userName = result.userInformation.name;
			addOrder();
		});
	}
});

router.post('/:orderID/next-status', function(req, res, next) {
	userManager.getAccount(connection, req.cookies.id, function(result) {
		if (result.account.isAdmin) {
			console.log('orderid=',req.params.orderID);
			orderManager.nextStatus(connection, req.params.orderID, function(result) {
				res.send(result);
			});
		} else {
			next();
		}
	});
});

module.exports = router;