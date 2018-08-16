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
            const regTimecode = new RegExp("(([0-9]{2}:){2}[0-9]{2},[0-9]{3}) --> (([0-9]{2}:){2}[0-9]{2},[0-9]{3})");
            const regEmpty = new RegExp("[a-zA-Z-0-9]");
            //on séparer chaque ligne du fichier de sous-titres
            var content = data.split("\n");
            var index = [];
            var timecode = [];
            var sub1 = [];
            var sub2 = [];
            var sub1Filled = false;
            var exportSub = [];
            console.log(content)
            for(var i=0; i<content.length ; i++) {
                if (content[i].includes("webVTT")){
                    continue
                }                
                else if (regNumber.test(content[i])) {
                    console.log("number ok " + content[i]);
                    index.push(content[i]);
                } else if ( regTimecode.test(content[i])){
                    console.log("Timecode ok " + content[i])
                    timecode.push(content[i]);
                } else if ( regEmpty.test(content[i])) {
                    if (sub1Filled) {
                        sub2.push(content[i]);
                    } else {
                        sub1.push(content[i]);
                    }
                    sub1Filled = !sub1Filled;
                    console.log("SubFilled");
                } else {
                    //console.log("Not found : " + content[i]);
                }
            }
            for (var i = 0; i<index.length;i++){
                    var subPush = {subIndex: index[i],subTimeCode: timecode[i],sub1: sub1,sub2: sub2};
                
                exportSub.push(subPush);
            }
            resolve(exportSub);
        });   
    });
}

exports.edit = function(req,res,next) {
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

exports.export = function(req,res,next) {
    _.response.sendSucces(req,res,'/home',"Export : currently in progress");
}