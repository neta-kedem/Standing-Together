import {mockUsers} from '../lib/mockDB'

const currFilters = [
    {id:1, filterName: "Lives", filterMain: "Tel-Aviv", filterPrefix:"In", filterValue: 20000},
    {id:2, filterName: "Lives", filterMain: "Haifa", filterPrefix:"In", filterValue: 18000}
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
    return delay(mockUsers, 10);
}

export default {
    getAcivists,
    getCurrFilters,
}
