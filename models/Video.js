var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var videoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trime: true,
        lowercase: true
    },
    urlVideo: {
        type: String,
        required: true,
        unique: true
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }
})

module.exports = mongoose.model('video', videoSchema);
