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
      if(result.insertId){
        if(callbackFunc && typeof callbackFunc == 'function') callbackFunc(result.insertId);
        createItemSettingInitialize(result.insertId);
      }else{
        var _sql = 'select last_value from person_person_id_seq';
        console.log('insertPerson:'+_sql);
        conn.getConnection().query(_sql, function(err, _result){
          if (err){
            console.log('SQL ERROR:'+err);
            return;
          }
          _result = conn.getSelectReturnValue(_result);
          if(callbackFunc && typeof callbackFunc == 'function') callbackFunc(_result[0].last_value);
          createItemSettingInitialize(_result[0].last_value);
        })
      }

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

function createItemSettingInitialize(user_id){
  var sql1 = "INSERT INTO ITEM_SETTING (ITEM_SETTING_ID, PERSON_ID, IN_OUT_TYPE, VIEW_ORDER, NAME) VALUES(-99,"+user_id+",0,1,'不明金')";
  var sql2 = "INSERT INTO ITEM_SETTING (ITEM_SETTING_ID, PERSON_ID, IN_OUT_TYPE, VIEW_ORDER, NAME) VALUES(-98,"+user_id+",1,1,'不明金')";
  var sql3 = "INSERT INTO ITEM_SETTING (ITEM_SETTING_ID, PERSON_ID, IN_OUT_TYPE, VIEW_ORDER, NAME) VALUES(-97,"+user_id+",0,1,'振替')";
  var sql4 = "INSERT INTO ITEM_SETTING (ITEM_SETTING_ID, PERSON_ID, IN_OUT_TYPE, VIEW_ORDER, NAME) VALUES(-96,"+user_id+",1,1,'振替')";
  var sql5 = "INSERT INTO ITEM_SETTING (ITEM_SETTING_ID, PERSON_ID, IN_OUT_TYPE, VIEW_ORDER, NAME) VALUES(-95,"+user_id+",0,1,'初期設定金額')";
  var sql6 = "INSERT INTO ITEM_SETTING (ITEM_SETTING_ID, PERSON_ID, IN_OUT_TYPE, VIEW_ORDER, NAME) VALUES(-94,"+user_id+",1,1,'初期設定金額')";
  console.log("createItemSettingInitialize:"+sql1);
  console.log("createItemSettingInitialize:"+sql2);
  console.log("createItemSettingInitialize:"+sql3);
  console.log("createItemSettingInitialize:"+sql4);
  console.log("createItemSettingInitialize:"+sql5);
  console.log("createItemSettingInitialize:"+sql6);
  conn.getConnection().query(sql1, function(err, result) {
    if (err){
      console.log('SQL ERROR:'+err);
      return null;
    }
  })
  conn.getConnection().query(sql2, function(err, result) {
    if (err){
      console.log('SQL ERROR:'+err);
      return null;
    }
  })
  conn.getConnection().query(sql3, function(err, result) {
    if (err){
      console.log('SQL ERROR:'+err);
      return null;
    }
  })
  conn.getConnection().query(sql4, function(err, result) {
    if (err){
      console.log('SQL ERROR:'+err);
      return null;
    }
  })
  conn.getConnection().query(sql5, function(err, result) {
    if (err){
      console.log('SQL ERROR:'+err);
      return null;
    }
  })
  conn.getConnection().query(sql6, function(err, result) {
    if (err){
      console.log('SQL ERROR:'+err);
      return null;
    }
  })
}
