var express = require('express');
var app = express();
var mongoose = require('mongoose');
var routes = require('./app/routes/index.js');

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

routes(app);

app.listen(process.env.PORT || 8080, function () {
   console.log('Listening to port');
});
