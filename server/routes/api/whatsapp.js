const whatsappMessenger = require('../../services/whatsappMessenger');
const Authentication = require('../../services/authentication');

module.exports = (app) => {
    app.post('/api/whatsapp/send', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(result=>{
        if(result.error)
            return res.json({error: result.error});
            whatsappMessenger.sendMessage(req.body.messages, req.body.sessionId).then(qr =>{
                return res.json({qrSrc: qr});
            });
        })
    });
    app.get('/api/whatsapp/progress/:sessionId', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(result=>{
        if(result.error)
            return res.json({error: result.error});
            whatsappMessenger.pingSession(req.params.sessionId).then(progress =>{
                return res.json(progress);
            });
        })
    });
};
