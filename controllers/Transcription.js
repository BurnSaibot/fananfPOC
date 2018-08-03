var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
const shell = require('shelljs');


var _ = require('./Utils.js');
var Transcription = require('../models/Transcription');
var user = require('./User');
var mSubtitle = require('../models/Subtitle')

exports.register = function(req,res) {
    var form = new formidable.IncomingForm();
    //parsing the form
    form.parse(req, function (err, fields, files) {
        var oldpath = files.videotoupload.path;
        var filename = files.videotoupload.name;
        var propperName = filename.trim();
        var newpath = path.join(__dirname, req.session.config.filePath , 'data', 'videos', fields.group, propperName);
        var pathOut = path.join(__dirname, req.session.config.filePath, 'data', 'subtitles', fields.group);
        var pathScript = path.join(__dirname, "../","scripts","videoToSub.sh");
        //now we have to create the file were we should store the videos & the subtitles
        _.helper.mkdirSync(pathOut);
        _.helper.mkdirSync(path.join(__dirname, req.session.config.filePath , 'data', 'videos', fields.group));
        console.log("\n\n\n\n Format : " + fields.format + "\n\n\n\n");
        //now we create the transcription
        var newTrans = new Transcription({
            name: propperName,
            group: fields.group,
            urlVideo: newpath,
            status: 'On Going',
            sousTitres: []
        })

        
        //reading the video then launch the script to get transcription
        fs.readFile(oldpath,function(err,data) {
            if (err) _.response.sendError(res,err,500);
            fs.writeFile(newpath,data,function(err) {
                if (err) _.response.sendError(res,err,500);
                console.log("File uploaded & moved");
                //moving the temporary file to the good place : /data/videos/idgroup
                fs.unlink(oldpath, function(err) {
                    if (err) _.response.sendError(res,err,500);
                    console.log("Saving the transcription before working on the video");
                    newTrans.save(function(error,transcription) {
                        //saving the transcription in the bdd & then wait for the script to create subtile files
                        if (error) {
                            Transcription.findByIdAndUpdate(transcription._id, {status: 'Failed'}, function(error2,updtTranscription){
                                if (error2) throw error2;
                            })
                        } else {
                            // executing the script to get transcription
                            console.log("Launching the script on the Video to get subtitles");
                            shell.exec("/bin/bash " + pathScript + " -f " + fields.format + " -i " + newpath + " -o " + pathOut ,{silent: true},function(code,stdout,stderr) {
                                console.log("Code: " + code);
                                //Vérifying there wasn't any trouble with the script, then register all data in db
                                if (code == 0) {
                                    console.log("Updating the transcription on \"Done\"");
                                    Transcription.findByIdAndUpdate(transcription._id, {status: 'Done'}, function(error,updtTranscription){
                                        if (error) _.response.sendError(res,error,500);
                                        //then we save the different transcription in the db, depending on the format
                                        console.log("Saving the generated subtitles in db ");
                                        if (fields.format == "srt") {
                                            console.log(" Format : srt only");
                                            var subtitle1 = new mSubtitle ({
                                                urlSousTitres: path.join(pathOut,propperName) + ".srt",
                                                format: "srt",
                                                transcription: updtTranscription._id
                                            })
            
                                            subtitle1.save(function(error,sub1) {
                                                if (error) _.response.sendError(res,error,500);
                                            })
                                        } else if (fields.format == "vtt") {
                                            console.log("Format : vtt only");
                                            var subtitle1 = new mSubtitle ({
                                                urlSousTitres: path.join(pathOut,propperName) + ".vtt",
                                                format: "vtt",
                                                transcription: updtTranscription._id
                                            })
            
                                            subtitle1.save(function(error,sub1) {
                                                if (error) _.response.sendError(res,error,500);
                                            })
            
                                        } else if (fields.format == "all") {
                                            console.log("Format : All");
                                            var subtitle1 = new mSubtitle ({
                                                urlSousTitres: path.join(pathOut,propperName) + ".srt",
                                                format: "srt",
                                                transcription: updtTranscription._id 
                                            })
                                
                                            var subtitle2 = new mSubtitle ({
                                                urlSousTitres: path.join(pathOut,propperName) + ".vtt",
                                                format: "vtt",
                                                transcription: updtTranscription._id 
                                            })
                                            
                                            subtitle1.save()
                                            .then( subtitle2.save() )
                                            .catch(function(err) {
                                                throw err
                                            });
                                            
                                                        
                                        } else {
                                            console.log("Script failed, updating the transcription to \"failed\"");
                                            Transcription.findByIdAndUpdate(transcription._id, {status: 'Failed'}, function(error,updtTranscription){
                                                if (error) throw err
                                            });
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
        res.render('addVideo.ejs',{groups: result});
    })
}

exports.viewsTranscriptions = function(req,res) {
    user.getAvailableTranscriptions(req.session.user._id,function(error,transcrips) {
        if (error) _.response.sendError(res,error,500);
        res.render('transcriptions.ejs',{transcriptions: transcrips})
    })
}

exports.viewsOneTranscription = function(req,res) {
    console.log("Id de la transcription à trouver : " + req.params.id);
    mSubtitle.find({transciption: req.params.id}).then( (subtitles) => {
        console.log("subtitles found for id " + req.params.id + " : \n" + subtitles);
        res.render('transcription',{transciption: transcript,subtitles: subtitles})
    }, (err) => {
        _.response.sendError(res,err,500);
    })
}
