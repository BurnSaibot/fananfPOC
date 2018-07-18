var _ = require('./Utils');
var authentication = require('./Authentication');
var User = require('../models/User');

exports.create = function (req,res) {
    console.log("on commence à créer l'user");
    //Check username validity
    if ( req.body.username === undefined || req.body.username.length < 2 || req.body.username.indexOf(' ') > -1) {
        _.response.sendError(res, 'Invalid username.', 400);
        return;
    }

    if ( req.body.password === undefined || req.body.password.length < 8) {
        _.response.sendError(res, 'Invalid password.', 400);
        return;
    }

    authentication.helper.generateSaltAndHash(req.body.password,function(error, salt, hash) {
        //throw error if exists
        if (error) {
            _.response.sendError(res,'error in salt Generation',500);
            return;
        }
        
        //creating a new user
        var user = new User({
            login: req.body.username,
            nom: req.body.surname,
            prenom: req.body.name,
            salt: salt,
            hash: hash
        })

        user.save(function(error,user){
            //console.log("\n\n\n\n" + error);
            if (error && error.code === 11000) {
                //console.log("Error: " + error + "error code : " + error.code );
                error = 'Invalid login (duplicate)';
                _.response.sendError(res,error,500);
                return;
            } else if (error) {
                _.response.sendError(res,'error while saving the user',500);
                return;
            }
            _.response.sendSucces(req,res,'/',"Registration succeeded, let's connect now !");
        })
    })
}

var getAll = exports.getAll = function (req,res,callback) {
    //callback = function(result)
    User.find({},'nom prenom _id', function(error,result) {
        if( error ) {
            _.response.sendError(res,error,500);
            return;
        }
        callback(result);
        return;
    })
}

exports.displayAll = function(req,res) {
    getAll(req,res,function(result) {
        console.log(result);
        console.log(result.length);
        res.render('users.ejs',{users: result});
    })
} 