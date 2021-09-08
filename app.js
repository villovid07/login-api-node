//archivo de propiedades
require('dotenv').load();
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors= require("cors");
var passport= require('passport');

var routesApi= require('./app_seguridad_api/routes/index');

require('./app_seguridad_api/config/passport');


var app = express();
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cors({}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', routesApi);


// catch 404 and forward to error handler
app.use(function(err,req, res, next) {
    res.status(404).json({
        error : {
            message : err.message
       }
    });
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        if(err.name==="UnauthorizedError"){
          res.status(401);
          res.json({"message": err.name+":"+err.message });
        }
        else{
          console.log(err);
          res.status(err.status || 500);
          res.json('error', {
              message: err.message,
              error: err
          });
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.json({"mensaje":"not found"});
});

console.log("servidor-------------------------------------------------");

module.exports = app;
