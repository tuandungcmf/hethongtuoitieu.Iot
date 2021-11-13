const express = require("express");
const session = require('express-session')
const bodyParser = require('body-parser') 
const path = require("path");
const axios = require("axios");
const moment = require("moment");
const app = express();

var management = require("./management");
var auth = require("./auth");
var data = require("./create_data");
data.sampleDatabase();

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
app.use('/auth',auth);

app.listen(3000, () => { 
    console.log("Server started (http://localhost:3000/) !");
});

app.get('/login', function(req,res){
    res.render('login');
});

app.get('/', function(req, res) {
	if (req.session.loggedin) {
		console.log(req.session)
		res.render('index',{name: req.session.username});
	} else {
		res.render('login');
	}
	res.end();
});

app.get('/real', async(req, res) => {
	if (req.session.loggedin) {
		try {
			const response = await axios({
				url: "https://api.thingspeak.com/channels/1547368/feeds.json?api_key=P2HTP6ZOLAC6NJ5A&start=2021-11-01%2000:00:00&end=2021-11-05%2024:00:00&timezone=Asia%2FBangkok",
				method: "get",
			});
			var feeds = response.data.feeds
			res.render('real', {
				feeds: feeds,
				moment: moment,
				name: req.session.username
			});
		} catch (err) {
			res.status(500).json({ message: err });
		}
	}else{
		res.render('login');
	}
	res.end();
});