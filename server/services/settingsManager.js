const Setting = require('../models/settingModel');
const getSettings = function (){
    const query = Setting.find({});
    const settingPromise = query.exec().then((settings) => {
        if (!settings)
            return {"error": "no settings found"};
        for (let i = 0; i < settings.length; i++) {
            let setting = settings[i];
        }
        return settings;
    });
    return settingPromise;
};
const getSettingByName = function (name){
    const query = Setting.findOne({"name": name});
    const settingPromise = query.exec().then((setting) => {
        if(!setting)
            return [];
        if(setting.singleValue)
            setting.values = setting.values[0];
        return setting.values;
    });
    return settingPromise;
};
const setSettings = function (settings){
    const query = Setting.deleteMany({});
    const settingPromise = query.exec().then(() => {
        Setting.insertMany(settings, ()=>{
            return true;
        })
    });
    return settingPromise;
};
module.exports = {
    getSettingByName,
    getSettings,
    setSettings
};