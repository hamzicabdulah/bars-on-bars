'use strict';

var mongoose = require('mongoose');
var Place = new mongoose.Schema({
    name: String,
    going: Array
});

module.exports = mongoose.model('Place', Place);