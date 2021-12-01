const cfg = require('./config/config.global');
const express = require("express");
const axios = require("axios");
const moment = require("moment");
const real = express.Router();

//GET /real?1547368
real.get('/', async(req, res) => {
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
				url: cfg.server+"channels/"+channelId+"/feeds.json?api_key="+cfg.api+"&start="+startDate+" 00:00:00&end="+endDate//+" 24:00:00&timezone=Asia/Bangkok"
				,method: "get",
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
module.exports = real