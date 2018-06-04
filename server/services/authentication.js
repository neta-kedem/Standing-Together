const Activist = require('../models/activistModel');

const getUserByToken=function(req, res){
	const token = req.cookies.token
	const query = Activist.findOne({'login.token':token});
	const userPromise = query.exec().then((user) => {
		if(!user)
		{
			return {"error":"missing token"};
		}
		return user;
	});
	return userPromise;
};

const isUser = function(req, res){
	const promise = (
		getUserByToken(req, res)
		.then(user=>{
			if(user.error)
				return false;
			else
				return true;
		})
	);
	return promise;
}

module.exports = {
isUser,
getUserByToken
};

