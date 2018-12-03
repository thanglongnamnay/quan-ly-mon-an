const express = require('express');
const router = express.Router();
const productManager = require('../models/product');
const userManager = require('../models/user');
const connection = require('../models/databaseConnection');
router.get('/', function(req, res, next) {
	productManager.getList(connection, function(productList) {
		var isAdmin = false,
			userID = 0;
		const ren = () => {
			res.render(
				'index', 
				{
					productList: productList, 
					userID:userID, 
					isAdmin:isAdmin, 
					name:req.cookies.name
				});
		}
		if (req.cookies.id) {
			userID = req.cookies.id;
			let left = 2;
			userManager.getAccount(connection, userID, function(result) {
				console.log('isAdmin = ', !!result.account.isAdmin)
				isAdmin = !!result.account.isAdmin;
				if (--left == 0) ren();
			});
			userManager.getInfomation(connection, userID, function(result) {
				userInfo = result.userInformation;
				if (--left == 0) ren();
			});
		} else {
			ren();
		}
	});
});

module.exports = router;
