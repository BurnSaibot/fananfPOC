var _ = require('./Utils.js');
const readline = require('readline');
const fs = require('fs');
var path = require('path');

var mSubtitle = require('../models/Subtitle');

var extract = exports.extract = function(sub) {
    
    return new Promise(function(resolve,reject) {

        fs.readFile(sub.urlSousTitres,'utf-8',function(err,data){
            if (err) reject(err);
            const regNumber = new RegExp("^[0-9]{1,}$");
            
            if (sub.format == "vtt") {
                const regTimecode = new RegExp("(([0-9]{2}:){2}[0-9]{2}.[0-9]{3}) --> (([0-9]{2}:){2}[0-9]{2}.[0-9]{3})");
            } else if (sub.format == "srt") {
                const regTimecode = new RegExp("(([0-9]{2}:){2}[0-9]{2},[0-9]{3}) --> (([0-9]{2}:){2}[0-9]{2},[0-9]{3})");
            } else {
                reject("Bad formart, unreadable")
            }
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
                if (content[i].includes("webVTT")){
                    continue
                }                
                else if (regNumber.test(content[i])) {
                    index.push(content[i]);
                } else if ( regTimecode.test(content[i])){
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
                for (var i = 0; i<index.length;i++){
                    var subPush = {subTimeCode: timecode[i],sub1: sub1[i],sub2: sub2[i]};               
                    exportSub.push(subPush);
                }
            } else if (sub.format == "srt") {
                for (var i = 0; i<index.length;i++){
                    var subPush = {subIndex: index[i],subTimeCode: timecode[i],sub1: sub1[i],sub2: sub2[i]};               
                    exportSub.push(subPush);
                }
            }
            
            resolve(exportSub);
        });   
    });
}

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

exports.save = function(req,res,next) {
    console.log(req.body.subContent);
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
    res.send(JSON.stringify({status: "ok"}));
}

exports.export = function(req,res,next) {
    _.response.sendSucces(req,res,'/home',"Export : currently in progress");
}