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
  var item_setting_id = req.query.item_setting_id;
  if(!item_setting_id) res.redirect('/setting/setting');

  var callbackFunc = function(user_name){
    var _callbackFunc = function(result){
      var contain = ejs.render(index_ejs, {
        title: '家計簿アプリ',
        user_id: user_id,
        user_name: user_name,
        main_body: ejs.render(item_form_ejs, {
            user_id: user_id,
            method: 'update',
            title: '項目更新',
            from: 'item_setting',
            item_id: result[0].item_setting_id,
            button_name: '更新',
            action: './item_update',
            payment_type: result[0].in_out_type,
            name: result[0].name,
            from_bank_add: false
          })
      });
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(contain);
      res.end();
    }
    itemSettingSQL.getItemSettingByItemId(user_id, item_setting_id, _callbackFunc);
  }
  personSQL.getUserNameByUserId(user_id, callbackFunc);
});

router.post('/', function(req, res, next) {
  var method = req.body.method;
  if(method == 'update'){
    var item = {};
    item.user_id = req.session.user_id;
    if (!item.user_id) {
      res.redirect('/login');
    }
    item.item_id = req.body['item_id'];
    item.name = req.body['name'];
    item.in_out_type = req.body['in_out_type'];
    var callbackFunc = function(){
      res.redirect('/setting/item_list')
    }
    itemSettingSQL.updateItemSetting(item, callbackFunc);
  }else if(method == 'delete'){
    var user_id = req.session.user_id;
    var item_id = req.body['item_id'];
    var callbackFunc = function(){
      res.redirect('/setting/item_list')
    }
    itemSettingSQL.deleteItemSetting(user_id, item_id, callbackFunc);
  }
});

module.exports = router;
