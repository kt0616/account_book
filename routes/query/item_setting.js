var conn = require("./connection.js");

exports.getItemSettingList = function(user_id, callbackFunc){
  if(!user_id) return null;
  var sql = "SELECT ITEM_SETTING_ID, NAME, IN_OUT_TYPE FROM ITEM_SETTING WHERE PERSON_ID = " + user_id + " AND DEL_FLG = 0 AND ITEM_SETTING_ID > 0 ORDER BY IN_OUT_TYPE, VIEW_ORDER";
  console.log("SQL:getItemSettingList  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      console.log("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc(result);
  });
}

exports.getItemSettingByItemId = function(user_id, item_id, callbackFunc){
  if(!(user_id && item_id)) return null;
  var sql = "SELECT ITEM_SETTING_ID, NAME, IN_OUT_TYPE FROM ITEM_SETTING WHERE PERSON_ID = " + user_id + " AND DEL_FLG = 0 AND ITEM_SETTING_ID = " + item_id;
  console.log("SQL:getItemSettingByItemId  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      console.log("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc(result);
  });
}

exports.insertItemSetting = function(item, callbackFunc){
  var sql = "INSERT INTO ITEM_SETTING (ITEM_SETTING_ID, PERSON_ID, NAME, IN_OUT_TYPE, VIEW_ORDER) VALUES((SELECT coalesce(MAX_CODE + 1, 1) FROM (SELECT MAX(ITEM_SETTING_ID) MAX_CODE FROM ITEM_SETTING WHERE PERSON_ID = "+item.user_id+") T1), "+item.user_id+", '"+item.name+"', "+item.in_out_type+", (SELECT coalesce(MAX_CODE + 1, 1) FROM (SELECT MAX(VIEW_ORDER) MAX_CODE FROM ITEM_SETTING WHERE PERSON_ID = "+item.user_id+")　T2))";
  console.log("SQL:insertItemSetting  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      console.log("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc();
  });
}

exports.updateItemSetting = function(item, callbackFunc){
  var sql = "UPDATE ITEM_SETTING SET NAME = '"+item.name+"', IN_OUT_TYPE = "+item.in_out_type+" WHERE ITEM_SETTING_ID = "+item.item_id+" AND PERSON_ID = "+item.user_id;
  console.log("SQL:updateItemSetting  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      console.log("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc();
  });
}

exports.deleteItemSetting = function(user_id, item_id, callbackFunc){
  var sql = "UPDATE ITEM_SETTING SET DEL_FLG = 1 WHERE PERSON_ID = "+user_id+" AND ITEM_SETTING_ID = "+item_id;
  console.log("SQL:deleteItemSetting  "+sql);
  conn.getConnection().query(sql, function(err, result) {
    if (err){
      console.log("SQL ERROR:"+err);
      return null;
    }
    result = conn.getSelectReturnValue(result);
    if(callbackFunc && typeof callbackFunc == "function") callbackFunc();
  });
}
