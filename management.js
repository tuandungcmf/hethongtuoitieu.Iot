var express = require('express')
var management = express.Router()

management.get('/', function(req, res) {
    if (req.session.loggedin) {
        res.render('management',{name: req.session.username});
    }else{
        res.render('login');
    }
    res.end();
});

module.exports = management