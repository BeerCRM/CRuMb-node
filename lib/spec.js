'use strict';


var passport = require('passport');
module.exports = function spec(app) {
    app.on('middleware:after:session', function configPassport(eventargs) {
        app.use(passport.initialize());
        app.use(passport.session());
    });
    return {
        onconfig: function (config, next){
            // Values from "config/config.json"
            //console.log(config._store);

            next(null, config);
        }
    };
};