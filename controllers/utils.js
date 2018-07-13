
exports.response = {};

var sendError = exports.response.sendError = function (res, errorText, code) {
    if (code === undefined ) {
        code = 500;
    }

    res.status(code).json({error: errorText});
}