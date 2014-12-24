'use strict';


var User = require('../../models/user').User;

// Get all records
exports.getAll = function (Model) {
    return function (req, res) {
        return Model.find({})
            //.sort('created', -1)
            .exec(function (err, model) {
                if (!err) {
                    if (model.length == 0) {
                        return res.status(404).send({ error: 'Not found' });
                    } else {
                        return res.status(200).send({ success: model });
                    }
                } else {
                    return res.status(500).send({ error: err });
                }
        });
    }
}

// Get specific records by Key-Value pair
exports.findModel = function (Model) {
    return function (req, res) {
        if (req.params.key == undefined || req.params.key == '' ||
            req.params.value == undefined || req.params.value == '') {
            return res.status(400).send({ error: 'Validation error' });
        }

        var Key = req.params.key;
        var Value = req.params.value;
        return Model.find({})
            .where(Key).equals(Value)
            //.sort('created', -1)
            .exec(function (err, model) {
                if (!err) {
                    if (model.length == 0) {
                        return res.status(404).send({ error: 'Not found' });
                    } else {
                        return res.status(200).send({ success: model });
                    }
                } else {
                    return res.status(500).send({ error: err });
                }
            });
    }
}

// Get a single Record
exports.getModel = function (Model) {
    return function (req, res) {
        if (req.params.id == undefined || req.params.id == '') {
            return res.status(400).send({ error: 'Validation error' });
        }

        var Id = req.params.id;
        return Model.find({})
            .where('_id').equals(Id)
            .exec(function (err, model) {
                if (!err) {
                    if (model.length != 1) {
                        return res.status(404).send({ error: 'Not found' });
                    } else {
                        return res.status(200).send({ success: model[0] });
                    }
                } else {
                    return res.status(500).send({ error: 'Server error' });
                }
            });
    }
}

// Create a new Record
exports.createModel = function (Model) {
    return function (req, res) {
        // Passport.js Authentication
        if(!req.isAuthenticated()){
            return res.status(401).send({ error: 'Not Authenticated' });
        }

        var Data = new Model(req.body);

        if (Data.Password) {
            Data.PasswordChanged = true;
        }

        if (Data.Email) {
            return User.find({})
                .where('Email').equals(Data.Email)
                .exec(function (err, data) {
                    if(!err){
                        if(data.length > 0){
                            return res.status(500).send({ error: 'Email already exists!' });
                        }else{
                            createRecord();
                        }
                    }else{
                        createRecord();
                    }
                });
        }else{
            createRecord();
        }

        function createRecord(){
            Data.save(function (err, result) {
                if (!err) {
                    return res.status(200).send({ success: result });
                } else {
                    if (err.name == 'ValidationError') {
                        res.status(400).send({ error: err });
                    } else {
                        res.status(500).send({ error: err });
                    }
                }
            });
        }
    }
}

// Update existing Record
exports.updateModel = function (Model) {
    return function (req, res) {
        var Id = req.params.id;
        var UpdatedData = req.body;

        // Passport.js Authentication
        if(!req.isAuthenticated()){
            return res.status(401).send({ error: 'Not Authenticated' });
        }else if (!req.params.id || !req.body) {
            return res.status(400).send({ error: 'Validation error' });
        }else if(req.body.Email){
            // Checks if Email id is unique or not
            return User.find({})
                .where('Email').equals(req.body.Email)
                .exec(function (err2, data2) {
                    if(!err2 && data2){
                        for(var d in data2){
                            if(data2[d]._id != UpdatedData.Id){
                                return res.status(500).send({ error: 'Email already exists!' });
                            }
                        }
                        updateRecord();
                    }else{
                        updateRecord();
                    }
                });
        }else{
            updateRecord();
        }

        function updateRecord(){
            return Model.find({})
                .where('_id').equals(Id)
                .exec(function (err, data) {
                    if (data.length != 1) {
                        return res.status(404).send({ error: 'Not found' });
                    }

                    var Data = data[0];
                    // This will update the key-values
                    var Keys = Object.keys(UpdatedData);
                    for (var K in Keys) {
                        var Key = Keys[K];
                        // Checks if password has been updated or not
                        if (Key == 'Password') {
                            if(Data.Password == UpdatedData.Password || !UpdatedData.Password){
                                Data.PasswordChanged = false;
                            }else{
                                Data.PasswordChanged = true;
                            }
                        }
                        Data[Key] = UpdatedData[Key];
                    }

                    Data.modified = new Date();
                    Data.__v += 1;

                    return Data.save(function (err, result) {
                        if (!err) {
                            return res.status(200).send({ success: result });
                        } else {
                            if (err.name == 'ValidationError') {
                                res.status(400).send({ error: err });
                            } else {
                                res.status(500).send({ error: err });
                            }
                        }
                    });
                });
        }

    }
}

// Delete a Record
exports.deleteModel = function (Model) {
    return function (req, res) {
        // Passport.js Authentication
        if(!req.isAuthenticated()){
            return res.status(401).send({ error: 'Not Authenticated' });
        }

        if (req.params.id == undefined || req.params.id == '') {
            return res.status(400).send({ error: 'Validation error' });
        }

        var Id = req.params.id;
        return Model.find({})
            .where('_id').equals(Id)
            .exec(function (err, data) {
                if (data.length != 1) {
                    return res.status(404).send({ error: 'Not found' });
                }

                return data[0].remove(function (err, result) {
                    if (!err) {
                        return res.status(200).send({ success: result });
                    } else {
                        return res.status(500).send({ error: err });
                    }
                });
            });
    }
}