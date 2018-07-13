var _ = require('./Utils');
var authentication = require('./Authentication');
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

    _.helper.generateSaltAndHash(req.body.password,function(error, salt, hash) {
        //throw error if exists
        if (error) {
            _.response.sendError(res,error,500);
            return;
        }

        //creating a new user
        console.log("Creating user : "+ req.body.username + " " + req.body.password + " " + req.body.name + " " + req.body.surname );
        var user = new user({
            login: req.body.username,
            nom: req.body.surname,
            prenom: req.body.name,
            salt: salt,
            hash: hash
        })

        user.save(function(error,user){
            if (error && error.code === 11000) {
                error = 'Invalid login (duplicate)'
            } else if (error) {
                _.response.sendError(res,'undefined',error);
            }

            res.redirect('/');
        })
    })

}