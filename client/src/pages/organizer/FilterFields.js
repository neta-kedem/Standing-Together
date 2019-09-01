import server from '../../services/server';
import React from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUserCircle, faEnvelope, faPhone, faFistRaised, faPeace} from '@fortawesome/free-solid-svg-icons';
library.add(faBuilding, faUserCircle, faEnvelope, faPhone, faFistRaised, faPeace);
const sortOptions = [
    {label:"الاسم الشخصي שם פרטי", key:"profile.firstName"},
    {label:"اسم العائلة שם משפחה", key:"profile.lastName"},
    {label:"البريد الإلكتروني אימייל", key:"profile.email"},
    {label:"תאריך הוספה למערכת", key:"metadata.creationDate"},
    {label:"תאריך שינוי אחרון", key:"metadata.lastUpdate"},
    {label:"תאריך הרשמה לתנועה", key:"membership.joiningDate"},
];
const fieldsFilterOptions = {
    cities: [],
    circles: [],
    eventCategories:[],
    membershipStatus: [
        {label:"חבר/ה", key:true},
        {label:"לא חבר/ה", key:false},
    ]
};
const filterableFields = {
    residency:{
        sortPosition: 0,
            label: "البلد מגורים",
            icon: <FontAwesomeIcon icon="building"/>,
            fieldName: "profile.residency",
            options: {
            livingIn: {label: 'גר/ה ב', sortPosition: 0, acceptMultiple: true, operator: "$in", inputType: "citySelector", options:"cities"},
            notLivingIn: {label: 'לא גר/ה ב', sortPosition: 1, acceptMultiple: true, operator: "$nin", inputType: "citySelector", options:"cities"},
        }
    },
    circle:{
        sortPosition: 1,
            label: "دائرة מעגל",
            icon: <FontAwesomeIcon icon="building"/>,
            fieldName: "profile.circle",
            options: {
            associatedWith: {label: 'חבר/ה ב', sortPosition: 0, acceptMultiple: false, operator: "$eq", inputType: "select", options: "circles"},
            notAssociatedWith: {label: 'לא חבר/ה ב', sortPosition: 1, acceptMultiple: false, operator: "$ne", inputType: "select", options: "circles"},
        }
    },
    firstName:{
        sortPosition: 2,
            label: "الاسم الشخصي שם פרטי",
            icon: <FontAwesomeIcon icon="user-circle"/>,
            fieldName: "profile.firstName",
            options: {
            includes: {label: 'מכיל', acceptMultiple: false, sortPosition: 0, operator: "$regex", inputType: "text", valueMapper:v => ".*"+v+".*"},
            nIncludes: {label: 'לא מכיל', acceptMultiple: false, sortPosition: 1, operator: "$regex", inputType: "text", valueMapper:v => "^((?!"+v+").)*$"},
        }
    },
    lastName:{
        sortPosition: 3,
            label: "اسم العائلة שם משפחה",
            icon: <FontAwesomeIcon icon="user-circle"/>,
            fieldName: "profile.lastName",
            options: {
            includes: {label: 'מכיל', acceptMultiple: false, sortPosition: 0, operator: "$regex", inputType: "text", valueMapper:v => ".*"+v+".*"},
            nIncludes: {label: 'לא מכיל', acceptMultiple: false, sortPosition: 1, operator: "$regex", inputType: "text", valueMapper:v => "^((?!"+v+").)*$"},
        }
    },
    email:{
        sortPosition: 4,
        label: "البريد الإلكتروني אימייל",
        icon: <FontAwesomeIcon icon="envelope"/>,
        fieldName: "profile.email",
        options: {
            includes: {label: 'מכיל', acceptMultiple: false, sortPosition: 0, operator: "$regex", inputType: "text"}
        }
    },
    phone:{
        sortPosition: 5,
        label: "رقم الهاتف טלפון",
        icon: <FontAwesomeIcon icon="phone"/>,
        fieldName: "profile.phone",
        options: {
            includes: {label: 'מכיל', acceptMultiple: false, sortPosition: 0, operator: "$regex", inputType: "text"}
        }
    },
    membership:{
        sortPosition: 6,
        label: "חברות בתנועה",
        icon: <FontAwesomeIcon icon="fist-raised"/>,
        fieldName: "membership",
        options: {
            membershipStatus: {label: 'סטטוס חברות', sortPosition: 0, acceptMultiple: false, operator: "$exists", inputType: "select", options: "membershipStatus"},
        }
    },
    event:{
        sortPosition: 7,
        label: "حدث אירוע",
        icon: <FontAwesomeIcon icon="peace"/>,
        fieldName: "linked.participatedEvents",
        options: {
            membershipStatus: {label: 'השתתפו באירוע', sortPosition: 0, acceptMultiple: false, operator: "$elemMatch", inputType: "eventSelector",
                valueMapper:v => {return {"_id":{"$eq": v._id, "castToId": true}}},
            },
        }
    },
    eventCategory:{
        sortPosition: 8,
        label: "קטגוריית אירועים",
        icon: <FontAwesomeIcon icon="peace"/>,
        fieldName: "linked.participatedEvents",
        options: {
            membershipStatus: {label: 'השתתתפו באירוע מקטגוריה', sortPosition: 0, acceptMultiple: false,
                operator: "$elemMatch", inputType: "select", options: "eventCategories",
                valueMapper:v => {return {"eventDetails.category":{"$eq": v, "castToId": true}}},
            },
        }
    }
};

const getCities = function() {
    server.get('cities', {})
        .then(cities => {
            fieldsFilterOptions.cities = cities;
        });
};

const getCircles =function(){
    server.get('circles', {})
        .then(circles => {
            fieldsFilterOptions.circles = circles.map(c=>{return {label: c.name, key: c.name}});
        });
};

const getEventCategories = function(){
    server.get('eventCategories', {})
        .then(eventCategories => {
            fieldsFilterOptions.eventCategories = eventCategories.map(ec=>{return {label: ec.name.he, key: ec._id}});
        });
};

const mount = function(){
    getEventCategories();
    getCircles();
    getCities();
};

export default {
    sortOptions,
    filterableFields,
    fieldsFilterOptions,
    mount
}