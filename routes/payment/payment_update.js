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
  var payment_id = req.query.id;
  if (user_id) {
    printList(user_id, payment_id, res);
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
  var method = req.body['method'];
  payment.payment_id = req.body['id'];
  if(method == 'update'){
    payment.bank_id = req.body['bank_id'];
    payment.item_id = req.body['payment_setting'];
    payment.price = req.body['money'];
    var callbackFunc = function(){
      res.redirect('/payment/payment_list');
    }
    paymentSQL.updatePayment(payment, callbackFunc);
  }else if(method == 'delete'){
    var callbackFunc = function(){
      res.redirect('/payment/payment_list');
    }
    paymentSQL.deletePayment(payment, callbackFunc);
  }

});

function printList(user_id, payment_id, res){
  //ユーザー名の取得
  var callbackFunc = function(user_name){
    //銀行情報の取得
    var _callbackFunc = function(result_bank){
      //項目情報の取得
      var __callbackFunc = function(result_type){
        var ___callbackFunc = function(result_payment){
          var bank_info = new Array();
          var type_info = new Array();
          var existFlg = 0;
          //銀行情報の詰め込み
          result_bank.forEach(function(bank_item){
            var selected_bank = result_payment.bank_id;
            var activeFlg = 0;
            if(selected_bank == bank_item.bank_id){
              activeFlg = 1;
              existFlg = 1;
            }
            var temp_bank = {
              active: activeFlg,
              bank_id: bank_item.bank_id,
              name: bank_item.bank_name
            }
            bank_info.push(temp_bank);
          });
          if(existFlg == 0){
            //削除済み・特殊なものの変更
            var temp_bank = {
              active: 1,
              bank_id: result_payment.bank_id,
              name: result_payment.bank_name
            }
            bank_info.push(temp_bank);
          }
          existFlg = 0;

          //項目の詰め込み
          result_type.forEach(function(type_item){
            var selected_type = result_payment.item_id;
            var activeFlg = 0;
            if(selected_type == type_item.item_setting_id) {
              activeFlg = 1;
              existFlg = 1;
            }
            var temp_type = {
              active: activeFlg,
              type_id: type_item.item_setting_id,
              name: type_item.name,
              in_out: type_item.in_out_type
            }
            type_info.push(temp_type);
          });
          if(existFlg == 0){
            //削除済み・特殊なものの変更
            var temp_item = {
              active: 1,
              type_id: result_payment.item_id,
              name: result_payment.item_name,
              in_out: result_payment.in_out_type
            }
            type_info.push(temp_item);
          }

          var contain = ejs.render(index_ejs, {
            title: '家計簿アプリ',
            user_id: user_id,
            user_name: user_name,
            main_body: ejs.render(payment_add_ejs, {
              id: payment_id,
              title: '収支記録',
              rure_day: '',
              name: '',
              action: '/payment/payment_update',
              from: 'payment',
              method: 'update',
              paymentValue: Math.abs(result_payment.price),
              user_id: user_id,
              bank: bank_info,
              payment_type: type_info
            })
          });
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(contain);
          res.end();
        }
        paymentSQL.selectPaymentById(user_id, payment_id, ___callbackFunc);
      }
      itemSettingSQL.getItemSettingList(user_id, __callbackFunc);
    }
    bankSQL.getBankList(user_id, _callbackFunc);
  }
  personSQL.getUserNameByUserId(user_id, callbackFunc);
}

module.exports = router;
