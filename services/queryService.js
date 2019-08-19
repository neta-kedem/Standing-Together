let currFilters = {
    logicalOperator:"or",
    groups: []
};

const emptyFilters = {
    logicalOperator:"or",
    groups: []
}
const emptyGroup = {
    logicalOperator:"or",
    filters: []
}

const avilableFilters = [
    {label: "מגורים", options: ['גר/ה ב', 'לא גר/ה ב'], filterMain: '', mainCombo: 'cities', id: "lives"},
    {label: "מעגל", options: ['חבר/ה ב', 'לא חבר/ה ב'], filterMain: '', mainCombo: 'circles', id: "circle"},
    {label: "שם פרטי", filterMain: '', id: "firstName"},
    {label: "שם משפחה", filterMain: '', id: "secondName"},
    // {label: "שם מלא", filterMain: '', id: "fullName"},
]

async function getCurrFilters() {
    return currFilters || emptyFilters
}

async function addFilter(groupId, filter) {
    currFilters.groups[groupId].filters.push(filter)
    let index = 0
    currFilters.groups.forEach(group => group.filters.forEach(filter => filter.id = index++))
    return currFilters || emptyFilters
}

async function addGroup() {
    currFilters.groups.push(JSON.parse(JSON.stringify(emptyGroup)))
    return currFilters || emptyFilters
}

async function removeSingleFilter(groupId, filterId) {
    currFilters.groups[groupId].filters = currFilters.groups[groupId].filters.filter(filter => filter.id !== filterId)
    currFilters.groups = currFilters.groups.filter(group => group.filters.length)
    let index = 0
    currFilters.groups.forEach(group => group.filters.forEach(filter => filter.id = index++))
    return currFilters || emptyFilters
}
async function removeGroup(groupId) {
    currFilters.groups = currFilters.groups.filter((group, i) => i !== groupId)
    let index = 0
    currFilters.groups.forEach(group => group.filters.forEach(filter => filter.id = index++))
    return currFilters || emptyFilters
}

async function getAvailableFilters() {
    return avilableFilters || []
}

async function setLogicalOperator(groupId, logicalOperator) {
    if(groupId !== -1) {
        currFilters.groups[groupId].logicalOperator = logicalOperator
    } else {
        currFilters.logicalOperator = logicalOperator
    }
    return currFilters || emptyFilters
}

async function setFilters(filters) {
    currFilters = filters
    return currFilters || emptyFilters

}


export default {
    getCurrFilters,
    addFilter,
    addGroup,
    removeGroup,
    removeSingleFilter,
    getAvailableFilters,
    setLogicalOperator,
    setFilters
}
