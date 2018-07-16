var crypto = require('crypto');
var _ = require('./Utils');
var User = require('./User');
var mUser = require ('../models/User');
exports.helper = {};
var KEYLEN = 128;
var ITERATIONS = 12000;

// Get password hash using provided salt
var getHash = function (password, salt, callback) {
    // password: user password
    // salt: user salt
    // callback: function (error, hash)
    
    try {
      crypto.pbkdf2(password, salt, ITERATIONS, KEYLEN,'sha256', function (error, buffer) {
        var hash = buffer.toString('base64');
        callback(error, hash);
      });
    } catch (error) {
      callback(error);
    }
  
  };
  
  // Get password hash using random salt
  exports.helper.generateSaltAndHash = function (password, callback) {
    // password: user password
    // callback: function (error, salt, hash)
    
    crypto.randomBytes(KEYLEN, function (error, buffer) {
      if (error) {
        callback(error);
      } else {
        var salt = buffer.toString('base64');
        
        getHash(password, salt, function (error, hash) {
          callback(error, salt, hash);
        });
      }
    });
  };


  //Routes

  exports.register = function(req,res) {
    console.log("on commence l'enregistrement");
    var failed = "Votre enregistrement à échouer, vérifiez que tous les champs ont bien été remplis"

    //res.end('WIP');

    console.log(req.body.username + '\n' + req.body.password + '\n' + req.body.surname + '\n' + req.body.name);
    if (req.body.username === undefined || req.body.password === undefined 
        || req.body.surname === undefined || req.body.name === undefined) {
            console.log(failed + " " + req.body.username + '\n' + req.body.password + '\n' + req.body.surname + '\n' + req.body.name);
            _.response.sendError(res,failed,400);
    }

    User.create(req,res);


  }
  exports.viewRegister = function(req,res,next) {
    res.render('register.ejs');
  }

  exports.login = function(req,res) {
      var failed = "Votre connexion a échoué, vérifier vos login et password !"

      if (req.body.username === undefined || req.body.password === undefined) {
          _.response.sendError(res,failed,401);
      }
  }