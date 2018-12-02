const express = require('express');
const router = express.Router();
const productManager = require('../models/product');
const userManager = require('../models/user');
const connection = require('../models/databaseConnection');
router.get('/', function(req, res, next) {
	productManager.getList(connection, function(productList) {
		var isAdmin = false;
		var userID = 0;
		if (req.cookies) {
			userID = req.cookies.id;
			if (userID == 1) {
				isAdmin = true;
			}
			userManager.getInfomation(connection, userID, function(result) {
				userInfo = result.userInformation;
				res.render(
					'index', 
					{
						productList: productList, 
						userID:userID, 
						isAdmin:isAdmin, 
						name:req.cookies.name
					});
			});
		}
	});
});

module.exports = router;
