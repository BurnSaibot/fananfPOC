var formidable = require('formidable');
var fs = require('fs');
var _ = require('./Utils.js');
var path = require('path');
const shell = require('shelljs');
var Transcription = require('../models/Transcription');
var user = require('./User');
var Subtitle = require('../models/Subtitle')

exports.register = function(req,res) {
    var form = new formidable.IncomingForm();
    //parsing the form
    form.parse(req, function (err, fields, files) {
        //console.log(files.videotoupload);
        var oldpath = files.videotoupload.path;
        var filename = files.videotoupload.name;
        var propperName = filename.trim();
        var newpath = path.join(__dirname, req.session.config.filePath , 'data', 'videos', fields.group, propperName);
        var pathOut = path.join(__dirname, req.session.config.filePath, 'data', 'subtitles', fields.group);
        var pathScript = path.join(__dirname, "../","scripts","videoToSub.sh");

        var newTrans = new Transcription({
            name: propperName,
            group: fields.group,
            urlVideo: newpath,
            status: false,
            sousTitres: []
        })

        
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
                    newTrans.save(function(error,transcription) {
                        //saving the transcription in the bdd & then wait for the script to create subtile files
                        if (error) _.response.sendError(res,error,500);
                        else {
                            shell.exec("/bin/bash " + pathScript + " -f " + fields.format + " -i " + newpath + " -o " + pathOut ,{silent: false},function(code,stdout,stderr) {
                                console.log("Code: " + code);
                                //Vérifying there wasn't any trouble with the script, then register all data in db
                                if (code == 0) {
                                    Transcription.findByIdAndUpdate(transcription._id, {status: true}, function(error,updtTranscription){
                                        if (error) _.response.sendError(res,error,500);
                                        //then we save the different transcription in the db, depending on the format
                                        if (fields.format == "srt") {
                                            var subtitle1 = new Subtitle ({
                                                urlSousTitres: path.join(pathOut,propperName) + ".srt",
                                                format: "srt" 
                                            })
            
                                            subtitle1.save(function(error,sub1) {
                                                if (error) _.response.sendError(res,error,500);
                                            })
                                        } else if (fields.format = "vtt") {
                                            var subtitle1 = new Subtitle ({
                                                urlSousTitres: path.join(pathOut,propperName) + ".vtt",
                                                format: "vtt" 
                                            })
            
                                            subtitle1.save(function(error,sub1) {
                                                if (error) _.response.sendError(res,error,500);
                                            })
            
                                        } else if (fields.format = "all") {
                                            var subtitle1 = new Subtitle ({
                                                urlSousTitres: path.join(pathOut,propperName) + ".srt",
                                                format: "srt" 
                                            })
                                
                                            var subtitle2 = new Subtitle ({
                                                urlSousTitres: path.join(pathOut,propperName) + ".vtt",
                                                format: "vtt" 
                                            })
            
                                            subtitle1.save(function(error,sub1) {
                                                if (error) _.response.sendError(res,error,500);
                                            })
            
                                            subtitle2.save(function(error,sub1) {
                                                if (error) _.response.sendError(res,error,500);
                                            })
            
                                        } else {
                                            _.response.sendError(res,"bad format selected", 500);
                                        }
                                    })
                                    }
                                }
                            ).stdout;
                        }
                    })
                    //even if the transcription isn't over, we redirect the user to home as the transcription could take a great amount of time.
                    _.response.sendSucces(req,res,'/home',"Succesfuly send the video to the server, waiting to get the transcription to generate subtitles.");
                    

                });
            });
            
        });
    });
}

exports.viewsUploadVideo = function(req,res){
    user.getGroupsFrom(req.session.user._id,function(error,result){
        if (error) {
            _.response.sendError(res,error,500);
        }
        console.log(result);

        res.render('addVideo.ejs',{groups: result});
    })
}
