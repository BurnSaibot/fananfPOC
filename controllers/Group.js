var Group = require('../models/Group.js');
var mTranscription = require('../models/Transcription.js')
var User = require ('./User.js');
var _ = require('./Utils.js');
var mongoose = require('mongoose');

var create = exports.create = function (req,res,msg) {
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

exports.viewsMembers = function(req,res) {
    _.response.sendSucces(req,res,'/groups',"Work in Progress");
}

var myGroups = exports.mygroups = function(req,res,callback) {
    //callback(req,res)
    console.log("in myGroups");
    User.getGroupsFrom(req.session.user._id,function(error,myGroups) {
        console.log("in Get groups From callback");
        if (error ) {
            _.response.sendError(res,error,500);
        }
        callback(req,res,myGroups);
    });
};

exports.viewsMyGroups = function(req,res) {
    console.log("in viewsMyGroup")
    myGroups(req,res,function(req,res,myGroups){
        console.log("In myGroupscallback" + myGroups);
        res.render('groups.ejs',{groups: myGroups});
    })
}

exports.getTranscriptionFrom = function(id_group,callback) {
    //callback(error,transcriptions)
    mTranscription.find({
        group: id_group
    }, '_id name status',
    function(error,transcriptions) {
        callback(error,transcriptions);
    });
};

