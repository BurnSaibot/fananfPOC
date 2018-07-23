var formidable = require('formidable');
var fs = require('fs');
var _ = require('./Utils.js');



exports.registerVideo = function(req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.videotoupload.path;
        var newpath = '../data/' + files.videotoupload.name; 
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            _.response.sendSucces(req,res,'/home','Video registered succesfuly');
        });
    });
}

exports.viewsUploadVideo = function(req,res) {
    res.render('addVideo.ejs');
}