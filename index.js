const cfg = require('./config/config.global');
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

//GET /real?1547368
app.get('/real', async(req, res) => {
	// khởi tạo đối tượng thời gian
	let date_ob = new Date();

	// tháng hiện tại
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

	// năm hiện tại
	let year = date_ob.getFullYear();

	// ngày cuối cùng của tháng
	var lastDayOfMonth = new Date(date_ob.getFullYear(), date_ob.getMonth()+1, 0);

	let startDate = year+"-"+month+"-01";
	let endDate =year+"-"+month+"-"+lastDayOfMonth.getDate();
	let channelId= 1547368 //req.query.channelId;

	if (req.session.loggedin) {
		try {
			const response = await axios({
				url: cfg.server+"channels/"+channelId+"/feeds.json?api_key="+cfg.api+"&start="+startDate+" 00:00:00&end="+endDate+" 24:00:00&timezone=Asia/Bangkok",
				method: "get",
			});
			var feeds = response.data.feeds
			res.render('real', {
				feeds: feeds,
				moment: moment,
				name: req.session.username,
				month: month
			});
		} catch (err) {
			res.status(500).json({ message: err });
		}
	}else{
		res.render('login');
	}
	res.end();
});