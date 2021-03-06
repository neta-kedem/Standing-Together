import React from 'react'
import server from '../services/server'
import Setting from './settings/SettingDetails'
import './settings/Settings.scss'
import TopNavBar from '../UIComponents/TopNavBar/TopNavBar';

export default class EventCategoriesManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: []
        }
    }
    componentDidMount() {
        this.getSettings();
    }
    getSettings() {
        server.get('settings', {})
            .then(settings => {
                this.setState({"settings": settings});
            });
    }
    saveSettings() {
        let settings = this.state.settings.slice();
        server.post('settings', {settings: settings});
        alert("saved!");
        this.getSettings();
    }
    setValue(val, settingIndex, valIndex) {
        let settings = this.state.settings.slice();
        settings[settingIndex].values[valIndex] = val;
        this.setState({settings: settings})
    }
    addValue(index) {
        let settings = this.state.settings.slice();
        settings[index].values.push("");
        this.setState({settings: settings})
    }
    removeValue(settingIndex, valIndex) {
        let settings = this.state.settings.slice();
        settings[settingIndex].values.splice(valIndex, 1);
        this.setState({settings: settings})
    }

    dbFix() {
        server.get('admin/fixDB', {})
    }
    sqlSync() {
        server.get('admin/sync', {})
    }

    render() {
        const settings = this.state.settings.slice();
        const rows = settings.map((set,i)=>{
            return <Setting
                details={set}
                setValue={this.setValue.bind(this)}
                addValue={this.addValue.bind(this)}
                removeValue={this.removeValue.bind(this)}
                key={"set_"+set._id+"_"+i}
                rowIndex={i}
            />;
        });
        return (
            <div className={"page-wrap-settings"}>
                <TopNavBar>
                    <div className="title-wrap">
                        <span className="title-lang">ניהול הגדרות</span>
                        <span className="title-lang">ניהול הגדרות</span>
                    </div>
                </TopNavBar>
                {rows}
                <button type="button" className="save-settings-button" onClick={this.saveSettings.bind(this)}>שמירה</button>
                <button type="button" className={""} onClick={this.sqlSync}>sync mysql</button>
                <button type="button" className={""} onClick={this.dbFix}>run db fixes</button>
            </div>
        )
    }

}

