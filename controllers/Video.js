var formidable = require('formidable');
var fs = require('fs');
var _ = require('./Utils.js');
var path = require('path');
const shell = require('shelljs');

exports.registerVideo = function(req,res) {
    var form = new formidable.IncomingForm();
    //parsing the form
    form.parse(req, function (err, fields, files) {
        //console.log(files.videotoupload);
        var oldpath = files.videotoupload.path;
        var filename = files.videotoupload.name;
        var propperName = filename.trim();
        var newpath = path.join(__dirname, req.session.config.filePath , 'data', 'videos', propperName);
        var pathOut = path.join(__dirname, req.session.config.filePath, 'data', 'subtitles');
        var pathScript = path.join(__dirname, "../","scripts","videoToSub.sh");

        //reading the video then launch the script to get transcription
        fs.readFile(oldpath,function(err,data) {
            if (err) _.response.sendError(res,err,500);
            fs.writeFile(newpath,data,function(err) {
                if (err) _.response.sendError(res,err,500);
                console.log("File uploaded & moved");

                console.log("Subtitles should be find in : " + pathOut + "\n fomrat = " + fields.format);
                //moving the temporary file to the good place : /data/videos
                fs.unlink(oldpath, function(err) {
                    if (err) _.response.sendError(res,err,500);
                    // executing the script to get transcription

                    shell.exec("/bin/bash " + pathScript + " -f " + fields.format + " -i " + newpath + " -o " + pathOut ,{silent: false},function(code,stdout,stderr) {
                        console.log("Code: " + code);
                        if (code == 0) console.log("Succesfuly transcripted : " + propperName);
                        else console.log("Couldn't succed to transcript " + propperName);
                    }).stdout;
                    //even if the transcription isn't over, we redirect the user to home as the transcription could take a great amount of time.
                    _.response.sendSucces(req,res,'/home',"Succesfuly send the video to the server, waiting to get the transcription to generate subtitles.");
                    

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
