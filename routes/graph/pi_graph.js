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
    //銀行別データの取得
    var _callbackFunc = function(results_out_bank){
      //タイプ別支出
      var __callbackFunc = function(results_out_type){
        //タイプ別収入
        var ___callbackFunc = function(results_in_type){
          var data_out_bank = makeData('銀行名', '金額', results_out_bank);
          var data_out_type = makeData('項目名', '金額', results_out_type);
          var data_in_type = makeData('項目名', '金額', results_in_type);
          var contain = ejs.render(index_ejs, {
            title: '家計簿アプリ',
            user_id: user_id,
            user_name: user_name,
            main_body: ejs.render(graph_ejs,{
                  data: [{
                    graph_type: 'pi',
                    funcName: 'out_graph',
                    graph_id: 'out_graph',
                    graph_title: '銀行別支出',
                    graph_data: data_out_bank
                  },{
                    graph_type: 'pi',
                    funcName: 'type_out',
                    graph_id: 'type_out',
                    graph_title: 'タイプ別収入',
                    graph_data: data_in_type
                  },{
                    graph_type: 'pi',
                    funcName: 'type_in',
                    graph_id: 'type_in',
                    graph_title: 'タイプ別支出',
                    graph_data: data_out_type
                  }]
                })
            });
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(contain);
          res.end();
        }
        dataSQL.getInOutGraphDataByItemType(user_id, 1, ___callbackFunc);
      }
      dataSQL.getInOutGraphDataByItemType(user_id, 0, __callbackFunc);
    }
    dataSQL.getOutputGraphDataByBank(user_id, _callbackFunc);
  }
  personSQL.getUserNameByUserId(user_id, callbackFunc);
}

function makeData(col1, col2,results){
  var data = '[["'+col1+'", "'+col2+'"]';
  results.forEach(function(result){
    data += ',["'+result.name+'", '+result.value+']';
  });
  data += ']'
  return data;
}

module.exports = router;
