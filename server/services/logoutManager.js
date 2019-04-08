const Activist = require('../models/activistModel');

const logout = function(req, res) {
    const token = req.cookies.token;
    let query = Activist.update({'login.token':token},{$pull:{'login.token': token}});
    return query.exec().then(()=>{
        return res.json(true)
    });
};

module.exports = {
    logout
};

