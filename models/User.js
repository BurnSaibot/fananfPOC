var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
    login: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    nom: String,
    prenom: String,
    salt: String,
    hash: String
});

module.exports = mongoose.model('User', userSchema);