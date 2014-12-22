'use strict';


var AboutModel = require('../../models/about');


module.exports = function (router) {

    var model = new AboutModel();


    router.get('/', function (req, res) {
        
        
        res.render('index', model);
        
        
    });

};
