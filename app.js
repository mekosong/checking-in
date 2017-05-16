var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var ejs = require('ejs');

const route = require('./core/routes');


var app = express();
//启用压缩
app.use(compression());

//模板更改为html
app.set('views', 'public/assets');
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
    res.redirect('/main');
});

app.get('/main*',function(req,res){
    res.sendFile('index.html', { root: './public/assets/' });
});

app.use(route);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if(err.status!=404) console.error(err);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
