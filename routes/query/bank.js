var conn = require("./connection.js");

exports.getBankList = function(user_id, callbackFunc){
  if(!user_id) return null;
  var sql = "SELECT BANK_ID, BANK_NAME FROM BANK WHERE DEL_FLG = 0 AND PERSON_ID = "+user_id+" ORDER BY VIEW_ORDER";
  console.log("SQL:getBankList  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      console.log("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc(result);
  });
}

exports.getBank = function(user_id, bank_id, callbackFunc){
  if(!user_id) return null;
  var sql = "SELECT BANK_ID, BANK_NAME FROM BANK WHERE DEL_FLG = 0 AND PERSON_ID = "+user_id+" AND BANK_ID = "+bank_id+" ORDER BY VIEW_ORDER";
  console.log("SQL:getBankList  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      console.log("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc(result[0]);
  });
}

exports.insertBank = function(item, callbackFunc){
  var sql = "INSERT INTO BANK (BANK_ID, PERSON_ID, BANK_NAME, VIEW_ORDER) VALUES((SELECT coalesce(MAX_CODE + 1, 1) FROM (SELECT MAX(BANK_ID) MAX_CODE FROM BANK WHERE PERSON_ID = "+item.user_id+") T1), "+item.user_id+", '"+item.name+"', (SELECT coalesce(MAX_CODE + 1, 1) FROM (SELECT MAX(VIEW_ORDER) MAX_CODE FROM BANK WHERE PERSON_ID = "+item.user_id+")　T2))";
  console.log("SQL:insertBank  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      console.log("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc();
  });
}

exports.updateBank = function(item, callbackFunc){
  var sql = "UPDATE BANK SET BANK_NAME = '" + item.name +"' WHERE BANK_ID = " + item.id + " AND PERSON_ID = "+ item.user_id;
  console.log("SQL:updateBank  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      console.log("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc();
  });
}

exports.deleteBank = function(item, callbackFunc){
  var sql = "UPDATE BANK SET DEL_FLG = 1 WHERE BANK_ID = " + item.id + " AND PERSON_ID = "+ item.user_id;
  console.log("SQL:deleteBank  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      console.log("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc();
  });
}
