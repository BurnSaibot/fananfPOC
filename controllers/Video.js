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

        fs.readFile(oldpath,function(err,data) {
            if (err) _.response.sendError(res,err,500);
            console.log('File read : ' + oldpath);
            fs.writeFile(newpath,data,function(err) {
                if (err) _.response.sendError(res,err,500);
                console.log("File uploaded & moved");

                fs.unlink(oldpath, function(err) {
                    if (err) _.response.sendError(res,err,500);
                    _.response.sendSucces(req,res,'/home',"File uploaded & stored succesfuly, temporary file deleted")
                })
            })

            
        })
        /*fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            _.response.sendSucces(req,res,'/home','Video registered succesfuly');
        });*/
    });
}

exports.viewsUploadVideo = function(req,res) {
    res.render('addVideo.ejs');
}