var conn = require("./connection.js");
var item_setting = require("./item_setting.js");
var logger = require("../logger.js");

//BANKごとの合計値
//SELECT BANK.BANK_NAME NAME, COALESCE(BANK_SUM.SUM_VALUE,0) VALUE FROM BANK LEFT JOIN (SELECT BANK.BANK_ID BANK_ID, SUM(PRICE)*-1 SUM_VALUE FROM BANK LEFT JOIN PAYMENT ON BANK.BANK_ID = PAYMENT.BANK_ID WHERE BANK.DEL_FLG = 0 AND PAYMENT.DEL_FLG = 0 AND BANK.PERSON_ID = 1 AND PAYMENT.PERSON_ID = 1 AND PAYMENT.PRICE < 0 GROUP BY BANK.BANK_ID) BANK_SUM ON BANK.BANK_ID = BANK_SUM.BANK_ID;
exports.getOutputGraphDataByBank = function(user_id, callbackFunc){
  if(!user_id) return null;
  var sql = "SELECT BANK.BANK_NAME AS NAME, COALESCE(BANK_SUM.SUM_VALUE,0) AS VALUE FROM BANK LEFT JOIN (SELECT BANK.BANK_ID AS BANK_ID, SUM(PRICE)*-1 AS SUM_VALUE, BANK.PERSON_ID FROM BANK LEFT JOIN PAYMENT ON BANK.BANK_ID = PAYMENT.BANK_ID WHERE BANK.DEL_FLG = 0 AND PAYMENT.DEL_FLG = 0 AND BANK.PERSON_ID = "+user_id+" AND PAYMENT.PERSON_ID = "+user_id+" AND PAYMENT.PRICE < 0 AND PAYMENT.ITEM_ID >= 0 GROUP BY BANK.BANK_ID, BANK.PERSON_ID) BANK_SUM ON (BANK.BANK_ID = BANK_SUM.BANK_ID AND BANK.PERSON_ID = BANK_SUM.PERSON_ID)";
  logger.loggerRequestFunc("SQL:getInputGraphDataByBank  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      logger.loggerRequestFunc("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc(result);
  });
}

//Typeごとの合計値
//SELECT ITEM_SETTING.NAME NAME, ABS(COALESCE(SUM(PRICE),0)) VALUE FROM ITEM_SETTING LEFT JOIN PAYMENT ON (ITEM_SETTING.ITEM_SETTING_ID = PAYMENT.ITEM_ID AND ITEM_SETTING.PERSON_ID = PAYMENT.PERSON_ID) WHERE ITEM_SETTING.IN_OUT_TYPE = 0 AND PAYMENT.PERSON_ID = 1 AND PAYMENT.DEL_FLG = 0 AND ITEM_SETTING.DEL_FLG = 0 GROUP BY PAYMENT.ITEM_ID;
exports.getInOutGraphDataByItemType = function(user_id, in_out_type, callbackFunc){
  if(!user_id) return null;
  var sql = "SELECT ITEM_SETTING.NAME AS NAME, ABS(COALESCE(SUM(PRICE),0)) AS VALUE FROM ITEM_SETTING LEFT JOIN PAYMENT ON (ITEM_SETTING.ITEM_SETTING_ID = PAYMENT.ITEM_ID AND ITEM_SETTING.PERSON_ID = PAYMENT.PERSON_ID) WHERE ITEM_SETTING.IN_OUT_TYPE = "+in_out_type+" AND PAYMENT.PERSON_ID = "+user_id+" AND PAYMENT.DEL_FLG = 0 AND ITEM_SETTING.DEL_FLG = 0 AND ITEM_SETTING.ITEM_SETTING_ID > 0 GROUP BY ITEM_SETTING.NAME;";
  logger.loggerRequestFunc("SQL:getInOutGraphDataByItemType  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      logger.loggerRequestFunc("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc(result);
  });
}

exports.getCross = function(user_id, in_out_type, callbackFunc){
  if(!user_id) return null;
  var _callbackFunc = function(results){
    var _results = [];
    results.forEach(function(result){
      if(result.in_out_type == in_out_type){
        _results.push(result);
      }
    });

    var sql = "SELECT "+conn.getDateFormatYearAndMonth()+" AS DATE";
    _results.forEach(function(_result){
      sql += ', SUM(CASE WHEN ITEM_ID = '+_result.item_setting_id+' THEN ABS(PRICE) ELSE 0 END) AS ' + _result.name;
    })
    sql += " FROM PAYMENT GROUP BY "+conn.getDateFormatYearAndMonth()+" ORDER BY "+conn.getDateFormatYearAndMonth()+" ASC;"

    logger.loggerRequestFunc("SQL:getCross  "+sql);
    conn.getConnection().query(sql, function(err, result) {
      if (err){
        logger.loggerRequestFunc("SQL ERROR:"+err);
        return null;
      }
      result = conn.getSelectReturnValue(result);
      if(callbackFunc && typeof callbackFunc == "function") callbackFunc(result);
    });
  }
  item_setting.getItemSettingList(user_id, _callbackFunc);
}
