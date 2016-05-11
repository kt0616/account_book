var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var func = require('../function.js');
var personSQL = require('../query/person.js');
var zandakaSQL = require('../query/zandakaQuery.js');
var router = express.Router();

var index_ejs = fs.readFileSync('./views/index.ejs', 'UTF-8');
var zandaka_ejs = fs.readFileSync('./views/zandaka.ejs', 'UTF-8');

/* GET home page. */
router.get('/', function(req, res, next) {
  var user_id = req.session.user_id;
  if (!user_id) {
    res.redirect('/login');
  }
  var callbackFunc = function(user_name){
    var _callbackFunc = function(results){
      var _results = [];
      results.forEach(function(result){
        var temp = {
          id: result.bank_id,
          bank_name: result.bank_name,
          price: func.separateNum(result.zandaka)
        }
        _results.push(temp);
      });
      var contain = ejs.render(index_ejs, {
        title: '家計簿アプリ',
        user_id: user_id,
        user_name: user_name,
        main_body: ejs.render(zandaka_ejs, {
            datas: _results
          })
      });
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(contain);
      res.end();
    }
    zandakaSQL.getZandakaList(user_id, _callbackFunc);
  }
  personSQL.getUserNameByUserId(user_id, callbackFunc);
});

module.exports = router;
