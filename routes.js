
exports.initialize = function (app) {
    
app.get('/', function(req,res,next) {
    res.render('register.ejs');
});

};