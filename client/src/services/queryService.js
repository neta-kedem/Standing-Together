const emptyFilters = {
    logicalOperator:"or",
    groups: []
};

const emptyGroup = {
    logicalOperator:"or",
    filters: []
};


function addGroup(filters) {
    filters.groups.push(emptyGroup);
    return filters || emptyFilters
}

function addCondition(filters, groupIndex) {
    filters.groups[groupIndex].filters.push({});
    updateFilterIndices(filters);
    return filters || emptyFilters
}

function updateCondition(condition, filters, groupIndex, conditionIndex) {
    filters.groups[groupIndex].filters[conditionIndex]=condition;
    updateFilterIndices(filters);
    return filters || emptyFilters
}

function removeCondition(filters, groupIndex, filterId) {
    filters.groups[groupIndex].filters = filters.groups[groupIndex].filters.filter((filter, i) => i !== filterId);
    filters.groups = filters.groups.filter(group => group.filters.length);
    updateFilterIndices(filters);
    return filters || emptyFilters
}

function updateFilterIndices(filters){
    let index = 0;
    filters.groups.forEach(group => group.filters.forEach(filter => filter.id = index++));
}

function setLogicalOperator(filters, groupIndex, logicalOperator) {
    if(groupIndex !== -1) {
        filters.groups[groupIndex].logicalOperator = logicalOperator
    } else {
        filters.logicalOperator = logicalOperator
    }
    return filters || emptyFilters
}

function conditionToQuery(condition, filterableFields) {
    if(!condition || !filterableFields || !condition.fieldType || !filterableFields[condition.fieldType] || !condition.option || condition.value === null || condition.value === undefined)
        return null;
    const fieldType = condition.fieldType;
    const option = condition.option;
    const value = condition.value;
    const fieldInfo = filterableFields[fieldType];
    const fieldOption = fieldInfo.options[option];
    return {field: '"'+fieldInfo.fieldName+'"', body: `{"`+fieldOption.operator+`":`+JSON.stringify(value)+`}`}
}

function generateQuery(filters, filterableFields){
    if(!filters.groups.length) return "{}";
    let query = `{"$${filters.logicalOperator}": [`;
    filters.groups.forEach((group, i) => {
        if(i) query += ', {';
        else query += '{';
        query += `"$${group.logicalOperator}": [`;
        group.filters.forEach((filter, j) => {
            const filterObj = conditionToQuery(filter, filterableFields);
            if(!filterObj)
                return;
            let str = '';
            if(j) str = ', {';
            else str = '{';
            str += filterObj.field + ':' + filterObj.body;
            query += `${str}}`
        });
        query += "]}"
    });
    query += ']}';
    return query
}

export default {
    generateQuery,
    addGroup,
    addCondition,
    updateCondition,
    removeCondition,
    setLogicalOperator,
    updateFilterIndices
}
