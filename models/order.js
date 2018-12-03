const statusList = ['Đang chờ', 'Đang làm', 'Đã xong'];
const orderManager = {
	add:function(connection, userID, userName, productIDList, amountOfProductList, totalPrice, callback) {
		const order = {
			userID:userID,
			name:userName,
			time:new Date(),
			productIDList:listToListStr(productIDList),
			amountOfProductList:listToListStr(amountOfProductList),
			total:totalPrice
		}
		connection.query(
			'INSERT INTO orders SET ?',
			[order],
			function(err, results, fields) {
				if (err) {
					callback({code:-1, message:err});
				} else {
					callback({code:0, message:'Ngon'});
				}
			});
	},
	edit:function(connection, order, callback) {
		if (order.productIDList != undefined)
			order.productIDList = listToListStr(order.productIDList);
		if (order.amountOfProductList != undefined)
			order.amountOfProductList = listToListStr(order.amountOfProductList);
		console.log('edit: order = ' , order);
		connection.query(
			'UPDATE orders SET ? WHERE id = ?',
			[order, order.id],
			function(error, result, field) {
				if (error) {
					console.log('err in order.edit. ', error)
					callback({code:-1});
				} else {
					callback({code:0});
				}
			});
	},
	getDetail:function(connection, orderID, callback) {
		connection.query(
			'SELECT * FROM orders WHERE id = ?',
			[orderID],
			function(error, result, fields) {
				console.log('detail=', result);
				if (error || result.length <= 0 || !result) {
					callback({code:-1});
				} else {
					result[0].productIDList = listStrToList(result[0].productIDList);
					result[0].amountOfProductList = listStrToList(result[0].amountOfProductList);
					callback({code:0, order:result[0]});
				}
			});
	},
	getList:function(connection, year, month, date, callback) {
		const time = `${year}-${month}-${date}`,
			time0 = time + ' 00:00:00',
			time24 = time + ' 23:59:59';
		connection.query(
			`SELECT * FROM orders WHERE time BETWEEN "${time0}" AND "${time24}"`,
			function(err, results, fields) {
				if (err) {
					console.log('error order.getlist');
					console.log(err);
					callback({code:-1})
				} else {
					for (let r of results) {
						r.productIDList = listStrToList(r.productIDList);
						r.amountOfProductList = listStrToList(r.amountOfProductList);
					}
					callback({code:0, resultList:results});
				}
			});
	},
	getStatus:function(connection, orderID, callback) {
		connection.query(
			'SELECT status FROM orders WHERE id = ?',
			[orderID],
			function(error, result, fields) {
				if (error) {
					callback({code:-1});
				} else {
					console.log('res0 =', result[0]);
					callback({code:0, order:result[0]});
				}
			});
	},
	nextStatus:function(connection, orderID, callback) {
		that = this;
		that.getStatus(connection, orderID, function(result) {
			if (result.code == 0) {
				if (result.order.status != 'Đã xong') {
					switch (result.order.status) {
						case "Đang chờ":
							result.order.status = "Đang làm";
							break;
						case "Đang làm":
							result.order.status = "Đã xong";
							break;
						}
					result.order.id = orderID;
					that.edit(connection, result.order, function(results) {
						console.log('end nextstatus');
						callback({code:0, status:result.order.status});
					});
				} else {
					callback({code:-1, status:'Đã xong'});
				}
			}
		});
	}
}
listStrToList = function(listStr) {
	return listStr.split(',');
}
listToListStr = function(list) {
	return list.join(',');
}
module.exports = orderManager;