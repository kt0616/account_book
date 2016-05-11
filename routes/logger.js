var log4js = require('log4js');
var fs = require('fs');

// 設定
log4js.configure({
    appenders: [

        // SQLリクエストログ用設定
        {
            "type": "file",
            "category": "request",
            "filename": "./log/request.log",
            "pattern": "-yyyy-MM-dd"
        },

        // ユーザーアクションログ用
        {
            "type": "file",
            "category": "action",
            "filename": "./log/action.log",
            "pattern": "-yyyy-MM-dd"
        },
    ]
});

// リクエストログ
var loggerRequest = log4js.getLogger('request');
exports.loggerRequestFunc = function(logStr){
  loggerRequest.info(logStr);
}

// アクションログ
var loggerAction = log4js.getLogger('action');
exports.loggerActionFunc = function(logStr){
  loggerAction.info(logStr);
}

//データ更新用のSQLまとめログ
exports.loggerDML = function(logSQL){
  fs.appendFile('./log/dml.sql', logSQL + ";\n" ,'utf8', function (err) {
    console.log(err);
  });
}
