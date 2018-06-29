const nodemailer = require('nodemailer');

var myId = "";
const sendEmail=function(mailOptions){
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: '***',
			pass: '***'
		}
	});
	
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
};

module.exports = {
	sendEmail
};

