var conn = require("./connection.js");
var paymentSQL = require('./payment.js');
var logger = require("../logger.js");

eventMonthlyFunc = function(){
  logger.loggerRequestFunc('-------Rule Engin-------');
  var today = new Date();
  var day = today.getDate();
  var sql = "SELECT PERSON_ID, BANK_ID, ITEM_ID, PRICE FROM MONTHLY WHERE DEL_FLG = 0 AND DAY = "+day;
  logger.loggerRequestFunc("SQL:eventMonthlyFunc  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      logger.loggerRequestFunc("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    result.forEach(function(_result){
      var item = {
        user_id: _result.PERSON_ID,
        bank_id: _result.BANK_ID,
        item_id: _result.ITEM_ID,
    price: _result.PRICE
      };
      paymentSQL.insertPayment(item);
    });
  });
}

exports.selectMonthlyList = function(user_id, callbackFunc){
  var sql = "SELECT MONTHLY_ID, MONTHLY.NAME MONTHLY_NAME, BANK_NAME, ITEM_SETTING.NAME ITEM_NAME, PRICE, DAY FROM MONTHLY INNER JOIN BANK ON (MONTHLY.BANK_ID = BANK.BANK_ID AND MONTHLY.PERSON_ID = BANK.PERSON_ID) INNER JOIN ITEM_SETTING ON (MONTHLY.ITEM_ID = ITEM_SETTING_ID AND MONTHLY.PERSON_ID = ITEM_SETTING.PERSON_ID) WHERE MONTHLY.DEL_FLG = 0 AND MONTHLY.PERSON_ID = "+user_id;
  logger.loggerRequestFunc("SQL:selectMonthlyList  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      logger.loggerRequestFunc("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc(result);
  });
}

exports.selectMonthlyById = function(user_id, monthly_id, callbackFunc){
  var sql = "SELECT NAME, BANK_ID, ITEM_ID, PRICE, DAY FROM MONTHLY WHERE DEL_FLG = 0 AND PERSON_ID = "+user_id + " AND MONTHLY_ID = " + monthly_id;
  logger.loggerRequestFunc("SQL:selectMonthlyById  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      logger.loggerRequestFunc("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc(result[0]);
  });
}

exports.insertMonthly = function(monthly, callbackFunc){
  var sql = "INSERT INTO MONTHLY (MONTHLY_ID, PERSON_ID, NAME, BANK_ID, ITEM_ID, PRICE, DAY) VALUES ((SELECT coalesce(MAX_CODE + 1, 1) FROM (SELECT MAX(MONTHLY_ID) MAX_CODE FROM MONTHLY WHERE PERSON_ID = "+monthly.user_id+") T1), "+monthly.user_id+", '"+monthly.name+"', "+monthly.bank_id+", "+monthly.item_id+", "+monthly.price+", "+monthly.monthly_day+")";
  logger.loggerRequestFunc("SQL:insertMonthly  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      logger.loggerRequestFunc("SQL ERROR:"+err);
      return null;
    }
    logger.loggerDML(sql);
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc();
  });
}

exports.updateMonthly = function(monthly, callbackFunc){
  var sql = "UPDATE MONTHLY SET NAME = '"+monthly.name+"', BANK_ID = "+monthly.bank_id+", ITEM_ID = "+monthly.item_id+", PRICE = "+monthly.price+", DAY = "+monthly.monthly_day+" WHERE PERSON_ID = "+monthly.user_id+" AND MONTHLY_ID = "+monthly.id;
  logger.loggerRequestFunc("SQL:updateMonthly  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      logger.loggerRequestFunc("SQL ERROR:"+err);
      return null;
    }
    logger.loggerDML(sql);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc();
  });
}

exports.deleteMonthly = function(monthly, callbackFunc){
  var sql = "UPDATE MONTHLY SET DEL_FLG = 1 WHERE PERSON_ID = "+monthly.user_id+" AND MONTHLY_ID = "+monthly.id;
  logger.loggerRequestFunc("SQL:deleteMonthly  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      logger.loggerRequestFunc("SQL ERROR:"+err);
      return null;
    }
    logger.loggerDML(sql);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc();
  });
}

exports.startEngin = function(){
  var today = new Date();
  var setting_h = 24;
  var setting_m = 0;
  var setting_s = 0;
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  var diff = ((setting_s + (setting_m + setting_h*60)*60)*1000) - ((s + (m + h*60)*60)*1000);
  var _func = function(){
    eventMonthlyFunc();
    var timer = setInterval( function(){ eventMonthlyFunc();}, 86400000 );
  }
  setTimeout(_func, diff);
}
