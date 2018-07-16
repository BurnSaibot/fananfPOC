var authentication = require('./controllers/Authentication')

exports.initialize = function (app) {
    
app.get('/', function(req,res,next) {
    res.render('index.ejs')
})

.get ('/register', authentication.viewRegister)


.get ('/connect',function(req,res,next){
    res.end("WIP");
})
.post('/registering',authentication.register)

.post('/login-in', function(req,res,next){
    res.end("WIP");
})
};