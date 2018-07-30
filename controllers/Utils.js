exports.response = {};
var fs = require('fs');

var sendError = exports.response.sendError = function (res,errorText,code) {
    if (code === undefined ) {
        code = 500;
    }

    res.status(code).json({error: errorText});
}

var sendSucces = exports.response.sendSucces = function(req,res,page,msgS) {
    req.session.lastAction = {status: "success",msg: msgS};
    res.redirect(page)
}
exports.helper = {};

exports.helper.mkdirSync = function (dirPath) { try { fs.mkdirSync(dirPath) } catch (err) { if (err.code !== 'EEXIST') throw err } } 
// if err.code = 'EEXIST', it means a video have alredy been uploaded & the file have ben created, we juste want to sort videos by grouping them for each group, so we can continue to work & don't care ?