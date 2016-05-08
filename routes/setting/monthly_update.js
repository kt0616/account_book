var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var personSQL = require('../query/person.js');
var bankSQL = require('../query/bank.js');
var itemSettingSQL = require('../query/item_setting.js');
var monthlySQL = require('../query/monthly.js');
var router = express.Router();

var index_ejs = fs.readFileSync('./views/index.ejs', 'UTF-8');
var monthly_add_ejs = fs.readFileSync('./views/payment_add.ejs', 'UTF-8');

/* GET home page. */
router.get('/', function(req, res, next) {
  var user_id = req.session.user_id;
  var monthly_id = req.query.id;
  if (user_id) {
    printList(user_id, monthly_id, res);
  } else {
    res.redirect('/login');
  }
});

router.post('/', function(req, res, next) {
  var monthly = {};
  monthly.user_id = req.session.user_id;
  if (!monthly.user_id) {
    res.redirect('/login');
  }
  monthly.id = req.body['id'];
  var method = req.body['method'];
  if(method == 'update'){
    monthly.bank_id = req.body['bank_id'];
    monthly.item_id = req.body['payment_setting'];
    monthly.price = req.body['money'];
    monthly.monthly_day = req.body['monthly'];
    monthly.name = req.body['monthly_name'];
    var callbackFunc = function(){
      res.redirect('/setting/monthly_list');
    }
    monthlySQL.updateMonthly(monthly, callbackFunc);
  }else if(method == 'delete'){
    var callbackFunc = function(){
      res.redirect('/setting/monthly_list');
    }
    monthlySQL.deleteMonthly(monthly, callbackFunc);
  }
});

function printList(user_id, monthly_id, res){
  //ユーザー名の取得
  var callbackFunc = function(user_name){
    //銀行情報の取得
    var _callbackFunc = function(result_bank){
      //項目情報の取得
      var __callbackFunc = function(result_type){
        var ___callbackFunc = function(result_monthly){
          var bank_info = new Array();
          var type_info = new Array();
          var firstFlg = 1;
          result_bank.forEach(function(bank_item){
            var selected_bank = result_monthly.bank_id;
            var activeFlg = 0;
            if(selected_bank == bank_item.bank_id) activeFlg = 1;
            var temp_bank = {
              active: activeFlg,
              bank_id: bank_item.bank_id,
              name: bank_item.bank_name
            }
            firstFlg = 0;
            bank_info.push(temp_bank);
          });
          firstFlg = 1;
          result_type.forEach(function(type_item){
            var selected_type = result_monthly.item_id;
            var activeFlg = 0;
            if(selected_type == type_item.item_setting_id) activeFlg = 1;
            var temp_type = {
              active: activeFlg,
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
            main_body: ejs.render(monthly_add_ejs, {
              id: monthly_id,
              rure_day: result_monthly.day,
              name: result_monthly.name,
              title: '月極登録',
              action: '/setting/monthly_update',
              from: 'monthly',
              method: 'update',
              paymentValue: Math.abs(result_monthly.price),
              user_id: user_id,
              bank: bank_info,
              payment_type: type_info,
            })
          });
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(contain);
          res.end();
        }
        monthlySQL.selectMonthlyById(user_id, monthly_id, ___callbackFunc);
      }
      itemSettingSQL.getItemSettingList(user_id, __callbackFunc);
    }
    bankSQL.getBankList(user_id, _callbackFunc);
  }
  personSQL.getUserNameByUserId(user_id, callbackFunc);
}

module.exports = router;
