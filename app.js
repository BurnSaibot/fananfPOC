var http = require('http');
var express = require('express');


var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);

var routes = require('./routes.js');

var app = express();
var config = require('./config/' + process.argv[2] + '.js');

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(cookieParser());
app.use(session({secret: 'fananftopsecretsessioncookie',saveUninitialized: false, resave: true, cookie: { secure: false }}));
//granting acces to config everywhere in the app
app.use(function(req,res,next) {
    if (req.session.lastAction === undefined) {
        req.session.lastAction = {status: 'none',msg: 'none'}
    } else {
        //console.log(req.session.lastAction);
        //console.log(req.session.user)
    }
    req.session.config = config;
    console.log(req.url)
    next();
});
//parser to get infos with expres while posting data
app.use(bodyParser.json({
    // limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    // limit: '50mb',
    extended: true
}));


//===== DB connection =====
mongoose.connect(config.db, function(err){
    if (err) throw err;
});
//'mongodb://' + mongodb_host + ':' + mongodb_port + '/' + mongodb_name);

mongoose.set('debug', false);

//calling the routes & waiting for request
routes.initialize(app);


//launching the server
app.listen(port,function(err){
    if (err) console.log(err);
    else console.log("Server launched & listening on port " + port);
})
