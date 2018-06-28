import {mockUsers} from '../lib/mockDB';
import cookie from './cookieManager';
import {
	faBuilding,
	faCalendarAlt,
	faCheckCircle, faEnvelope,
	faPhone,
	faUser,
	faUserCircle
} from "@fortawesome/fontawesome-free-solid/index";

const currFilters = [
    {id:0, filterName: "Lives", filterMain: "Tel-Aviv", filterPrefix:"In", filterValue: 20000},
    {id:1, filterName: "Lives", filterMain: "Haifa", filterPrefix:"In", filterValue: 18000},
    {id:2, filterName: "Lives", filterMain: "Ramat Gan", filterPrefix:"In", filterValue: 10000},
];

const residencies = ['תל אביב', 'חיפה', 'ירושלים', 'באר שבע', 'פרדס חנה', 'טירה', 'נצרת'];
const circles = ['תל אביב', 'חיפה', 'ירושלים', 'נגב', 'משולש-שרון', 'אניברסיטת חיפה', 'אוניברסיטת תל אביב', 'אוניברסיטת בן גוריון', 'האוניברסיטה העברית']

const stringOptions = [
		{label: 'Is', type: 'options'},
		{label: 'Is not', type: 'options'},
		{label: 'Starts with', type: 'text'},
		{label: 'Ends with', type: 'text'},
		{label: 'Contains', type: 'text'},
		{label: 'Does not contain', type: 'text'},
		{label: 'Is unknown', type: 'checkbox'},
		{label: 'Has any value', type: 'checkbox'},
		];

const dateOptions = [
		{label: 'After', type: 'date'},
		{label: 'Exactly ',secondLable:' days ago', type: 'number'},
		{label: 'Before', type: 'date'},
		{label: 'Is unknown', type: 'checkbox'},
		{label: 'Has any value', type: 'checkbox'},
		];

const possibleFilters =
	[	{label:'Creation date', icon:faCalendarAlt, type: "date"},
		{label:'Last update', icon:faCalendarAlt, type: "date"},
		{label:'Residency', icon:faBuilding, type: "string", options:residencies},
		{label:'Joining method', icon:faUserCircle, type: "string"},
		{label:'Typer name', icon:faUser, type: "string"},
		{label:'Full name', icon:faUser, type: "string"},
		{label:'First name', icon:faUser, type: "string"},
		{label:'Last name', icon:faCalendarAlt, type: "string"},
		{label:'Phone number', icon:faPhone, type: "string"},
		{label:'Email', icon:faEnvelope, type: "string"},
		{label:'Circle', icon:faUserCircle, type: "string", options:circles},
		{label:'Is member', icon:faCheckCircle, type: "boolean"},
		{label:'Is paying', icon:faCheckCircle, type: "boolean"},
		{label:'Is receiving newsletter', icon:faCheckCircle, type: "boolean"},
		{label:'Is a typer', icon:faCheckCircle, type: "boolean"},
		{label:'Is a caller', icon:faCheckCircle, type: "boolean"},
		{label:'Is an organizer', icon:faCheckCircle, type: "boolean"},
		{label:'Is a circle leader', icon:faCheckCircle, type: "boolean"},
		{label:'Is an admin', icon:faCheckCircle, type: "boolean"},
];

function delay(val, timeout=0) {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>resolve(val), timeout)
    });
}

function getPossibleFilters(){
	return possibleFilters;
}

function getCurrFilters() {
    return delay(currFilters, 10);
}

function addSingleFilter() {
	const emptyFilter = {id:currFilters[0].length, filterName: "", filterMain: "", filterPrefix:"", filterValue: 0};
	currFilters[0].push(emptyFilter);
  return delay(currFilters, 10);
}
function removeSingleFilter(groupId, singleId) {
	console.log('groupId', groupId);
	console.log('singleId', singleId);
	currFilters[groupId].splice(singleId, 1);
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
			activists[i].lastEvent=activists[i].attendedEvents[activists[i].attendedEvents.length-1].title;
			activists[i].lastSeen=activists[i].attendedEvents[activists[i].attendedEvents.length-1].date;
		}
		activists[i]["name"] = activists[i]["firstname"] + " " + activists[i]["lastname"];
		delete activists[i]["attendedEvents"];
		delete activists[i]["firstname"];
		delete activists[i]["lastname"];
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
  addSingleFilter,
  removeSingleFilter,
	login,
	toggleUserCallerStatus,
	getPossibleFilters,
}
