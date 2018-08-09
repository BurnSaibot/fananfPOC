var _ = require('./Utils.js');
const readline = require('readline');
const fs = require('fs');
var path = require('path');

var mSubtitle = require('../models/Subtitle');

var extract = exports.extract = function(sub) {
    
    return new Promise(function(resolve,reject) {

        fs.readFile(sub.urlSousTitres,'utf-8',function(err,data){
            if (err) reject(err);
            const regNumber = new RegExp("^\d{1,}$");
            const regTimecode = new RegExp("((\d{2}:){2}\d{2},\d{3}) --> ((\d{2}:){2}\d{2},\d{3})");
            const regEmpty = new RegExp("");
            //on séparer chaque ligne du fichier de sous-titres
            var content = data.split("\n");
            var index = [];
            var timecode = [];
            var subs = [];
            console.log(content)
            console.log("123 .test("+regNumber+") : " + "123".test(regNumber));
            for(var i=0; i<content.length ; i++) {
                if (regNumber.test(content[i])) {
                    console.log("number ok " + content[i]);
                    index.push(content[i]);
                } else if ( regTimecode.test(content[i])){
                    console.log("Timecode ok " + content[i])
                    timecode.push(content[i]);
                } else if ( !regEmpty.test(content[i])) {
                    console.log("Content ok " + content[i])
                    subs.push(content[i]);
                } else {
                    console.log("Not found : " + content[i]);
                }
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
        res.redirect('/home');
    }).catch(function(err){
        _.response.sendError(res,err,500);
    })
    
}