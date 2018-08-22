var _ = require('./Utils.js');
const readline = require('readline');
const fs = require('fs');
var path = require('path');

var mSubtitle = require('../models/Subtitle');
var mTranscription = require('../models/Transcription')

var extract = exports.extract = function(sub) {
    
    return new Promise(function(resolve,reject) {

        fs.readFile(sub.urlSousTitres,'utf-8',function(err,data){
            if (err) reject(err);
            //creating regexp to test each lines of the data
            const regNumber = new RegExp("^[0-9]{1,}$");
            const regTimecodeSrt = new RegExp("(([0-9]{2}:){2}[0-9]{2},[0-9]{3}) --> (([0-9]{2}:){2}[0-9]{2},[0-9]{3})");
            const regTimecodeVtt = new RegExp("(([0-9]{2}:){2}[0-9]{2}.[0-9]{3}) --> (([0-9]{2}:){2}[0-9]{2}.[0-9]{3})");
            const regEmpty = new RegExp("[a-zA-Z-0-9]");

            //on séparer chaque ligne du fichier de sous-titres
            var content = data.split("\n");
            var index = [];
            var timecode = [];
            var sub1 = [];
            var sub2 = [];
            var sub1Filled = false;
            var exportSub = [];
            for(var i=0; i<content.length ; i++) {
                if (content[i].includes("WEBVTT")){
                    continue
                }                
                else if (regNumber.test(content[i])) {
                    index.push(content[i]);
                } else if ( regTimecodeVtt.test(content[i]) || regTimecodeSrt.test(content[i])){
                    timecode.push(content[i]);
                } else if ( regEmpty.test(content[i])) {
                    if (sub1Filled) {
                        sub2.push(content[i]);
                    } else {
                        sub1.push(content[i]);
                    }
                    sub1Filled = !sub1Filled;
                } else {
                    //console.log("Not found : " + content[i]);
                }
            }

            if (sub.format == "vtt") {
                for (var i = 0; i<timecode.length;i++){
                    var subPush = {subTimeCode: timecode[i],sub1: sub1[i],sub2: sub2[i]};               
                    exportSub.push(subPush);
                }
            } else if (sub.format == "srt") {
                for (var i = 0; i<timecode.length;i++){
                    var subPush = {subIndex: index[i],subTimeCode: timecode[i],sub1: sub1[i],sub2: sub2[i]};               
                    exportSub.push(subPush);
                }
            }
            
            resolve(exportSub);
        });   
    });
}
//permet d'afficher le contenu d'un sous titre
exports.read = function(req,res,next) {
    mSubtitle.findById(req.params.id)
    .then(function(result){
        return extract(result);
    })
    .then(function(exportedSub){
        mSubtitle.findById(req.params.id,function(err,sub){
            if (err) _.response.sendError(res,err,500);
            res.render('subtitles.ejs',{sub: sub,subtitles: exportedSub})
        })    
    }).catch(function(err){
        _.response.sendError(res,err,500);
    })
    
}

// permet d'afficher le contenu d'un sous titre et de l'éditer
exports.edit = function(req,res,next) {
    mSubtitle.findById(req.params.id)
    .then(function(result){
        return extract(result);
    })
    .then(function(exportedSub){
        mSubtitle.findById(req.params.id,function(err,sub){
            if (err) _.response.sendError(res,err,500);
            res.render('subtitleEdit.ejs',{sub: sub,subtitles: exportedSub})
        })    
    }).catch(function(err){
        _.response.sendError(res,err,500);
    })
    
}

//permet de sauvegarder les changements effectués sur une page et d'envoyer un message en fonction de l'echec/du succès de l'opération
exports.save = function(req,res,next) {
    mSubtitle.findById(req.params.id)
    .then(function(subtitle){
        return new Promise (function(resolve,reject){
            var subFile = fs.createWriteStream(subtitle.urlSousTitres);
            subFile.on('error',function(err){
                reject(err);
            })
            var subContent = req.body.subContent;
            subContent.forEach(line => {
                subFile.write(line + "\n");
            });
            subFile.end();
        })
    })
    .catch(function(err){
        _.response.sendError(res,err,500);
    })
    res.send(JSON.stringify({status: "200",message: "La vidéo a correctement été sauvegardée"}));
}

//permet à l'utilisateur de télécharger un fichier 
exports.export = function(req,res,next) {
        mSubtitle.findById(req.params.id)
        .then(function(subtitle){
            res.download(subtitle.urlSousTitres);
        })
        .catch(function(err){
            _.response.sendError(res,err,500);
        })
         // Set disposition and send it.
}

//allow us to to get url of the video for a subtitle
exports.getVideoURL = function(sub_id){
    return new Promise (function(resolve,reject){
        mSubtitle.findById(sub_id)
        .then(function(sub){
            return mTranscription.findById(sub.transcription);
        })
        .then(function(transcription){
            resolve(transcription.urlVideo) 
        })
        .catch(function(err){
            console.log("Il y a une erreur dans C/Sub")
            reject(err)
        })
    })
}