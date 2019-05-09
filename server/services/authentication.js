const Activist = require('../models/activistModel');

let myId = "";
const getUserByToken=function(req){
	const token = req.cookies.token;
	if(!token)
	{
		return new Promise(()=>{
			return {"error":"missing token"};
		});
	}
	const query = Activist.findOne({'login.token':token});
	const userPromise = query.exec().then((user) => {
		if(!user)
		{
			return {"error":"missing token"};
		}
		myId = user["_id"];
		return user;
	});
	return userPromise;
};

const isUser = function(req, res){
	const promise = (
		getUserByToken(req, res)
		.then(user=>{
			return !user.error;
		})
	);
	return promise;
};
const hasRole = function(req, res, role){
	const promise = (
		getUserByToken(req, res)
		.then(user=>{
			if(user.error)
				return false;
			let roles = [];
			if(Array.isArray(role)){
				roles = role;
			}
			else{
				roles.push(role);
			}
			for(let i = 0; i < roles.length; i++){
				if(!!user.role[roles[i]])
					return true;
			}
			return false;
		})
	);
	return promise;
};

const getMyId = function(){
	return myId;
};

module.exports = {
	isUser,
	hasRole,
	getUserByToken,
	getMyId
};

