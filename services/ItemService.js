import {mockUsers} from '../lib/mockDB';
import cookie from './cookieManager';

const currFilters = [
    {id:1, filterName: "Lives", filterMain: "Tel-Aviv", filterPrefix:"In", filterValue: 20000},
    {id:2, filterName: "Lives", filterMain: "Haifa", filterPrefix:"In", filterValue: 18000},
    {id:3, filterName: "Lives", filterMain: "Ramat Gan", filterPrefix:"In", filterValue: 10000},
];

function delay(val, timeout=0) {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>resolve(val), timeout)
    });
}

function getCurrFilters() {
    return delay(currFilters, 10);
}

function getAcivists() {
	if(false&&!verifyToken())
	{
		return delay([], 10);
	}
	const activists = mockUsers;
	for(var i=0; i<activists.length; i++){
		if(activists[i]["attendedEvents"]&&activists[i]["attendedEvents"].length)
		{
			console.log(activists[i]["attendedEvents"].length)
			activists[i].lastEvent=activists[i].attendedEvents[activists[i].attendedEvents.length-1].title;
			activists[i].lastSeen=activists[i].attendedEvents[activists[i].attendedEvents.length-1].date;
		}
	}
    return delay(mockUsers, 10);
}

function verifyToken(){
	let token = cookie.getCookie('token');
	for(var i=0; i<mockUsers.length; i++)
	{
		if(mockUsers[i].token===token)
		{
			return true;
		}
	}
	return false;
}

function getUserByPhone(phone){
	let foundUser=false;
	for(var i=0; i<mockUsers.length; i++)
	{
		if(mockUsers[i].phone===phone)
		{
			mockUsers[i].loginCode="123456";//Math.random().toString(36).substr(2, 6);
			//TODO send login code via SMS
			break;
		}
	}
	return delay(true, 10);
}
function getUserByEmail(email){
	let foundUser=false;
	for(var i=0; i<mockUsers.length; i++)
	{
		if(mockUsers[i].email===email)
		{
			mockUsers[i].loginCode="123456";//Math.random().toString(36).substr(2, 6)
			//TODO send login code via mail
			break;
		}
	}
	return delay(true, 10);
}
function toggleUserCallerStatus(id, status){
	for(var i=0; i<mockUsers.length; i++)
	{
		if(mockUsers[i]._id===id)
		{
			mockUsers[i].isCaller=status;
			return delay(true, 10);
		}
	}
	return delay(false, 10);
}
function login(code, phone, email){
	let foundUser=false;
	let token = "";
	for(var i=0; i<mockUsers.length; i++)
	{
		if((mockUsers[i].email===email||mockUsers[i].phone===phone)&&mockUsers[i].loginCode==code)
		{
			//TODO - not sure if there are best practices when it comes to token generation, intuitively a random string should suffice.
			token = generateToken();
			mockUsers[i].token=token;
			foundUser = true;
			break;
		}
	}
	if(foundUser)
	{
		cookie.setCookie('token', token, 150);
	}
	return delay(foundUser?token:false, 10);
}
function generateToken() {
	var tokenLength = 32;
    var token = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < tokenLength; i++) {
        token += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return token;
}

export default {
    getAcivists,
    getCurrFilters,
	getUserByEmail,
	getUserByPhone,
	login,
	toggleUserCallerStatus
}
