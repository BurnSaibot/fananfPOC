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
    // si on ajoute une description comme pour camomille, on peut mettre en type Schema.Types.mixed :
    // pour mettre tout et n'importe quoi dedans. /!\ Mongoose ne peut pas détecter 
    //les changements, on doit l'avertir manuellement
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Group', Group)