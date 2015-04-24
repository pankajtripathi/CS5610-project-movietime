var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); 
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var mongoose      = require('mongoose');

var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/myproject';
mongoose.connect(connectionString);

var UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
	username: String,
    password: String
});

var MovSchema = new mongoose.Schema({
	username: String,
	favMovies: Object
});

var MovModel = mongoose.model('MovModel',MovSchema);

var UserModel = mongoose.model('UserModel', UserSchema);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(session({ secret: 'this is the secret' }));
app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

passport.use(new LocalStrategy(
function(username, password, done)
{
    UserModel.findOne({username: username, password: password}, function(err, user)
    {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
    })
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.post("/login", passport.authenticate('local'), function(req, res){
    var user = req.user;
    console.log(user);
    res.json(user);
});

app.get('/loggedin', function(req, res)
{
    res.send(req.isAuthenticated() ? req.user : '0');
});
    
app.post('/logout', function(req, res)
{
    req.logOut();
    res.send(200);
});     

app.post('/register', function(req, res)
{
    var newUser = req.body;
 
    UserModel.findOne({username: newUser.username}, function(err, user)
    {
        if(err) { return next(err); }
        if(user)
        {
            res.json(null);
            return;
        }
        var newUser = new UserModel(req.body);
        newUser.save(function(err, user)
        {
            req.login(user, function(err)
            {
                if(err) { return next(err); }
                res.json(user);
            });
        });
    });
});

app.put("/update", function (req, res) {
	UserModel.where('username', req.body.username).update({ $set: { firstname: req.body.firstname, lastname: req.body.lastname, password: req.body.password, email: req.body.email }}, function (err, count) {
		res.json(req.body);
	});
});

app.post('/favMovies',function(req, res){
	
	var mov = new MovModel(req.body);
	var user = req.body.username;
	mov.save(function (err, doc) {
	console.log(mov);
    MovModel.find({username: user},function (err, data) {
    	res.json(data);
    });
	});
});

app.get('/favMovies/:user', function (req, res) {
	var user = req.params.user;
    MovModel.find({username: user} ,function (err, data) {
    res.json(data);
    });
});

app.delete('/favMovies/:user/:movid',function(req, res){
	var user = req.params.user;
	var mid = req.params.movid;
	console.log(mid);
	console.log(user);
	
	MovModel.findOneAndRemove({username:user,_id:mid}, function (err, doc) {
	console.log(doc);
    MovModel.find({username: user},function (err, data) {		
    	res.json(data);
    });
	});
});


var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port= process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ip);
