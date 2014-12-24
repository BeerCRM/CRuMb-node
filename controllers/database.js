'use strict';


var config = require('../config/config.json');
var mongoose = require('mongoose');

var MONGODB = config.mongodb[config.mongodb.use];
var db = mongoose.connection;

mongoose.connect(MONGODB);

console.log('HERE');

db.on('error', function (err){
    console.log('Error connecting to MongoDB: ' + err.message);
});

db.once('open', function callback () {
    console.log('Connected to MongoDB @ : ' + MONGODB);
});

module.exports.db = db;