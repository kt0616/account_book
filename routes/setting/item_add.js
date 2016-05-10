var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var personSQL = require('../query/person.js');
var itemSettingSQL = require('../query/item_setting.js');
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
          title: '項目登録',
          from: 'item_setting',
          method: 'insert',
          button_name: '登録',
          action: './item_add',
          payment_type: 0,
          name: '',
          from_bank_add: false
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
  item.in_out_type = req.body['in_out_type'];
  var callbackFunc = function(){
    res.redirect('/setting/item_list');
  }
  itemSettingSQL.insertItemSetting(item, callbackFunc);
});

module.exports = router;
