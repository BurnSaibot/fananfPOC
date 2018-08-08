var _ = require('./Utils.js');
const readline = require('readline');
const fs = require('fs');
var path = require('path');

var mSubtitle = require('../models/Subtitle');

var extract = exports.extract = function(sub) {
    
    return new Promise(function(resolve,reject) {

        fs.readFile(sub.urlSousTitres,'utf-8',function(err,data){
            if (err) reject(err);
            const regNumber = "^\d{1,}$";
            const regTimecode = "((\d{2}:){2}\d{2},\d{3})";
            const regNonEmpty = "^\w";
            //on séparer chaque ligne du fichier de sous-titres
            var content = data.split("\n");
            var index = [];
            var timecode = [];
            var subs = [];
            return fillup(0,content,index,timecode,subs);
        });   
    });
}

var fillup = function(i,content,index,timecode,subs) {
        return new Promise(function(resolve,reject){
            console.log("In fillup index : " + i);
            if (i<content.length) {
                if (content[i].test(regNumber)) {
                    index.push(content[i]);
                } else if ( content[i].test(regTimecode)){
                    timecode.push(content[i]);
                } else if ( content[i].test(regNonEmpty)) {
                    subs.push(content[i]);
                }
                fillup(i+1,content,index,timecode,subs);
        } else {
            console.log("Index : \n" + index);
            console.log("Timecode : \n" + timecode);
            console.log("Contenu : \n" + content);
            resolve(index,timecode,subs);
        }
    });
}
exports.test = function(req,res,next) {
    mSubtitle.findById(req.params.id)
    .then(function(result){
        return extract(result);
    })
    .then(function(index,timecode,content){
        res.redirect('/home');
    }).catch(function(err){
        _.response.sendError(res,err,500);
    })
    
}