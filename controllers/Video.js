var formidable = require('formidable');
var fs = require('fs');
var _ = require('./Utils.js');
var path = require('path');

exports.registerVideo = function(req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //console.log(files.videotoupload);
        var oldpath = files.videotoupload.path;
        var newpath = path.join(__dirname, '../../', 'data', files.videotoupload.name);
        console.log(__dirname);
        console.log(oldpath);
        console.log(newpath);
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            _.response.sendSucces(req,res,'/home','Video registered succesfuly');
        });
    });
}

exports.viewsUploadVideo = function(req,res) {
    res.render('addVideo.ejs');
}