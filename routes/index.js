var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var crypto = require("crypto");
var session = require('express-session');
var personSQL = require('./query/person.js');
var router = express.Router();

var login_ejs = fs.readFileSync('./views/login.ejs', 'UTF-8');

router.get('/', function(req, res, next) {
  if (req.session.user_id) {
    res.redirect('/payment/payment_list');
  } else {
    var contain = ejs.render(login_ejs, {
        title: 'ログイン'
      });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(contain);
    res.end();
  }
});

router.post('/', function(req, res, next) {
  var user_id = req.body.user_id;
  var sha512 = crypto.createHash('sha512');
  sha512.update(req.body.password)
  var hash = sha512.digest('hex')
  var password = hash;
  var callbackFunc = function(result){
    var userId = result.length == 1? result[0].person_id: false;
    console.log(result)
    if (userId) {
      req.session.user_id = userId;
      res.redirect('/payment/payment_list');
    } else {
      var contain = ejs.render(login_ejs, {
          title: 'ログイン',
          noUser: 'ユーザーIDとパスワードが一致するユーザーはいません'
        });
      res.writeHead(301, {'Content-Type': 'text/html'});
      res.write(contain);
      res.end();
    }
  }
  personSQL.getLoginUser(user_id, password, callbackFunc);
});


module.exports = router;
