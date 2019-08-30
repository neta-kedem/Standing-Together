const whatsappMessenger = require('../../services/whatsappMessenger');
const Authentication = require('../../services/authentication');

module.exports = (app) => {
    app.post('/api/whatsapp/send', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(result=>{
        if(result.error)
            return res.json({error: result.error});
            whatsappMessenger.sendMessage(req.body.messages).then(qr =>{
                return res.json({qrSrc: qr});
            });
        })
    });
    app.get('/api/whatsapp/progress', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(result=>{
        if(result.error)
            return res.json({error: result.error});
            whatsappMessenger.getProgress().then(progress =>{
                return res.json(progress);
            });
        })
    });
};
