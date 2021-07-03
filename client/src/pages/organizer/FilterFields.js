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
    {label:"تاريخ الاضافة للمنظومة תאריך הוספה למערכת", key:"metadata.creationDate"},
    {label:"تاريخ التغيير الاخير תאריך שינוי אחרון", key:"metadata.lastUpdate"},
    {label:"تاريخ التسجيل للحراك תאריך הרשמה לתנועה", key:"-membership.joiningDate"},
];
const fieldsFilterOptions = {
    cities: [],
    circles: [],
    eventCategories:[],
    membershipStatus: [
        {label:"عضو/ة חבר/ה", key:true},
        {label:"ليس/ت عضو/ة לא חבר/ה", key:false},
    ]
};
const filterableFields = {
    residency:{
        sortPosition: 0,
        labelAr: "البلد",
        labelHe: "מגורים",
        icon: <FontAwesomeIcon icon="building"/>,
        fieldName: "profile.residency",
        options: {
            livingIn: {labelAr: 'ي/تقيم ب', labelHe: 'גר/ה ב', sortPosition: 0, acceptMultiple: true, operator: "$in", inputType: "citySelector", options:"cities"},
            notLivingIn: {labelAr: 'ا ي/تقيم ب', labelHe: 'לא גר/ה ב', sortPosition: 1, acceptMultiple: true, operator: "$nin", inputType: "citySelector", options:"cities"},
        }
    },
    circle:{
        sortPosition: 1,
        labelAr: "دائرة",
        labelHe: "מעגל",
        icon: <FontAwesomeIcon icon="building"/>,
        fieldName: "profile.circle",
        options: {
            associatedWith: {labelAr: 'عضو/ة', labelHe: 'חבר/ה ב', sortPosition: 0, acceptMultiple: false, operator: "$eq", inputType: "select", options: "circles"},
            notAssociatedWith: {labelAr: 'ليس/ت عضو/ة', labelHe: 'לא חבר/ה ב', sortPosition: 1, acceptMultiple: false, operator: "$ne", inputType: "select", options: "circles"},
        }
    },
    firstName:{
         sortPosition: 2,
         labelAr: "الاسم الشخصي",
         labelHe: "שם פרטי",
         icon: <FontAwesomeIcon icon="user-circle"/>,
         fieldName: "profile.firstName",
         options: {
            includes: {labelAr: 'يحتوي', labelHe: 'מכיל', acceptMultiple: false, sortPosition: 0, operator: "$regex", inputType: "text", valueMapper:v => ".*"+v+".*"},
            nIncludes: {labelAr: 'لا يحتوي', labelHe: 'לא מכיל', acceptMultiple: false, sortPosition: 1, operator: "$regex", inputType: "text", valueMapper:v => "^((?!"+v+").)*$"},
         }
    },
    lastName:{
        sortPosition: 3,
        labelAr: "اسم العائلة",
        labelHe: "שם משפחה",
        icon: <FontAwesomeIcon icon="user-circle"/>,
        fieldName: "profile.lastName",
        options: {
            includes: {labelAr: 'يحتوي', labelHe: 'מכיל', acceptMultiple: false, sortPosition: 0, operator: "$regex", inputType: "text", valueMapper:v => ".*"+v+".*"},
            nIncludes: {labelAr: 'لا يحتوي', labelHe: 'לא מכיל', acceptMultiple: false, sortPosition: 1, operator: "$regex", inputType: "text", valueMapper:v => "^((?!"+v+").)*$"},
        }
    },
    email:{
        sortPosition: 4,
        labelAr: "البريد الإلكتروني",
        labelHe: "אימייל",
        icon: <FontAwesomeIcon icon="envelope"/>,
        fieldName: "profile.email",
        options: {
            includes: {labelAr: 'يحتوي', labelHe: 'מכיל', acceptMultiple: false, sortPosition: 0, operator: "$regex", inputType: "text"}
        }
    },
    phone:{
        sortPosition: 5,
        labelAr: "رقم الهاتف",
        labelHe: "טלפון",
        icon: <FontAwesomeIcon icon="phone"/>,
        fieldName: "profile.phone",
        options: {
            includes: {labelAr: 'يحتوي', labelHe: 'מכיל', acceptMultiple: false, sortPosition: 0, operator: "$regex", inputType: "text"}
        }
    },
    membership:{
        sortPosition: 6,
        labelAr: "عضوية في الحراك",
        labelHe: "חברות בתנועה",
        icon: <FontAwesomeIcon icon="fist-raised"/>,
        fieldName: "profile.isMember",
        options: {
            membershipStatus: {labelAr: 'حالة العضوية', labelHe: 'סטטוס חברות', sortPosition: 0, acceptMultiple: false, operator: "$eq", inputType: "select", options: "membershipStatus",
                valueMapper:v => v === 'true'},
        }
    },
    membershipJoinDate:{
        sortPosition: 7,
        labelAr: "تاريخ التسجيل للحراك",
        labelHe: "תאריך הרשמה לתנועה",
        icon: <FontAwesomeIcon icon="calendar"/>,
        fieldName: "membership.joiningDate",
        options: {
            after: {labelAr: 'אחרי', labelHe: 'אחרי', sortPosition: 0, acceptMultiple: false, operator: "$gte", inputType: "date",
                valueMapper:v => {return {"castToDate":v}},},
            before: {labelAr: 'לפני', labelHe: 'לפני', sortPosition: 1, acceptMultiple: false, operator: "$lt", inputType: "date",
                valueMapper:v => {return {"castToDate":v}},},
        }
    },
    event:{
        sortPosition: 8,
        labelAr: "حدث",
        labelHe: "אירוע",
        icon: <FontAwesomeIcon icon="peace"/>,
        fieldName: "linked.participatedEvents",
        options: {
            membershipStatus: {labelAr: 'شاركوا بالحدث', labelHe: 'השתתפו באירוע', sortPosition: 0, acceptMultiple: false, operator: "$elemMatch", inputType: "eventSelector",
                valueMapper:v => {return {"_id":{"$eq": v._id, "castToId": true}}},
            },
            NmembershipStatus: {labelAr: 'مش شاركوا بالحدث', labelHe: 'לא השתתפו באירוע', sortPosition: 0, acceptMultiple: false, operator: "$elemMatch", inputType: "eventSelector",
                valueMapper:v => {return {"_id":{"$ne": v._id, "castToId": true}}},
            }
        }
    },
    eventCategory:{
        sortPosition: 9,
        labelAr: "نوعية الحدث",
        labelHe: "קטגוריית אירועים",
        icon: <FontAwesomeIcon icon="peace"/>,
        fieldName: "linked.participatedEvents",
        options: {
            membershipStatus: {labelAr: 'شاركوا في حدث من هذه النوعية', labelHe: 'השתתתפו באירוע מקטגוריה', sortPosition: 0, acceptMultiple: false,
                operator: "$elemMatch", inputType: "select", options: "eventCategories",
                valueMapper:v => {return {"eventDetails.category":{"$eq": v, "castToId": true}}},
            },
        }
    }
};

const getCities = function() {
    server.get('cities/used', {})
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