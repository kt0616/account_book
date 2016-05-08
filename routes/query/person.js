var conn = require("./connection.js");

exports.getUserNameByUserId = function(user_id, callbackFunc){
  if(!user_id) return null;
  var sql = 'SELECT NAME FROM PERSON WHERE PERSON_ID = ' + user_id;
  console.log('SQL:getUserNameByUserId  '+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      console.log('SQL ERROR:'+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == 'function') callbackFunc(result[0].name);
  });
}

exports.getLoginUser = function(user_id, password, callbackFunc){
  if(!(user_id && password)) return null;
  var sql = "SELECT PERSON_ID FROM PERSON WHERE USER_ID = '" + user_id + "' AND PASSWORD = '" + password + "'";
  console.log('SQL:getLoginUser  '+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      console.log('SQL ERROR:'+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == 'function') callbackFunc(result);
  });
}

exports.insertPerson = function(person, callbackFunc){
  var sql_err_check = "SELECT * FROM PERSON WHERE USER_ID = '"+person.user_id+"'";
  console.log('insertPerson '+sql_err_check);
  conn.getConnection().query(sql_err_check, function(err, result_check) {
    if (err){
      console.log('SQL ERROR:'+err);
      return null;
    }
    result_check = conn.getSelectReturnValue(result_check);
    if(result_check.length > 0) {
      if(callbackFunc && typeof callbackFunc == 'function') callbackFunc();
      return null;
    }
    var sql = "INSERT INTO PERSON (NAME, USER_ID, PASSWORD) VALUES ('"+person.user_name+"','"+person.user_id+"','"+person.password+"')";
    console.log('insertPerson '+sql);
    conn.getConnection().query(sql, function(err, result) {
      if (err){
        console.log('SQL ERROR:'+err);
        return;
      }
      result = conn.getSelectReturnValue(result);
      if(callbackFunc && typeof callbackFunc == 'function') callbackFunc(result.insertId);
    });
  });
}

exports.ajax_user_id_check = function(user_id, callbackFunc){
  var sql = "SELECT * FROM PERSON WHERE USER_ID = '"+user_id+"'";
  console.log('ajax_user_id_check '+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      console.log('SQL ERROR:'+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == 'function') callbackFunc(result);
  });
}
