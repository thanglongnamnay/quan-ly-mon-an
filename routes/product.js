const express = require('express');
const router = express.Router();
const productManager = require('../models/product');
const connection = require('../models/databaseConnection');

router.get('/', function(req, res, next) {
	res.redirect('..');
});
router.get('/add', function(req, res, next) {
	userID = req.cookies.id || 0;
	res.render('product/add', {userID:userID, name:req.cookies.name});
});
router.post('/add', function(req, res, next) {
	if (req.body.name == '' || 
		req.body.price == '' || 
		req.body.ingredient == '' || 
		req.body.recipe == '') {
		userID = req.cookies.id || 0;
		res.render(
			'product/add', 
			{
				userID:userID, 
				name:req.cookies.name, 
				error:'Chưa nhập đủ, nhập lại đi'
			});
	} else {
		const product = {
			id:null,
			name:req.body.name,
			price:req.body.price,
			ingredient:req.body.ingredient,
			recipe:req.body.recipe,
			description:req.body.description,
		};
		productManager.add(
			connection, 
			product.name, 
			product.ingredient, 
			product.recipe, 
			product.price, 
			product.description, 
			function(result) {
				if (result.code != 0) {
					userID = req.cookies.id || 0;
					res.render(
						'product/add', 
						{
							error:result.message, 
							product:product, 
							userID:userID,
							name:req.cookies.name
						});
				} else {
					res.redirect('/');
				}
			});
	}
})
router.get('/:productID', function(req, res, next) {
	var isAdmin = false;
	var userID = 0;
	if (req.cookies) {
		userID = req.cookies.id;
		if (userID === 1) {
			isAdmin = true;
		}
	}
	productManager.detail(connection, req.params.productID, '*', function(result) {
		if (result.code !== 0) {
			res.send(result.message);
		} else {
			userID = req.cookies.id || 0;
			res.render(
				'product/detail', 
				{
					product:result.product, 
					userID:userID, 
					isAdmin:isAdmin,
					name:req.cookies.name
				});
		}
	});
});
router.get('/edit/:productID', function(req, res, next) {
	productManager.detail(connection, req.params.productID, '*', function(results) {
		if (results.code !== 0) {
			next();
		} else {
			userID = req.cookies.id || 0;
			res.render('product/edit', {product:results.product, userID:userID, name:req.cookies.name});
		}
	});
});
router.post('/edit/:productID', function(req, res, next) {
	const 
		price = req.body.price,
		ingredient = req.body.ingredient,
		recipe = req.body.recipe,
		description = req.body.description;
	productManager.edit(
			connection, 
			req.params.productID,
			ingredient, 
			recipe, 
			price, 
			description,
			function(results) {
				if (results.code != 0) {
					next();
				} else {
					res.redirect('/product/' + req.params.productID);
				}
			});
});
router.get('/delete/:productID', function(req, res, next) {
	productManager.delete(connection, req.params.productID, function(results) {
		res.redirect('/');
	});
});
module.exports = router;