var conn = require("./connection.js");
var logger = require("../logger.js");

exports.getZandakaList = function(user_id, callbackFunc){
  if(!user_id) return null;
  var sql = 'SELECT BANK_ID, BANK_NAME, ZANDAKA FROM ZANDAKA WHERE PERSON_ID = ' + user_id + ' AND DEL_FLG = 0 ORDER BY VIEW_ORDER';
  logger.loggerRequestFunc('SQL:getUserNameByUserId  '+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      logger.loggerRequestFunc('SQL ERROR:'+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == 'function') callbackFunc(result);
  });
}

exports.getZandaka = function(user_id, bank_id, callbackFunc){
  if(!user_id) return null;
  var sql = 'SELECT BANK_NAME, ZANDAKA FROM ZANDAKA WHERE PERSON_ID = ' + user_id + ' AND BANK_ID = ' + bank_id;
  logger.loggerRequestFunc('SQL:getUserNameByUserId  '+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      logger.loggerRequestFunc('SQL ERROR:'+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == 'function' && result.length > 0) callbackFunc(result[0]);
  });
}
