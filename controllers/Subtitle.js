var _ = require('./Utils.js');
var fs = require('fs');
var path = require('path');

var mSubtitle = require('../models/Subtitle');

var extract = exports.extract = function(sub) {
    return new Promise(function(resolve,reject) {
        fs.readFile(sub.urlSousTitres,function(err,data){
            if (err) reject(err);
            resolve(data)
        })

        
    })
}

exports.test = function(req,res,next) {
    mSubtitle.findById(req.params.id,function(err,result) {
        console.log(result);
        if (err) _.response.sendError(res,err,500);
        extract(result)
        .then(function(data){
            console.log(data);
        }).catch(function(err){
            _.response.sendError(res,err,500);
        })

    })
    
}