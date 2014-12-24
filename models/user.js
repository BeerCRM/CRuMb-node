'use strict';


var mongoose = require('mongoose');
var crypto = require('../lib/crypto');

var Schema = mongoose.Schema;
var User = new Schema({
    FirstName:  { type: String, required: true },
    LastName:   String,
    Email:      { type: String, unique: true },
    Title:      String,
    Manager:    { type: Schema.ObjectId, ref: 'User' },  // UserId
    Active :    { type: Boolean, required: true },
    Password:   String,
    Photo:      Schema.Types.Mixed,
    Type:       {   type: String,
        enum: [ 'admin', 'manager', 'HostLeader', 'Participant' ],
        required: true  },
    modified:   { type: Date, default: Date.now },
    created:   { type: Date, default: Date.now }
});

// replaces "_id" with "Id" while retrieving
User.set('toJSON', {
    transform: function(doc, ret, options){
        ret.Id = ret._id;
        delete ret._id;
    }
});

// Generate Password Hash
User.pre('save', function(next){
    if(this.PasswordChanged){
        this.Password = crypto.hash(this.Password);
    }
    delete this.PasswordChanged;
    next();
});

var UserModel = mongoose.model('User', User);

// Email Validation
UserModel.schema.path('Email').validate(function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}, 'Invalid Email');

module.exports.UserModel = UserModel;

// Password Hash Matcher
module.exports.UserPassword = function(hashedPassword, password){
    return crypto.validate(hashedPassword, password);
};
