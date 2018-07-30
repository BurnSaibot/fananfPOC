var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sousTitresSchema = new Schema({
    urlSousTitres: {
        type: String,
        required: true,
        unique: true
    },
    format: {
        type: String,
        require: true,
        lowercase: true,
    }
})

module.exports = mongoose.model('sousTitres', sousTitresSchema);