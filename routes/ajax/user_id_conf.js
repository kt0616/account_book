var express = require('express');
var personSQL = require('../query/person.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var user_id = req.query.user_id;
  var callbackFunc = function(result){
    var value;
    if(result.length > 0){
      value = 'conf';
    }else{
      value = 'ok';
    }
    res.writeHead(200, {'Content-Type': 'text/text'});
    res.write(value);
    res.end();
  }
  personSQL.ajax_user_id_check(user_id, callbackFunc);
});

module.exports = router;
