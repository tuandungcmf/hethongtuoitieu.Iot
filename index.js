const express = require("express");
const session = require('express-session')
const bodyParser = require('body-parser') 
const path = require("path");
const app = express();

var management = require("./management");
var real = require("./real");
var auth = require("./auth");
var data = require("./create_data");
data.createDatabase();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use('/management',management);
app.use('/real', real);
app.use('/auth',auth);

app.listen(3000, () => { 
    console.log("Máy chủ đang hoạt động với địa chỉ (http://localhost:3000/) !");
});

app.get('/login', function(req,res){
    res.render('login');
});

app.get('/', function(req, res) {
	if (req.session.loggedin) {
		res.render('index',{name: req.session.username});
	} else {
		res.render('login');
	}
	res.end();
});

app.get('/resource', function(req, res) {
	if (req.session.loggedin) {
		res.render('resource',{name: req.session.username});
	} else {
		res.render('login');
	}
	res.end();
});