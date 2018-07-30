var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transcriptionSchema = new Schema({
    name: {
        type: String,
        required: true,
        trime: true,
        lowercase: true
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    urlVideo: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean
    },
    sousTitres:[{
        type: Schema.Types.ObjectId,
        ref: 'sousTitres'
    }]
})

module.exports = mongoose.model('Transcription', transcriptionSchema);
