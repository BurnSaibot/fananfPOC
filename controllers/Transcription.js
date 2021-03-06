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
        if (err) _.response.sendError(res,err,500);
        var oldpath = files.videotoupload.path;
        var filename = files.videotoupload.name;
        var propperName = filename.trim();
        var propperFileName = propperName.replace(/\.[^/.]+$/, "");
        var newpath = path.join(__dirname, req.session.config.filePath , 'data', 'videos', fields.group, propperName);
        var pathOut = path.join(__dirname, req.session.config.filePath, 'data', 'subtitles', fields.group);
        var pathScript = path.join(__dirname, "../","scripts","videoToSub.sh");


        //now we have to create the file were we should store the videos & the subtitles
        _.helper.mkdirSync(pathOut);
        _.helper.mkdirSync(path.join(__dirname, req.session.config.filePath , 'data', 'videos', fields.group));


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
                    newTrans.save()
                    .then(function(tr) {
                        console.log("Saving subtitles");
                        return saveSubtitles(pathOut,propperFileName,fields.format,tr);
                    })
                    .then(function(tr_id){
                        console.log("Launching the script");
                        var script = "/bin/bash " + pathScript + " -f " + fields.format + " -i " + newpath + " -o " + pathOut;
                        return execScript(script,{silent: false},tr_id);
                    })
                    .then(function(tr_id) {
                        console.log("Everything should be good, so we are chaging status to \"Done\"");
                        //console.log("Id de la transcription" + tr_id);
                        return Transcription.findByIdAndUpdate(tr_id, {status: 'Done'});
                    })
                    .catch(function(tr_id) {
                        Transcription.findByIdAndUpdate(tr_id, {status: 'Failed'}, function(error2,updtTranscription){
                            if (error2) throw error2;
                        })
                        throw "Erreur lors de l'upload de la video pour la transcription: " + tr_id;
                    });
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
    Transcription.findById({_id: req.params.id }, function(err,tr) {
        if (err) _.response.sendError(res,err,500);
        mSubtitle.find({transcription: req.params.id }, function(err2,subtitlesFound) {
            if (err2) _.response.sendError(res,err2,500);
            res.render('transcription.ejs',{transcription: tr,subtitles: subtitlesFound});
        })
    })
}

exports.viewsEditOneTranscription = function(req,res) {
    Transcription.findById({_id: req.params.id}, function(err2,tr) {
        if (err2) {
            _.response.sendError(res,err2,500);
        } else {
            res.render('transcriptionEdit.ejs',{transcription: tr});
        }
    });
}

exports.updt = function(req,res) {
    Transcription.findByIdAndUpdate(req.params.id,{name: req.body.newName}, function(err,tr){
        if(err){
             _.response.sendError(res,err,500);
        } else {
            console.log("transcription updated redirecting to " + '/trancription/');
            res.redirect('/trancriptions');
        }
    })
}

var saveSubtitles = function(pathOut,propperName,format,tr) {
    return new Promise(function(resolve,reject) {
        //en fonction du format des sous titres, on doit créer différentes entrées dans la bdd
        if (format == "srt") {
            console.log(" Format : srt only");
            var subtitle1 = new mSubtitle ({
                urlSousTitres: path.join(pathOut,propperName) + ".srt",
                format: format,
                transcription: tr._id
            })

            subtitle1.save()
            .then(function(sub){
                resolve(sub.transcription);
            })
            .catch(function(error2) {
                Transcription.findByIdAndUpdate(tr._id, {status: 'Failed'}, function(error,updtTranscription){
                    if (error) reject(error);
                });
                reject(error2);
            });
        } else if (format == "vtt") {
            console.log("Format : vtt only");
            var subtitle1 = new mSubtitle ({
                urlSousTitres: path.join(pathOut,propperName) + ".vtt",
                format: format,
                transcription: tr._id
            })

            subtitle1.save()
            .then(function(sub){
                resolve(sub.transcription);
            })
            .catch(function(error2) {
                Transcription.findByIdAndUpdate(tr._id, {status: 'Failed'}, function(error,updtTranscription){
                    if (error) reject(error);
                });
                reject(error2);
            });

        } else if (format == "all") {
            console.log("Format : All");
            var subtitle1 = new mSubtitle ({
                urlSousTitres: path.join(pathOut,propperName) + ".srt",
                format: "srt",
                transcription: tr._id
            })

            var subtitle2 = new mSubtitle ({
                urlSousTitres: path.join(pathOut,propperName) + ".vtt",
                format: "vtt",
                transcription: tr._id
            })

            subtitle1.save()
            .then( subtitle2.save())
            .then(function(sub){
                resolve(sub.transcription);
            })
            .catch(function(error2) {
                Transcription.findByIdAndUpdate(tr._id, {status: 'Failed'}, function(error,updtTranscription){
                    if (error) reject(error);
                });
                reject(error2);
            });
            
                        
        } else {
            console.log("Script failed, updating the transcription to \"failed\"");
            reject(tr_id);
        }
    })
}

var execScript = function(script,mode,tr_id) {
    return new Promise (function(resolve,reject){
        shell.exec(script,mode,function(code,stdout,stderr) {
            console.log("Code: " + code);
            //Vérifying there wasn't any trouble with the script, then register all data in db
            
                if (code == 0) {
                    console.log("Updating the transcription on \"Done\"");
                    resolve(tr_id);
                } else {
                    reject(tr_id);
                }
            }
        )
    })
}
