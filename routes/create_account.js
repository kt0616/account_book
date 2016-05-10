var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var session = require('express-session');
var personSQL = require('./query/person.js');
var router = express.Router();

var create_account_ejs = fs.readFileSync('./views/create_account.ejs', 'UTF-8');

/* GET home page. */
router.get('/', function(req, res, next) {
  var err = req.query.err;
  var contain = ejs.render(create_account_ejs, {
    err: err
  });
  res.writeHead(200, {
            'Access-Control-Allow-Origin':'*'
          });
  res.write(contain);
  res.end();
});

router.post('/', function(req, res, next) {
  var person = {};
  person.user_name = req.body.name;
  person.user_id = req.body.user_id;
  person.password = req.body.password;
  console.log(person)
  var callbackFunc = function(result){
    if(result){
      req.session.user_id = result;
      res.redirect('/login');
    }else{
      res.redirect('/create_account?err=user_id');
    }
  }
  personSQL.insertPerson(person, callbackFunc);
});

module.exports = router;
