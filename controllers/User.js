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
            //console.log("Error : " + error);
            _.response.sendError(res,'error in salt Generation',500);
            return;
        }
        
        //creating a new user
        //console.log("Creating user : "+ req.body.username + " " + req.body.password + " " + req.body.name + " " + req.body.surname );
        var user = new User({
            login: req.body.username,
            nom: req.body.surname,
            prenom: req.body.name,
            salt: salt,
            hash: hash
        })

        user.save(function(error,user){
            //console.log("\n\n\n\n" + error);
            console.log(user);
            if (error && error.code === 11000) {
                error = 'Invalid login (duplicate)';
                _.response.sendError(res,error,500);
            } else if (error) {
                _.response.sendError(res,'error while saving the user',500);
            }
            //_.response.sendSucces(res,"Registration was done");
            //req.session.lastAction = {status: "succes",msg: "Registration succeded, you now have to log-in"};
            res.redirect('/');
        })
    })

}