import server from '../../services/server';
import React from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUserCircle } from '@fortawesome/free-solid-svg-icons';
library.add(faBuilding, faUserCircle);
const fieldsFilterOptions = {
    cities: [],
    circles: [],
};
const filterableFields = {
    residency:{
        sortPosition: 0,
            label: "מגורים",
            icon: <FontAwesomeIcon icon="building"/>,
            fieldName: "profile.residency",
            options: {
            livingIn: {label: 'גר/ה ב', sortPosition: 0, acceptMultiple: true, operator: "$in", inputType: "citySelector", options:"cities"},
            notLivingIn: {label: 'לא גר/ה ב', sortPosition: 1, acceptMultiple: true, operator: "$nin", inputType: "citySelector", options:"cities"},
        }
    },
    circle:{
        sortPosition: 1,
            label: "מעגל",
            icon: <FontAwesomeIcon icon="building"/>,
            fieldName: "profile.circle",
            options: {
            associatedWith: {label: 'חבר/ה ב', sortPosition: 0, acceptMultiple: false, operator: "$eq", inputType: "select", options: "circles"},
            notAssociatedWith: {label: 'לא חבר/ה ב', sortPosition: 1, acceptMultiple: false, operator: "$ne", inputType: "select", options: "circles"},
        }
    },
    firstName:{
        sortPosition: 2,
            label: "שם פרטי",
            icon: <FontAwesomeIcon icon="user-circle"/>,
            fieldName: "profile.firstName",
            options: {
            includes: {label: 'מכיל', acceptMultiple: false, sortPosition: 0, operator: "$regex", inputType: "text"},
            nIncludes: {label: 'לא מכיל', acceptMultiple: false, sortPosition: 1, operator: "$regex", inputType: "text"},
        }
    },
    lastName:{
        sortPosition: 3,
            label: "שם משפחה",
            icon: <FontAwesomeIcon icon="user-circle"/>,
            fieldName: "profile.lastName",
            options: {
            includes: {label: 'מכיל', acceptMultiple: false, sortPosition: 0, operator: "$regex", inputType: "text"},
            nIncludes: {label: 'לא מכיל', acceptMultiple: false, sortPosition: 1, operator: "$regex", inputType: "text"},
        }
    }
};

const getCities = function() {
    server.get('cities', {})
        .then(cities => {
            fieldsFilterOptions.cities = cities;
        });
};
getCities();
const getCircles =function(){
    server.get('circles', {})
        .then(circles => {
            fieldsFilterOptions.circles = circles.map(c=>{return {label: c.name, key: c.name}});
        });
};
getCircles();

export default {
    filterableFields,
    fieldsFilterOptions
}