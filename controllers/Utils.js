exports.response = {};

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