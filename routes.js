var authentication = require('./controllers/Authentication');
//
exports.initialize = function (app) {
    
app.get('/', function(req,res,next) {
    res.render('index.ejs',{lastAction: req.session.lastAction})
})

.get ('/register', authentication.viewRegister)


.get ('/connect',authentication.viewLogin)

.get('/home',function(req,res){
    res.render('menu.ejs',{lastAction: req.session.lastAction})
})

.post('/registering',authentication.register)

.post('/login-in',authentication.login)

.get('/logout',authentication.logout)

};