'use strict';


var AdminModel = require('../../models/admin');


module.exports = function (router) {

    var model = new AdminModel();

    router.get('/', function (req, res) {
        res.render('admin', model);
    });

};
