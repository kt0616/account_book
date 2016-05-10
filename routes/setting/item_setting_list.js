var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var personSQL = require('../query/person.js');
var itemSettingSQL = require('../query/item_setting.js');
var router = express.Router();

var index_ejs = fs.readFileSync('./views/index.ejs', 'UTF-8');
var item_list_ejs = fs.readFileSync('./views/item_list.ejs', 'UTF-8');

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
  var callbackFunc = function(user_name){
    var _callbackFunc = function(result){
      console.log(result)
      var in_type_item = new Array();
      var out_type_item = new Array();
      result.forEach(function(item){
        var tempItem = {
          sub_menu_name: item.name,
          sub_menu_link: '/setting/item_update?item_setting_id='+item.item_setting_id
        }
        if(item.in_out_type == 0){
          in_type_item.push(tempItem);
        }if(item.in_out_type == 1){
          out_type_item.push(tempItem);
        }
      });
      var contain = ejs.render(index_ejs, {
        title: '家計簿アプリ',
        user_id: user_id,
        user_name: user_name,
        main_body: ejs.render(item_list_ejs, {
            type_in: in_type_item,
            type_out: out_type_item
          })
      });
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(contain);
      res.end();
    }
    itemSettingSQL.getItemSettingList(user_id, _callbackFunc);
  }
  personSQL.getUserNameByUserId(user_id, callbackFunc);
}

module.exports = router;
