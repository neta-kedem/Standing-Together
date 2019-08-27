const Activist = require('../models/activistModel');

//expire tokens that have been issued this long ago:
const TOKEN_EXPIRATION = 1000 * 60 * 60;
//or have been used this long ago:
const LAST_TOKEN_USAGE = 1000 * 60 * 7;

let myId = "";
const getUserByToken = function(token){
	if(!token)
	{
		return new Promise((resolve)=>{
			resolve({"error":"missing token"});
		});
	}
	const query = Activist.findOne({'login.tokens.token': token});
	return query.exec().then((user) => {
		if (!user) {
			return {"error": "missing token"};
		}

		if (user.login.locked) {
			return {"error": "locked out"};
		}
		updateLastTokenUsage(user, token);
		return retireExpiredTokens(user).then((validTokens) => {
			for (let i = 0; i < validTokens.length; i++) {
				//if the used token hasn't expired, return the user details
				if (validTokens[i].token === token) {
					myId = user["_id"];
					return user;
				}
			}
			//otherwise, return a missing token error
			return {"error": "missing token"};
		});
	});
};
const retireExpiredTokens = function(user){
	let validTokens = [];
	let now = new Date();
	for(let i = 0; i < user.login.tokens.length; i++){
		let token = user.login.tokens[i];
		if(token.issuedAt >= (now - TOKEN_EXPIRATION) && token.lastUsage >= (now - LAST_TOKEN_USAGE))
		{
			validTokens.push(token)
		}
	}
	let query = Activist.updateOne({'_id': user._id}, {"login.tokens": validTokens});
	return query.exec().then(()=>{
		return validTokens
	});
};
const updateLastTokenUsage = function(user, token){
	const now = new Date();
	for(let i = 0; i < user.login.tokens.length; i++){
		if(user.login.tokens[i].token === token){
			user.login.tokens[i].lastUsage = now;
		}
	}
	let query = Activist.updateOne({'_id': user._id}, {"login.tokens": user.login.tokens});
	return query.exec().then(()=>{
		return true;
	});
};

const isUser = function(req){
	const token = req.cookies.token;
	return getUserByToken(token).then((user) => {
		return !user.error;
	});
};

const hasRole = function(req, role){
	return (
		getUserByToken(req)
			.then(user => {
				if (user.error)
					return {error: user.error};
				let roles = [];
				if (Array.isArray(role)) {
					roles = role;
				} else {
					roles.push(role);
				}
				for (let i = 0; i < roles.length; i++) {
					if (!!user.role[roles[i]])
						return true;
				}
				return false;
			})
	);
};

const getMyId = function(){
	return myId;
};

module.exports = {
	isUser,
	hasRole,
	getMyId
};

