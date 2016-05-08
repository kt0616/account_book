var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var personSQL = require('../query/person.js');
var bankSQL = require('../query/bank.js');
var itemSettingSQL = require('../query/item_setting.js');
var paymentSQL = require('../query/payment.js');
var router = express.Router();

var index_ejs = fs.readFileSync('./views/index.ejs', 'UTF-8');
var payment_transfer_ejs = fs.readFileSync('./views/payment_transfer.ejs', 'UTF-8');

/* GET home page. */
router.get('/', function(req, res, next) {
  var user_id = req.session.user_id;
  if (user_id) {
    printList(user_id, res);
  } else {
    res.redirect('/login');
  }
});

router.post('/', function(req, res, next) {
  var payment = {};
  payment.user_id = req.session.user_id;
  if (!payment.user_id) {
    res.redirect('/login');
  }
  payment.from_bank_id = req.body['from_bank_id'];
  payment.to_bank_id = req.body['to_bank_id'];
  payment.price = req.body['money'];
  var callbackFunc = function(){
    res.redirect('/payment/payment_list');
  }
  paymentSQL.transferPayment(payment, callbackFunc);
});

function printList(user_id, res){
  //ユーザー名の取得
  var callbackFunc = function(user_name){
    //銀行情報の取得
    var _callbackFunc = function(result_bank){
      var bank_info = new Array();
      var firstFlg = 1;
      result_bank.forEach(function(bank_item){
        var temp_bank = {
          active: firstFlg,
          bank_id: bank_item.bank_id,
          name: bank_item.bank_name
        }
        firstFlg = 0;
        bank_info.push(temp_bank);
      });

      var contain = ejs.render(index_ejs, {
        title: '家計簿アプリ',
        user_id: user_id,
        user_name: user_name,
        main_body: ejs.render(payment_transfer_ejs, {
          id: '',
          title: '振り替え',
          action: '/payment/payment_transfer',
          from: 'payment',
          method: 'transfer',
          paymentValue: 0,
          user_id: user_id,
          bank: bank_info,
        })
      });
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(contain);
      res.end();
    }
    bankSQL.getBankList(user_id, _callbackFunc);
  }
  personSQL.getUserNameByUserId(user_id, callbackFunc);
}

module.exports = router;
