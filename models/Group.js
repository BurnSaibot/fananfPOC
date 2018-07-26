var mongoose = require('mongoose');
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

module.exports = mongoose.model('Group', Group)