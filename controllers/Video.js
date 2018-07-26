var formidable = require('formidable');
var fs = require('fs');
var _ = require('./Utils.js');
var path = require('path');
const shell = require('shelljs');

exports.registerVideo = function(req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //console.log(files.videotoupload);
        var oldpath = files.videotoupload.path;
        var filename = files.videotoupload.name;
        var propperName = filename.trim();
        var newpath = path.join(__dirname, req.session.config.filePath , 'data', 'videos', propperName);
        var pathOut = path.join(__dirname, req.session.config.filePath, 'data', 'subtitles');
        var pathScript = path.join(__dirname, "../","scripts","videoToSub.sh");
        console.log(pathScript);
        fs.readFile(oldpath,function(err,data) {
            if (err) _.response.sendError(res,err,500);
            console.log('File read : ' + oldpath);
            fs.writeFile(newpath,data,function(err) {
                if (err) _.response.sendError(res,err,500);
                console.log("File uploaded & moved");

                fs.unlink(oldpath, function(err) {
                    if (err) _.response.sendError(res,err,500);
                    shell.exec("/bin/bash " + pathScript + " -f " + req.params.format + " -i " + newpath + " -o " + pathOut + " & " ,{silent: false},function(code,stdout,stderr) {
                        console.log(code);
                        if (code == 0) _.response.sendSucces(req,res,'/home',"File uploaded & stored succesfuly, temporary file deleted");
                        else _.response.sendError(res,"La transcription automatique a échouée",500);
                    }).stdout;
                    

                });
            });
            
        });

        
        /*fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            _.response.sendSucces(req,res,'/home','Video registered succesfuly');
        });*/
    });
}

exports.viewsUploadVideo = function(req,res) {
    res.render('addVideo.ejs');
}
