var _ = require('./Utils.js');
var mSubtitle = require('../models/Subtitle');
var promise = require('promise');

var create = function(sub) {
    return sub.save()
}