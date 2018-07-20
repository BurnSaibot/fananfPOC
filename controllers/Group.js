var Group = require('../models/Group');
var _ = require('./Utils');
var mongoose = require('mongoose');

var create = exports.create = function (req,res,msg) {
    console.log(req.session);
    console.log(req.session.user);
    var groupName = req.session.user.nom.toUpperCase() + " " + req.session.user.prenom;
    var description = '';

    var members = []
    members.push(req.session.user._id);
    console.log(members);

    var group = new Group({
        name : groupName,
        description : description,
        users : members
    })

    group.save(function(error,group){
        if (error && error.code === 11000) {
            error = "invalide group name (duplicate) " + groupName;
            _.response.sendError(res,error,500);
            return;
        } else if (error) {
            _.response.sendError(res,'error while saving the group',500);
            User.deletOne({_id: req.user.session._id},function(err){
                _.response.sendError(res,err,500);
            })
            return;
        }
        _.response.sendSucces(req,res,'/home',msg)
    })

}