const userManager = {
  register:function(connection, name, address, username, password, callback) {
    // console.log("req:",req);
    var account={
      "id":null,
      "username":username,
      "password":password,
      "isAdmin":0,
    };
    connection.query(
      'INSERT INTO account SET ?',
      account, 
      function (error, results, fields) {
        if (error) {
          callback({code: -1, message: 'Tên tài khoản đã tồn tại'});
        } else {
          connection.query(
            'SELECT id FROM account WHERE username = ?', 
            [username],
            function(error, results, fields) {
              var accountInfo = {
                "id":results[0].id,
                "name":name,
                "address":address,
              }
              connection.query(
                'INSERT INTO accountinfo SET ?',
                accountInfo,
                function (error, results, fields) {
                  callback({code: accountInfo.id, message: 'Thành công'});
                });
            });
        }
    });
  },
  login:function(connection, username, password, callback){
    connection.query(
      'SELECT * FROM account WHERE username = ?',
      [username], 
      function (error, results, fields) {
        if (error || results.length <= 0 || results[0].password !== password) {
          console.log('error user.login: ');
          console.log(error);
          callback({code:-1, message:"Sai tên đăng nhập hoặc mật khẩu"});
        } else {
          callback({code:results[0].id, message:"Success", isAdmin:results[0].isAdmin});
        }
      });
  },
  getAccount:function(connection, userID, callback) {
    connection.query(
      'Select * FROM account WHERE id = ?',
      [userID],
      function(error, results, fields) {
        if (error || results.length <= 0) {
          callback({code:-1, message:"Có lỗi"});
        } else {
          callback({code:0, account:results[0]});
        }
      });
  },
  setPassword:function(connection, userID, newPassword, callback) {
    const acc = {
      password:newPassword
    }
    connection.query(
      'UPDATE account SET ? WHERE id = ? ',
      [acc, userID],
      function(error, results, fields) {
        if (error) {
          callback({code:-1, message:"Lỗi"});
        } else {
          callback({code:0, message:"Ngon"});
        }
      });
  },
  getInfomation:function(connection, userID, callback) {
    connection.query(
      'SELECT * FROM accountinfo WHERE id = ?',
      [userID], 
      function (error, results, fields) {
        if (error || results.length <= 0) {
          console.log('error user.getInfo: ');
          console.log(userID);
          console.log(results);
          callback({code:-1, message:"Lỗi"});
        } else {
          callback({code:0, userInformation:results[0]});
        }
      });
  },
  editInformation:function(connection, userID, userInformation, callback) {
    connection.query(
      'UPDATE accountinfo SET ? WHERE id = ?',
      [userInformation, userID], 
      function (error, results, fields) {
        if (error || results.length <= 0) {
          console.log('error user.getInfo: ');
          console.log(userID);
          console.log(results);
          callback({code:-1, message:"Lỗi"});
        } else {
          callback({code:0});
        }
      });
  }
}
module.exports = userManager;