const Activist = require('../models/activistModel');
const MongooseUpdater = require('../services/dbHelper/mongooseUpdater');

//expire tokens that have been issued this long ago:
const TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 7;
//unless they were last used this long ago:
const LAST_TOKEN_USAGE = 1000 * 60 * 60;

let myId = "";
const getUserByToken = function(req){
	const token = req.cookies.token;
	if(!token)
	{
		return new Promise((resolve, reject)=>{
			resolve({"error":"missing token"});
		});
	}
	const query = Activist.findOne({'login.tokens.token': token});
	const userPromise = query.exec().then((user) => {
		if(!user)
		{
			return {"error":"missing token"};
		}
		updateLastTokenUsage(user["_id"], token);
		return retireExpiredTokens(user).then((validTokens)=>{
			for(let i = 0; i < validTokens.length; i++){
				//if the used token hasn't expired, return the user details
				if(validTokens[i].token === token){
					myId = user["_id"];
					return user;
				}
			}
			//otherwise, return a missing token error
			return {"error":"missing token"};
		});
	});
	return userPromise;
};
const retireExpiredTokens = function(user){
	let validTokens = [];
	let now = new Date();
	//console.log(user.login);
	for(let i = 0; i < user.login.tokens.length; i++){
		let token = user.login.tokens[i];
		if(token.issuedAt >= (now - TOKEN_EXPIRATION) || token.lastUsage >= (now - LAST_TOKEN_USAGE))
		{
			validTokens.push(token)
		}
	}
	let query = Activist.updateOne({'_id': user._id}, {"login.tokens": validTokens});
	return query.exec().then(()=>{
		return validTokens
	});
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
	const promise = getUserByToken(req, res).then((user)=>{
			return !user.error;
		});
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

