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
        type: String,
        enum: ['On Going','Failed','Done']
    },
    subTitles:[{
        type: Schema.Types.ObjectId,
        ref: 'subtitles'
    }]
})

module.exports = mongoose.model('Transcription', transcriptionSchema);
