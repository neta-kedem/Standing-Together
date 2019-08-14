function emptyFilters (){
    return {
        logicalOperator:"or",
        groups: []
    }
}

function emptyGroup (){
    return {
        logicalOperator: "or",
        filters: [emptyFilters()]
    }
}

function addGroup(filters) {
    filters.groups.push(emptyGroup());
    updateFilterIndices(filters);
    return filters;
}

function removeGroup(filters, groupIndex) {
    if(!filters.groups || !filters.groups.length)
        return;
    filters.groups.splice(groupIndex, 1);
    updateFilterIndices(filters);
    return filters;
}

function addCondition(filters, groupIndex) {
    filters.groups[groupIndex].filters.push({});
    updateFilterIndices(filters);
    return filters;
}

function updateCondition(condition, filters, groupIndex, conditionIndex) {
    filters.groups[groupIndex].filters[conditionIndex]=condition;
    updateFilterIndices(filters);
    return filters;
}

function removeCondition(filters, groupIndex, filterId) {
    filters.groups[groupIndex].filters = filters.groups[groupIndex].filters.filter((filter) => filter.id !== filterId);
    filters.groups = filters.groups.filter(group => group.filters.length);
    updateFilterIndices(filters);
    return filters;
}

function updateFilterIndices(filters){
    let index = 0;
    filters.groups.forEach(group => group.filters.forEach(filter => filter.id = index++));
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
    const groups = JSON.parse(JSON.stringify(filters.groups));
    groups.forEach(g => {
        g.filters = g.filters.filter(c => c.fieldType && c.option && c.value !== null && c.value !== undefined);
    });
    const nonEmptyGroups = groups.filter(g => g.filters.length);
    if(!nonEmptyGroups.length) return "{}";
    const outerOp = filters.outerOr ? "or" : "and";
    const innerOp = filters.outerOr ? "and" : "or";
    let query = `{"$${outerOp}": [`;
    nonEmptyGroups.forEach((group, i) => {
        if(i) query += ', {';
        else query += '{';
        query += `"$${innerOp}": [`;
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
    removeGroup,
    addCondition,
    updateCondition,
    removeCondition,
    updateFilterIndices
}
