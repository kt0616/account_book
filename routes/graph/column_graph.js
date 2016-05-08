var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var personSQL = require('../query/person.js');
var dataSQL = require('../query/data.js');
var router = express.Router();

var index_ejs = fs.readFileSync('./views/index.ejs', 'UTF-8');
var graph_ejs = fs.readFileSync('./views/graph.ejs', 'UTF-8');

/* GET home page. */
router.get('/', function(req, res, next) {
  var user_id = req.session.user_id;
  if (user_id) {
    printList(user_id, res);
  } else {
    res.redirect('/login');
  }
});

function printList(user_id, res){
  //ユーザー名の取得
  var callbackFunc = function(user_name){
    //支出クロスデータの取得
    var _callbackFunc = function(results_out){
      //収入クロスデータの取得
      var __callbackFunc = function(results_in){
      var crossDataOut = makeData(results_out);
      var crossDataIn = makeData(results_in);
      var contain = ejs.render(index_ejs, {
        title: '家計簿アプリ',
        user_id: user_id,
        user_name: user_name,
        main_body: ejs.render(graph_ejs,{
              data: [{
                graph_type: 'column',
                funcName: 'cross_graph_out',
                graph_id: 'cross_graph_out',
                graph_title: '月ごとの支出',
                graph_data: crossDataOut
              },{
                graph_type: 'column',
                funcName: 'cross_graph_in',
                graph_id: 'cross_graph_in',
                graph_title: '月ごとの収入',
                graph_data: crossDataIn
              }]
            })
        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(contain);
        res.end();
      }
      dataSQL.getCross(user_id, 1, __callbackFunc);
    }
    dataSQL.getCross(user_id, 0, _callbackFunc);
  }
  personSQL.getUserNameByUserId(user_id, callbackFunc);
}

function makeData(results){
  var data = '[';
  var firstFlg = true;
  results.forEach(function(result){
    if(!firstFlg){
      data += ',';
    }else{
      firstFlg = false;
      var firstRow = '[';
      var _firstFlg = true;
      for(key in result){
        if(!_firstFlg) firstRow += ', ';
        _firstFlg = false;
        firstRow += '"'+key+'"';
      }
      data += firstRow + '],'
    }
    data += '[';
    var __firstFlg = true;
    for(key in result){
      if(!__firstFlg) data += ',';
      __firstFlg = false;
      if(key == 'date'){
        data += '"' + result[key] + '"';
      }else{
        data += result[key];
      }
    }
    data += ']';
  });
  data += ']'
  return data;
}

module.exports = router;
