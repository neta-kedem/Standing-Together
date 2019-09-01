const Activist = require('../../models/activistModel');

const logout = function(req, res) {
    const token = req.cookies.token;
    let query = Activist.updateOne({'login.tokens.token':token}, {$pull:{'login.tokens':{'token': token}}});
    return query.exec().then(()=>{
        return res.json(true)
    });
};

module.exports = {
    logout
};

