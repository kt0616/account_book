var property = require("./resource.json");
var dbTypeName = property.DBtype;
var dbType = require(dbTypeName);
var connection;
switch (dbTypeName) {
  case "mysql":
    connection = dbType.createConnection({
      host     : property.host,
      user     : property.user,
      password : property.password,
      database : property.database
    });

    //コネクションエラー
    connection.connect(function(err) {
      if (err) {
        console.error("error　DB connecting: " + err.stack);
        return;
      }
      console.log("connected as id " + connection.threadId);
    });
    break;
  case "pg":
    // var conString = "tcp://"+property.user+":"+property.password+"@"+property.host+":"+property.port+"/"+property.database;
    var conString = "postgres://sjzcxqektjbxwm:-gnC3mbH8Hjn4cKv2ot2IATdiD@ec2-50-19-209-46.compute-1.amazonaws.com:5432/d39l9uultmtm81";
    client = new dbType.Client(conString);
    client.connect(function(err){
      if (err) {
        console.error("error　DB connecting: " + err.stack);
        return;
      }
      connection = client;
    })
    break;
  default:
    console.log("DB接続できません。DBTypeを確認してください。");
}


exports.getConnection = function(){
  return connection;
}
exports.getSelectReturnValue = function(results){
  switch (dbTypeName) {
    case "mysql":
      return results;
    case "pg":
      return results.rows;
    default:

  }
}
exports.getDateFormatYearAndMonth = function(){
  switch (dbTypeName) {
    case "mysql":
      return "DATE_FORMAT(DAY, '%Y/%m')";
    case "pg":
     return "TO_CHAR(DAY, 'YYYY/MM')";;
    default:

  }
}
