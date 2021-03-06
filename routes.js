var authentication = require('./controllers/Authentication');
var user = require('./controllers/User.js');
var group = require('./controllers/Group.js');
var transcription = require('./controllers/Transcription.js');
var subtitle = require ('./controllers/Subtitle.js')
var video = require ('./controllers/Video.js')
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
.get('/groups',authentication.middleware.isLoggedIn,group.viewsMyGroups)
.get('/group/:id',authentication.middleware.isLoggedIn,group.viewsMembers)

.get('/users',authentication.middleware.isLoggedIn,user.displayAll)
.get('/user/:id',authentication.middleware.isLoggedIn,user.displayOne)
.get('/user',authentication.middleware.isLoggedIn,user.showUser)

.get('/transcriptions/new',authentication.middleware.isLoggedIn,transcription.viewsUploadVideo)
.get('/transcriptions',authentication.middleware.isLoggedIn,transcription.viewsTranscriptions)
.get('/transcription/:id',authentication.middleware.isLoggedIn,transcription.viewsOneTranscription)
.get('/transcription/:id/edit',authentication.middleware.isLoggedIn,transcription.viewsEditOneTranscription)

.get('/subtitle/:id',authentication.middleware.isLoggedIn,subtitle.read)
.get('/subtitle/edit/:id',authentication.middleware.isLoggedIn,subtitle.edit)
.get('/subtitle/export/:id/',authentication.middleware.isLoggedIn,subtitle.export)

.get('/video/:id',authentication.middleware.isLoggedIn,video.stream)

.post('/transcription/:id/updt',authentication.middleware.isLoggedIn,transcription.updt)
.post('/transcription/videoupload',authentication.middleware.isLoggedIn,transcription.register)

.post('/subtitle/edit/save/:id',authentication.middleware.isLoggedIn,subtitle.save)

.post('/register',authentication.register)
.post('/login-in',authentication.login)
.get('/logout',authentication.middleware.isLoggedIn,authentication.logout)

};