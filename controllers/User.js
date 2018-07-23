var _ = require('./Utils.js');
var authentication = require('./Authentication.js');
var mongoose = require('mongoose');
var User = require('../models/User.js');
var Group = require('../models/Group.js');

exports.create = function (req,res,callback) {
    console.log("on commence à créer l'user");
    //Check username validity
    if ( req.body.username === undefined || req.body.username.length < 2 || req.body.username.indexOf(' ') > -1) {
        _.response.sendError(res, 'Invalid username.', 400);
        return;
    }

    if ( req.body.password === undefined || req.body.password.length < 8) {
        _.response.sendError(res, 'Invalid password.', 400);
        return;
    }

    authentication.helper.generateSaltAndHash(req.body.password,function(error, salt, hash) {
        //throw error if exists
        if (error) {
            _.response.sendError(res,'error in salt Generation',500);
            return;
        }
        
        //creating a new user
        var user = new User({
            login: req.body.username,
            nom: req.body.surname,
            prenom: req.body.name,
            salt: salt,
            hash: hash
        });

        user.save(function(error,user){
            if (error && error.code === 11000) {
                error = 'Invalid login (duplicate)';
                _.response.sendError(res,error,500);
                return;
            } else if (error) {
                _.response.sendError(res,'error while saving the user',500);
                return;
            }
            req.session.user = user;
            callback(req,res,"user & group registred succesfully");
        });
        
        
    });
};

var getAll = exports.getAll = function (req,res,callback) {
    //callback = function(result)
    User.find({},'nom prenom _id', function(error,result) {
        if( error ) {
            _.response.sendError(res,error,500);
            return;
        }
        callback(result);
        return;
    });
};

var getOne = exports.getOne = function (req,res,idUser,callback) {
    //callback = function(result)
    User.findOne({_id: idUser},'nom prenom _id', function(error,result) {
        if (!mongoose.Types.ObjectId.isValid(idUser)){
            _.response.sendError(res,"invalid ID for query", 500)
            return;
        }
        if( error ) {
            _.response.sendError(res,error,500);
            return;
        }
        callback(result);
        return;
    });
};

exports.displayAll = function(req,res) {
    getAll(req,res,function(result) {
        //console.log(result);
        //console.log(result.length);
        res.render('users.ejs',{users: result});
    });
};

exports.displayOne = function(req,res) {
    if (req.params.id === undefined) {
        res.render('user.ejs',{user: req.session.user});
    } else {
        getOne(req,res,req.params.id,function(result) {
            res.render('user.ejs',{user: result, me: req.session.user});
        });
    }
}; 

exports.getGroupsFrom = function (id_user,callback) {
    console.log("In getGroupsFrom")
    //callback(error,groups_ids)
      Group.find({
          users: id_user
        }, '_id name',
        function(error,groups) {
            callback(error,groups);
        });
};

exports.showUser = function(req,res) {
    res.redirect('/user/' + req.session.user._id);
}