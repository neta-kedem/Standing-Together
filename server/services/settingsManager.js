const Setting = require('../models/settingModel');
const getSettings = function (){
    const query = Setting.findMany({});
    const settingPromise = query.exec().then((settings) => {
        if (!settings || !settings.length)
            return {"error": "no settings found"};
        for (let i = 0; i < settings.length; i++) {
            let setting = settings[i];
            if (setting.singleValue)
                setting.values = setting.values[0];
        }
        return settings;
    });
    return settingPromise;
};
const getSettingByName = function (name){
    const query = Setting.findOne({"name": name});
    const settingPromise = query.exec().then((setting) => {
        if(!setting)
            return {"error": "no setting found with key " + name};
        if(setting.singleValue)
            setting.values = setting.values[0];
        return setting;
    });
    return settingPromise;
};
module.exports = {
    getSettingByName,
    getSettings
};