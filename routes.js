var authentication = require('./controllers/Authentication');
var user = require('./controllers/User')
//
exports.initialize = function (app) {
    
app.get('/', function(req,res,next) {
    res.render('index.ejs',{lastAction: req.session.lastAction})
})

.get ('/register', authentication.viewRegister)


.get ('/connect',authentication.viewLogin)

.get('/home',authentication.middleware.isLoggedIn,function(req,res){
    res.render('menu.ejs',{lastAction: req.session.lastAction})
})
.get('/users',authentication.middleware.isLoggedIn,user.displayAll)

.post('/registering',authentication.register)

.post('/login-in',authentication.login)

.get('/logout',authentication.middleware.isLoggedIn,authentication.logout)

};