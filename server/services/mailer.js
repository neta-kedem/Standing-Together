const nodeMailer = require('nodemailer');
const sendEmail=function(mailOptions){
	const transporter = nodeMailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.emailUserName,
			pass: process.env.emailPassword
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

