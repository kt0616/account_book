var conn = require("./connection.js");
var logger = require("../logger.js");

exports.selectPaymentList = function(user_id, callbackFunc){
  var sql = "SELECT PAYMENT_ID, PRICE, BANK_NAME, ITEM_SETTING.NAME ITEM_TYPE, DAY FROM PAYMENT INNER JOIN BANK ON (PAYMENT.BANK_ID = BANK.BANK_ID AND PAYMENT.PERSON_ID = BANK.PERSON_ID) INNER JOIN ITEM_SETTING ON (PAYMENT.ITEM_ID = ITEM_SETTING.ITEM_SETTING_ID AND PAYMENT.PERSON_ID = ITEM_SETTING.PERSON_ID) WHERE PAYMENT.DEL_FLG = 0 AND PAYMENT.PERSON_ID = "+ user_id + ' ORDER BY DAY DESC';
  logger.loggerRequestFunc("SQL:selectPaymentList  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      logger.loggerRequestFunc("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc(result);
  });
}

exports.selectPaymentById = function(user_id, payment_id, callbackFunc){
  var sql = 'SELECT PAYMENT_ID, PRICE, BANK_ID , ITEM_ID FROM PAYMENT WHERE DEL_FLG = 0 AND PERSON_ID = '+user_id+' AND PAYMENT_ID = '+payment_id;
  logger.loggerRequestFunc("SQL:selectPaymentList  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      logger.loggerRequestFunc("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc(result[0]);
  });
}


exports.insertPayment = function(item, callbackFunc){
  var sql = "INSERT INTO PAYMENT (PAYMENT_ID, PERSON_ID, BANK_ID, ITEM_ID, PRICE) VALUES((SELECT coalesce(MAX_CODE + 1, 1) FROM (SELECT MAX(PAYMENT_ID) MAX_CODE FROM PAYMENT WHERE PERSON_ID = "+item.user_id+") T1), "+item.user_id+", "+item.bank_id+", "+item.item_id+", "+item.price+")";
  logger.loggerRequestFunc("SQL:insertPayment  "+sql);
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

exports.updatePayment = function(item, callbackFunc){
  var sql = "UPDATE PAYMENT SET BANK_ID = "+item.bank_id+", ITEM_ID = "+item.item_id + ", PRICE = " + item.price + " WHERE PERSON_ID = " + item.user_id + " AND PAYMENT_ID = " + item.payment_id;
  logger.loggerRequestFunc("SQL:updatePayment  "+sql);
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

exports.deletePayment = function(item, callbackFunc){
  var sql = "UPDATE PAYMENT SET DEL_FLG = 1 WHERE PERSON_ID = " + item.user_id + " AND PAYMENT_ID = " + item.payment_id;
  logger.loggerRequestFunc("SQL:deletePayment  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      logger.loggerRequestFunc("SQL ERROR:"+err);
      return null;
    }
    logger.loggerDML(sql);

    if(callbackFunc && typeof callbackFunc == "function") callbackFunc();
  });
}

exports.transferPayment = function(item, callbackFunc){
  var from_flg = false;
  var to_flg = false;
  var sql_from = "INSERT INTO PAYMENT (PAYMENT_ID, PERSON_ID, BANK_ID, ITEM_ID, PRICE) VALUES((SELECT coalesce(MAX_CODE + 1, 1) FROM (SELECT MAX(PAYMENT_ID) MAX_CODE FROM PAYMENT WHERE PERSON_ID = "+item.user_id+") T1), "+item.user_id+", "+item.from_bank_id+", -96, "+item.price*(-1)+")";
  var sql_to = "INSERT INTO PAYMENT (PAYMENT_ID, PERSON_ID, BANK_ID, ITEM_ID, PRICE) VALUES((SELECT coalesce(MAX_CODE + 1, 1) FROM (SELECT MAX(PAYMENT_ID) MAX_CODE FROM PAYMENT WHERE PERSON_ID = "+item.user_id+") T1), "+item.user_id+", "+item.to_bank_id+", -97, "+item.price+")";
  logger.loggerRequestFunc("SQL:transferPayment  "+sql_from);
  logger.loggerRequestFunc("SQL:transferPayment  "+sql_to);
  conn.getConnection().query(sql_from, function(err, result) {
    if (err){
      logger.loggerRequestFunc("SQL ERROR:"+err);
      return null;
    }
    logger.loggerDML(sql_from);
    from_flg = true;
  });
  conn.getConnection().query(sql_to, function(err, result) {
    if (err){
      logger.loggerRequestFunc("SQL ERROR:"+err);
      return null;
    }
    logger.loggerDML(sql_to);
    to_flg = true;
  });

  var _callbackFunc = function(){
    if(from_flg && to_flg){
      if(callbackFunc && typeof callbackFunc == 'function') callbackFunc();
    }else{
      setTimeout(_callbackFunc, 100);
    }
  }
  _callbackFunc();
}
