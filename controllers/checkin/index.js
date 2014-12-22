'use strict';


var CheckinModel = require('../../models/checkin');


module.exports = function (router) {

    var model = new CheckinModel();

    router.get('/', function (req, res) {
    	res.render('checkin', model);
    });

};
