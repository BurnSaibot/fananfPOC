var crypto = require('crypto');
var _ = require('./Utils');
var mUser = require('../models/User');
var User = require('./User');
const KEYLEN = 128;
const ITERATIONS = 12000;

exports.helper = {};

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

  exports.register = function(req,res,next) {
    console.log("on commence l'enregistrement");
    var failed = "Votre enregistrement à échouer, vérifiez que tous les champs ont bien été remplis"

    if (req.body.username === undefined || req.body.password === undefined 
        || req.body.surname === undefined || req.body.name === undefined) {
            //console.log(failed + " " + req.body.username + '\n' + req.body.password + '\n' + req.body.surname + '\n' + req.body.name);
            _.response.sendError(res,failed,400);
    }
    
    User.create(req,res);
    
  };

  exports.viewRegister = function(req,res,next) {
    res.render('register.ejs');
  };

  //login
  exports.login = function(req,res,next) {
      var missingInfo = "infos manquantes : veuillez remplir tous les champs correctement";
      var failed = "Votre connexion a échoué, vérifier vos login et password !";

      if (req.body.username === undefined || req.body.password === undefined) {
          _.response.sendError(res,missingInfo,401);
      }
      mUser.findOne({
        login: req.body.username
      },function(error,user) {

        //if error or no user, authentification faileure
        if( error || !user ) {
          _.response.sendError(res,failed,401);
          return;
        }

        getHash(req.body.password,user.salt, function(error,hash) {
          //console.log(hash);
          if (error || user.hash !== hash ) {
            _.response.sendError(res,failed,401);
            return;
          }
          req.session.regenerate(function(){
            req.session.user = user;
            
            _.response.sendSucces(req,res,'/home',"Authentication succeeded");
          });
        });
      });

  };

  exports.viewLogin = function(req,res,next) {
    res.render('connection.ejs');
  };

  // logout
  exports.logout = function (req, res) {
    req.session.destroy(
      _.response.sendSucces(req,res, '/',"Logged Out succesfuly !"));
  };

  exports.middleware = {};

  // user is logged in?
  exports.middleware.isLoggedIn = function (req, res, next) {
    if (!req.session.user) {
      _.response.sendError(res, "Access denied. You aren't connected  ", 401);
      return;
    }
    next();
  };