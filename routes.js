var authentication = require('./controllers/Authentication');
//
exports.initialize = function (app) {
    
app.get('/', function(req,res,next) {
    res.render('index.ejs')
})

.get ('/register', authentication.viewRegister)


.get ('/connect',authentication.viewLogin)

.get('/home',function(){res.end("wip")})
.post('/registering',authentication.register)

.post('/login-in',authentication.login);
};