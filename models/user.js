const userManager = {
  register:function(connection, name, address, username, password, rePassword, callback) {
    // console.log("req:",req);
    if (password != rePassword) {
      callback({code: 204, message: 'Mật khẩu không trùng khớp'});
    } else {
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
    }
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
          callback({code:results[0].id, userInformation:results[0]});
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