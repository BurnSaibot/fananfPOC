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
    },
    transcription: {
        type: Schema.Types.ObjectId,
        ref: 'Transcription'
    }
})

module.exports = mongoose.model('sousTitres', sousTitresSchema);