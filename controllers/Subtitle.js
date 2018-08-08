var _ = require('./Utils.js');
const readline = require('readline');
const fs = require('fs');
var path = require('path');

var mSubtitle = require('../models/Subtitle');

var extract = exports.extract = function(sub) {
    const regNumber = "^\d{1,}$";
    const regTimecode = "((\d{2}:){2}\d{2},\d{3})";
    const regNonEmpty = "^\w";
    return new Promise(function(resolve,reject) {
        fs.readFile(sub.urlSousTitres,'utf-8',function(err,data){
            
            if (err) reject(err);
            //on séparer chaque ligne du fichier de sous-titres
            var content = data.split("\n");
            var index = [];
            var timecode = [];
            var subs = [];

            var i=-1;

            var loop = function(content,index,timecode,subs){
                
                i++;

                if(i<content.length) {
                    if (content[i].test(regNumber)) {

                        index.push(content[i]);
                    } else if ( content[i].test(regTimecode)){

                        timecode.push(content[i]);
                    } else if ( content[i].test(regNonEmpty)) {

                        subs.push(content[i]);
                    }
                } else {

                    resolve(index,timecode,subs);
                }
            }

            loop();
        });   
    });
}

exports.test = function(req,res,next) {
    mSubtitle.findById(req.params.id)
    .then(function(result){
        return extract(result);
    })
    .then(function(index,timecode,content){
        console.log("Index : \n" + index);
        console.log("Timecode : \n" + timecode);
        console.log("Contenu : \n" + content);
        res.redirect('/home');
    }).catch(function(err){
        _.response.sendError(res,err,500);
    })
    
}