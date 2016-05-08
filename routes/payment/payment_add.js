var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var personSQL = require('../query/person.js');
var bankSQL = require('../query/bank.js');
var itemSettingSQL = require('../query/item_setting.js');
var paymentSQL = require('../query/payment.js');
var router = express.Router();

var index_ejs = fs.readFileSync('./views/index.ejs', 'UTF-8');
var payment_add_ejs = fs.readFileSync('./views/payment_add.ejs', 'UTF-8');

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
  payment.user_id = req.body['user_id'];
  payment.bank_id = req.body['bank_id'];
  payment.item_id = req.body['payment_setting'];
  payment.price = req.body['money'];
  var callbackFunc = function(){
    res.redirect('/payment/payment_list');
  }
  paymentSQL.insertPayment(payment, callbackFunc);
});

function printList(user_id, res){
  //ユーザー名の取得
  var callbackFunc = function(user_name){
    //銀行情報の取得
    var _callbackFunc = function(result_bank){
      //項目情報の取得
      var __callbackFunc = function(result_type){
        var bank_info = new Array();
        var type_info = new Array();
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
        firstFlg = 1;
        result_type.forEach(function(type_item){
          var temp_type = {
            active: firstFlg,
            type_id: type_item.item_setting_id,
            name: type_item.name,
            in_out: type_item.in_out_type
          }
          firstFlg = 0;
          type_info.push(temp_type);
        });

        var contain = ejs.render(index_ejs, {
          title: '家計簿アプリ',
          user_id: user_id,
          user_name: user_name,
          main_body: ejs.render(payment_add_ejs, {
            id: '',
            title: '収支記録',
            rure_day: '',
            name: '',
            action: '/payment/payment_add',
            from: 'payment',
            method: 'insert',
            paymentValue: 0,
            user_id: user_id,
            bank: bank_info,
            payment_type: type_info,
            del_flg: 0
          })
        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(contain);
        res.end();
      }
      itemSettingSQL.getItemSettingList(user_id, __callbackFunc);
    }
    bankSQL.getBankList(user_id, _callbackFunc);
  }
  personSQL.getUserNameByUserId(user_id, callbackFunc);
}

module.exports = router;
