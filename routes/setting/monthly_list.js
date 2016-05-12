var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var personSQL = require('../query/person.js');
var monthlySQL = require('../query/monthly.js');
var func = require('../function.js');
var router = express.Router();

var index_ejs = fs.readFileSync('./views/index.ejs', 'UTF-8');
var payment_list_ejs = fs.readFileSync('./views/payment_list.ejs', 'UTF-8');

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
    var _callbackFunc = function(results){
      var datas = [];
      results.forEach(function(result){
        var temp = {
            id: result.monthly_id,
            date: result.day + '日',
            bank: result.bank_name + ' - ' + result.item_name,
            item_type: result.monthly_name,
            price: func.separateNum(result.price)
          }
          datas.push(temp);
      });
      var contain = ejs.render(index_ejs, {
        title: '家計簿アプリ',
        user_id: user_id,
        user_name: user_name,
        main_body: ejs.render(payment_list_ejs, {
          user_id: user_id,
          func: 'monthly',
          err: '',
          datas: datas
        })
      });
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(contain);
      res.end();
    }
    monthlySQL.selectMonthlyList(user_id, _callbackFunc);
  }
  personSQL.getUserNameByUserId(user_id, callbackFunc);
}

module.exports = router;
