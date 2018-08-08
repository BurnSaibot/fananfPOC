var _ = require('./Utils.js');
var fs = require('fs');
var path = require('path');

var mSubtitle = require('../models/Subtitle');

var extract = exports.extract = function(sub) {
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
    .then(function(data){
        console.log(data);
        res.redirect('/home');
    }).catch(function(err){
        _.response.sendError(res,err,500);
    })
    
}