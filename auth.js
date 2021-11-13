var express = require('express')
var auth = express.Router()

auth.post('/', async(request, response) => {
	var username = request.body.username;
	var password = request.body.password;
    
	if (username && password) {
		if(username=='admin' && password=='1234'){
			request.session.loggedin = true;
			request.session.username = username;
			response.redirect('/');
		} else {
			response.send('Incorrect Username and/or Password!');
		}			
		response.end();
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


module.exports = auth