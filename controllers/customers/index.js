'use strict';


var CustomersModel = require('../../models/customers');


module.exports = function (router) {

    var model = new CustomersModel();

    router.get('/', function (req, res) {
        res.render('customers', model);
    });

};
