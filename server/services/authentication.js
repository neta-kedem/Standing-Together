const Activist = require('../models/activistModel');
const MongooseUpdater = require('../services/dbHelper/mongooseUpdater');

let myId = "";
const getUserByToken = function(req){
	const token = req.cookies.token;
	if(!token)
	{
		return new Promise(()=>{
			return {"error":"missing token"};
		});
	}
	const query = Activist.findOne({'login.token.token': token});
	const userPromise = query.exec().then((user) => {
		updateLastTokenUsage(user["_id"], token);
		if(!user)
		{
			return {"error":"missing token"};
		}
		myId = user["_id"];
		return user;
	});
	return userPromise;
};

const updateLastTokenUsage = function(id, token){
	const now = new Date();
	MongooseUpdater._update(Activist,
		{"_id": id},
		{
			"$set": {
				"login.token.$[i].lastUsage": now,
			}
		},
		[{"i.token": token}],
		false
	);
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

