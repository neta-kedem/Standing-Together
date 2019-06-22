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

async function getCurrFilters() {
    return await delay(currFilters, 10);
}
export default {
    getCurrFilters
}
