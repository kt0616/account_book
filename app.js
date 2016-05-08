var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var create_account = require('./routes/create_account');
var setting = require('./routes/setting/setting');
var item_add = require('./routes/setting/item_add');
var item_update = require('./routes/setting/item_update');
var item_setting_list = require('./routes/setting/item_setting_list');
var payment_add = require('./routes/payment/payment_add');
var payment_update = require('./routes/payment/payment_update');
var payment_transfer = require('./routes/payment/payment_transfer');
var payment_list = require('./routes/payment/payment_list');
var logout = require('./routes/logout');
var pi_graph = require('./routes/graph/pi_graph');
var column_graph = require('./routes/graph/column_graph');
var zandaka = require('./routes/zandaka/zandaka.js');
var monthly_add = require('./routes/setting/monthly_add');
var monthly_update = require('./routes/setting/monthly_update');
var monthly_list = require('./routes/setting/monthly_list');
var diff_add = require('./routes/diff/diff_add');
var bank_add = require('./routes/setting/bank_add');
var bank_update = require('./routes/setting/bank_update');
var monthlySQL = require('./routes/query/monthly.js');
var ajax_user_id = require('./routes/ajax/user_id_conf');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {

  }
}));
app.use('/login',routes);
app.use('/create_account', create_account);
app.use('/setting/setting', setting);
app.use('/setting/item_add', item_add);
app.use('/setting/item_update', item_update);
app.use('/setting/item_list', item_setting_list);
app.use('/payment/payment_add', payment_add);
app.use('/payment/payment_update', payment_update);
app.use('/payment/payment_transfer', payment_transfer);
app.use('/payment/payment_list', payment_list);
app.use('/logout', logout);
app.use('/graph/pi_graph', pi_graph);
app.use('/graph/column_graph', column_graph);
app.use('/zandaka/ref', zandaka);
app.use('/setting/monthly_add', monthly_add);
app.use('/setting/monthly_update', monthly_update);
app.use('/setting/monthly_list', monthly_list);
app.use('/setting/bank_add', bank_add);
app.use('/setting/bank_update', bank_update);
app.use('/diff/diff_add', diff_add);
app.use('/ajax/ajax_user_id', ajax_user_id);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

console.log('server start.')
monthlySQL.startEngin();

module.exports = app;
