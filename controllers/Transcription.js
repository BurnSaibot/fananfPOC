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
            status: false,
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
                                            var subtitle1 = new mSubtitle ({
                                                urlSousTitres: path.join(pathOut,propperName) + ".srt",
                                                format: "srt" 
                                            })
            
                                            subtitle1.save(function(error,sub1) {
                                                if (error) _.response.sendError(res,error,500);
                                            })
                                        } else if (fields.format = "vtt") {
                                            var subtitle1 = new mSubtitle ({
                                                urlSousTitres: path.join(pathOut,propperName) + ".vtt",
                                                format: "vtt" 
                                            })
            
                                            subtitle1.save(function(error,sub1) {
                                                if (error) _.response.sendError(res,error,500);
                                            })
            
                                        } else if (fields.format = "all") {
                                            var subtitle1 = new mSubtitle ({
                                                urlSousTitres: path.join(pathOut,propperName) + ".srt",
                                                format: "srt" 
                                            })
                                
                                            var subtitle2 = new mSubtitle ({
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
        res.render('addVideo.ejs',{groups: result});
    })
}

exports.viewsTranscriptions = function(req,res) {
    user.getAvailableTranscriptions(req.session.user._id,function(error,transcrips) {
        if (error) _.response.sendError(res,error,500);
        console.log(transcrips)
        res.render('transcriptions.ejs',{transcriptions: transcrips})
    })
}

var getSub = exports.getSubtitlesFrom = function(id_transcription,callback) {
    //callback(error,subtitles)
    var sub = [];
    
    Transcription.findById(id_transcription, function(error,transcription){
        console.log("id:" + id_transcription);
        if (error) _.response.sendError(res,error,500);
        console.log("Transcription : " + id_transcription);
        transcription.subTitles.forEach(function(subtitle,index){
            console.log("id subtile" + subtitle);
            mSubtitle.find({_id: subtitle},function(err,subContent){
                if (err) _.response.sendError(res,err,500);
                console.log("SubContent : "+ subContent);
                sub.push(subContent)
            });
        });
        console.log(sub);
        callback(error,sub);
    }); 
}

exports.viewsOneTranscription = function(req,res) {
    Transcription.findById(req.params.id,function(err, transcript){
        if (err) _.response.sendError(res,err,500);
        getSub(transcript._id,function(err2,sub) {
            if (err2) _.response.sendError(res,err2,500);
            //console.log(sub);
            res.render('transcription.ejs',{transcription: transcript,subtitles: sub});
        })
    })
}