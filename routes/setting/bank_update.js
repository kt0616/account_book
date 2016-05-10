var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var personSQL = require('../query/person.js');
var bankSQL = require('../query/bank.js');
var router = express.Router();

var index_ejs = fs.readFileSync('./views/index.ejs', 'UTF-8');
var item_form_ejs = fs.readFileSync('./views/item_form.ejs', 'UTF-8');

/* GET home page. */
router.get('/', function(req, res, next) {
  var user_id = req.session.user_id;
  if (!user_id) {
    res.redirect('/login');
  }
  var bank_id = req.query.id;

  var callbackFunc = function(user_name){
    var _callbackFunc = function(result_bank){
      var contain = ejs.render(index_ejs, {
        title: '家計簿アプリ',
        user_id: user_id,
        user_name: user_name,
        main_body: ejs.render(item_form_ejs, {
            user_id: user_id,
            item_id: bank_id,
            title: '銀行登録',
            from: 'bank',
            method: 'update',
            button_name: '更新',
            action: '/setting/bank_update',
            payment_type: '',
            name: result_bank.bank_name,
            from_bank_add: false
          })
      });
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(contain);
      res.end();
    }
    bankSQL.getBank(user_id, bank_id, _callbackFunc);
  }
  personSQL.getUserNameByUserId(user_id, callbackFunc);
});

router.post('/', function(req, res, next) {
  var item = {};
  item.user_id = req.session.user_id;
  if (!item.user_id) {
    res.redirect('/login');
  }
  var method = req.body.method;
  item.id = req.body.item_id;
  var callbackFunc = function(){
    res.redirect('/zandaka/ref');
  }
  if(method == 'update'){
    item.name = req.body['name'];
    bankSQL.updateBank(item, callbackFunc);
  }else if(method == 'delete'){
    bankSQL.deleteBank(item, callbackFunc);
  }
});

module.exports = router;
