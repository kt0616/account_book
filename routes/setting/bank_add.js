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

  var callbackFunc = function(user_name){
    var contain = ejs.render(index_ejs, {
      title: '家計簿アプリ',
      user_id: user_id,
      user_name: user_name,
      main_body: ejs.render(item_form_ejs, {
          user_id: user_id,
          item_id: '',
          title: '銀行登録',
          from: 'bank',
          method: 'insert',
          button_name: '登録',
          action: '/setting/bank_add',
          payment_type: '',
          name: '',
          from_bank_add: true
        })
    });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(contain);
    res.end();
  }
  personSQL.getUserNameByUserId(user_id, callbackFunc);
});

router.post('/', function(req, res, next) {
  var item = {};
  item.user_id = req.session.user_id;
  if (!item.user_id) {
    res.redirect('/login');
  }
  item.name = req.body['name'];
  item.bank_initial = req.body['bank_initial'];
  var callbackFunc = function(){
    res.redirect('/zandaka/ref');
  }
  bankSQL.insertBank(item, callbackFunc);
});

module.exports = router;
