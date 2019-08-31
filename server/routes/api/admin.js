const Authentication = require('../../services/authentication');
const SQLSync = require('../../services/SQLSync');
const dbFixer = require('../../services/dbFixer');

module.exports = (app) => {
    app.get('/api/admin/sync', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(result => {
            if(!result || result.error)
            {
                return res.json("missing permission");
            }
            else{
                SQLSync.syncAll().then(()=>{
                    return res.json("done");
                });
            }
        });
    });
    app.get('/api/admin/fixDB', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(result => {
            if(!result || result.error)
            {
                return res.json("missing permission");
            }
            else{
                dbFixer.fix().then(()=>{
                    return res.json("done");
                });
            }
        });
    });
};

