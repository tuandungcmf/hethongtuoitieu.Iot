const cfg = require('./config/config.global');
const axios = require("axios");
const moment = require("moment");
const lodash = require('lodash');
const express = require('express');
const management = express.Router();

management.get('/', function(req, res) {
    if (req.session.loggedin) {
        res.render('management',{name: req.session.username});
    }else{
        res.render('login');
    }
    res.end();
});

management.get('/electric', async(req, res) => {
    // khởi tạo đối tượng thời gian
	let date_ob = new Date();

	// tháng hiện tại
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

	// năm hiện tại
	let year = date_ob.getFullYear();

	// ngày cuối cùng của tháng
	let lastDayOfMonth = new Date(date_ob.getFullYear(), date_ob.getMonth()+1, 0);

	let startDate = year+"-"+month+"-01";
	let endDate =year+"-"+month+"-"+lastDayOfMonth.getDate();
	let channelId= 1547368 //req.query.channelId;

    if (req.session.loggedin) {
        try {
			const response = await axios({
				url: cfg.server+"channels/"+channelId+"/fields/4.json?api_key="+cfg.api+"&start="+startDate+" 00:00:00&end="+endDate+" 24:00:00&timezone=Asia/Bangkok",
				method: "get",
			});
			res.render('electric', {
				feeds: response.data.feeds,
				name: req.session.username,
                moment: moment,
                lodash: lodash 
			});
		} catch (err) {
			res.status(500).json({ message: err });
		}
    }else{
        res.redirect('/');
    }
    res.end();
});

management.get('/water', async(req, res) => {
    // khởi tạo đối tượng thời gian
	let date_ob = new Date();

	// tháng hiện tại
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

	// năm hiện tại
	let year = date_ob.getFullYear();

	// ngày cuối cùng của tháng
	let lastDayOfMonth = new Date(date_ob.getFullYear(), date_ob.getMonth()+1, 0);

	let startDate = year+"-"+month+"-01";
	let endDate =year+"-"+month+"-"+lastDayOfMonth.getDate();
	let channelId= 1547368 //req.query.channelId;

    if (req.session.loggedin) {
        try {
			const response = await axios({
				url: cfg.server+"channels/"+channelId+"/fields/4.json?api_key="+cfg.api+"&start="+startDate+" 00:00:00&end="+endDate+" 24:00:00&timezone=Asia/Bangkok",
				method: "get",
			});
			res.render('water', {
				feeds: response.data.feeds,
				name: req.session.username,
                moment: moment,
                lodash: lodash 
			});
		} catch (err) {
			res.status(500).json({ message: err });
		}
    }else{
        res.redirect('/');
    }
    res.end();
});
management.get('/time', async(req, res) => {
    if (req.session.loggedin) {
        res.render('time',{name: req.session.username});
    }else{
        res.redirect('/');
    }
    res.end();
});

module.exports = management