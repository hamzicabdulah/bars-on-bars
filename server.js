'use strict';

var express = require('express');
var mongoose = require('mongoose');
var routes = require('./app/routes/index.js');
var passport = require('passport');
var session = require('express-session');

require('dotenv').load();
require('./app/config/passport')(passport);

var app = express();
mongoose.connect(process.env.MONGO_URI);

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

app.listen(process.env.PORT || 8080, function () {
   console.log('Listening to port');
});
