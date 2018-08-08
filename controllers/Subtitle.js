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
            console.log(data);
            //resolve(data);
        })

        
    })
}

exports.test = function(req,res,next) {
    mSubtitle.findById(req.params.id)
    .then(function(result){
        return extract(result);
    })
    .then(function(index,timecode,content){
        console.log(index);
        console.log(timecode);
        console.log(content);
        res.redirect('/home');
    }).catch(function(err){
        _.response.sendError(res,err,500);
    })
    
}