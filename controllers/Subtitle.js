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
            var subs = [];
            var exportSub = [];
            console.log(content)
            for(var i=0; i<content.length ; i++) {
                if (regNumber.test(content[i])) {
                    console.log("number ok " + content[i]);
                    index.push(content[i]);
                } else if ( regTimecode.test(content[i])){
                    console.log("Timecode ok " + content[i])
                    timecode.push(content[i]);
                } else if ( regEmpty.test(content[i])) {
                    console.log("Content ok " + content[i])
                    subs.push(content[i]);
                } else {
                    //console.log("Not found : " + content[i]);
                }
            }
            for (var i = 0; i<index.length;i++){
                var subC = subs[2*i] + "\n" + subs[2*i + 1];
                var subPush = {subIndex: index[i],subTimeCode: timecode[i],subContent: subC};
                console.log(subPush);
                exportSub.push(subPush);
            }
            resolve(index);
        });   
    });
}

exports.test = function(req,res,next) {
    mSubtitle.findById(req.params.id)
    .then(function(result){
        return extract(result);
    })
    .then(function(index){
        console.log(index);
       _.response.sendSucces(req,res,'/home',"succesfully read the sub file (WIP)");
    }).catch(function(err){
        _.response.sendError(res,err,500);
    })
    
}