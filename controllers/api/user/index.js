'use strict';


var User = require(__base + '/models/user').UserModel;
var apiHelper = require(__base + '/controllers/api/api-helper');

// API endpoint routes for User
module.exports = function(router){
    router.get('/', apiHelper.getAll(User));
    router.get('/:id', apiHelper.getModel(User));
    router.get('/:key/:value', apiHelper.findModel(User));

    // Routes with Passport Authentication
    router.post('/', apiHelper.createModel(User));
    router.put('/:id', apiHelper.updateModel(User));
    router.delete('/:id', apiHelper.deleteModel(User));
};