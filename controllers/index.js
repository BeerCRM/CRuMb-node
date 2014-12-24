'use strict';


var IndexModel = require('../models/index'),
	UserModel =  require('../models/user');


module.exports = function (router) {

    var model = new IndexModel();

    router.get('/', function (req, res) {
        res.render('index', model);
    });

};
