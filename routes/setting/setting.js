var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var personSQL = require('../query/person.js');
var router = express.Router();

var index_ejs = fs.readFileSync('./views/index.ejs', 'UTF-8');
var listmenu_ejs = fs.readFileSync('./views/listmenu.ejs', 'UTF-8');

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
      main_body: ejs.render(listmenu_ejs, {
          data: [
            {menu_name: '入出金項目設定', menu_link: null, sub_menu: [{sub_menu_name: '項目の追加', sub_menu_link: '/setting/item_add'}, {sub_menu_name: '項目の確認', sub_menu_link: '/setting/item_list'}]},
            {menu_name: '銀行設定', menu_link: null, sub_menu: [{sub_menu_name: '銀行の追加', sub_menu_link: '/setting/bank_add'}, {sub_menu_name: '銀行の確認', sub_menu_link: '/zandaka/ref'}, {sub_menu_name: '銀行の間お金移動', sub_menu_link: '/payment/payment_transfer'}]},
            {menu_name: '月極設定', menu_link: null, sub_menu: [{sub_menu_name: '月極設定の追加', sub_menu_link: '/setting/monthly_add'}, {sub_menu_name: '月極の確認', sub_menu_link: '/setting/monthly_list'}]}
          ]
        })
    });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(contain);
    res.end();
  }
  personSQL.getUserNameByUserId(user_id, callbackFunc);
});

module.exports = router;
