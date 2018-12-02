const express = require('express');
const router = express.Router();
const userManager = require('../models/user');
const productManager = require('../models/product');
const connection = require('../models/databaseConnection');
router.get('/', function(req, res, next) {
	res.redirect('/login');
});
router.get('/register', function(req, res, next) {
	if (!req.cookies.id) {
		res.render('register');
	} else next();
});
router.get('/login', function(req, res, next) {
	if (!req.cookies.id) {
		res.render('login');
	} else next();
});
router.post('/register', function(req, res, next) {
	const name = req.body.name,
		address = req.body.address,
		username = req.body.username,
		password = req.body.password,
		rePassword = req.body.rePassword;
	userManager.register(connection, name, address, username, password, rePassword, function(result) {
		if (result.code !== -1) {
    		res.clearCookie('id');
			res.cookie('id', result.code);
			res.cookie('name', name);
			res.redirect('/');
		}
		else res.render('register', {error: result.message, username: username});
	});
});
router.post('/login', function(req, res, next) {
	const username = req.body.username;
	const password = req.body.password;
	userManager.login(connection, username, password, function(result) {
		console.log('res= ' + result);
		if (result.code !== -1) {
			userManager.getInfomation(connection, result.code, function(result2) {
	    		res.clearCookie('id');
				res.cookie('id', result.code);
				res.cookie('name', result2.userInformation.name)
				res.redirect('/');
			})
		}
		else res.render('login', {error: result.message, username: username});
	});
});
router.get('/information', function(req, res, next) {
	const userID = req.cookies.id;
	const isAdmin = (req.cookies.id == 1);
	userManager.getInfomation(connection, userID, function(result) {
		console.log('result.userInformation=');
		console.log(result.userInformation);
		res.render(
			'user/information', 
			{
				userInformation:result.userInformation, 
				userID:userID, 
				isAdmin:isAdmin,
				name:req.cookies.name
			});
	});
});
router.get('/edit', function(req, res, next) {
	const userID = req.cookies.id;
	const isAdmin = (req.cookies.id == 1);
	userManager.getInfomation(connection, userID, function(result) {
		console.log('result.userInformation=');
		console.log(result.userInformation);
		res.render(
			'user/edit', 
			{
				userInformation:result.userInformation,
				userID:userID, 
				isAdmin:isAdmin,
				name:req.cookies.name
			});
	});
});
router.post('/edit', function(req, res, next) {
	const userID = req.cookies.id;
	const isAdmin = (req.cookies.id == 1);
	const userInfo = {
		address:req.body.address,
	}
	userManager.editInformation(connection, userID, userInfo, function(result) {
		res.redirect('/users/information');
	});
});
router.get('/logout', function(req, res, next) {
	res.clearCookie('id');
	res.clearCookie('name');
	res.redirect('../');
});
router.get('/chosen-products', function(req, res, next) {
	const userID = req.cookies.id;
	if (!req.cookies.productIDList) {
		res.render('user/chosen-products', {productList:[], userID:userID, name:req.cookies.name});
	} else {
		// var productIDList = [];
		// for (var i of Object.keys(req.body)) {
		// 	productIDList.push(parseInt(i.slice(12)));		
		// }
		// res.cookie('productIDList', productIDList.join('-'));
		// res.cookie('productAmountList', productIDList.map(p => 1).join('-'));

		var productIDList = req.cookies.productIDList.split('-'),	
			productAmountList = req.cookies.productAmountList.split('-'),		
			left = productIDList.length,
			productList = [];
		for (let productID of productIDList) {
			productManager.detail(connection, productID, 'id, name, price', function(results) {
				if (results.code != 0) {
					next();
				} else {
					--left;
					productList.push(results.product);
					if (left <= 0) {
						res.render(
							'user/chosen-products', 
							{
								productList:productList, 
								productAmountList:productAmountList, 
								userID:userID,
								name:req.cookies.name
							});
					}
				}
			})
		}
	}
});
module.exports = router;