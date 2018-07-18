var mongoose = require('mongoose');
var _ = require('./Utils');
var Schema = mongoose.Schema;

var Group = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: Schema.Types.Mixed,
        'default': ''
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

var create = exports.create = function (req,res,groupName,tDescription) {
    if (groupName === undefined || groupName <5 ) {
        _.response.sendError(res,"Invalide groupNAme",500);
    }
    if (description === undefined ) {
        description = '';
    }

    var members = []
    members.push(req.session.user._id)
    console.log(members);
    var group = new Group({
        name : groupName,
        description : tDescription,
        users : members
    })

}

module.exports = mongoose.model('Group', Group)