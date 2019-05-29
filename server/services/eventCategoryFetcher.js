const eventCategory = require('../models/eventCategoryModel');
const getEvetnCategories = function (){
    const query = eventCategory.find();
    const categoriesPromise = query.exec().then((categories) => {
        return categories;
    });
    return categoriesPromise;
};
module.exports = {
    getEvetnCategories,
};