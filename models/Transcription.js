var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transcriptionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trime: true,
        lowercase: true
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }
})

module.exports = mongoose.model('Transcription', transcriptionSchema);
