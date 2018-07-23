var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sousTitresSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true,
        lowercase: true
    },
    urlSousTitres: {
        type: String,
        required: true,
        unique: true
    },
    format: {
        type: String,
        require: true,
        lowercase: true,
    },
    transcription: {
        type: Schema.Types.ObjectId,
        ref: 'Transcription'
    }
})

module.exports = mongoose.model('sousTitres', sousTitresSchema);