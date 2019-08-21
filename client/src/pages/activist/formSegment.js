import React from 'react';

export default class FormSegment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            segmentName: props['segmentName'],
            fields: props['fields'],
            dataLists: props['dataLists'],
            handleChange: props['handleChange']
        };
    }
    static getDerivedStateFromProps(nextProps) {
        return {dataLists: nextProps.dataLists};
    }
    syncStateToInput = function(event){
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.state.handleChange(event.target.name, value, this.state.segmentName);
    }.bind(this);

    getInputField = function(f, values){
        switch(f.type){
        case "checkbox":
            return <input value = {true} type={f.type} name={f.name}
                          checked = {values[f.name]}
                          onChange = {this.syncStateToInput}/>;
        case "select":
            return <select value = {values[f.name]} name={f.name} onChange = {this.syncStateToInput}>
                <option value={0}/>
                {this.state.dataLists[f.name].data.map((o, i)=>{
                    return <option value={o} key={o + "_" + i}>{o}</option>
                })}
            </select>;
        default:
            return <input value = {values[f.name]} type={f.type} name={f.name}
                          onChange = {this.syncStateToInput}
                          list = {f.name + "-data-list"}
                          autoComplete = "new-password"/>;
        }
    }.bind(this);

    render() {
        const values = this.props.values;
        const dataLists = this.state.dataLists?
            Object.entries(this.state.dataLists).map((field)=>{
                let f = field[1];
                return <datalist key={f.field+"-data-list"} id={f.field+"-data-list"}>
                    {f.data.map((option, i)=>{
                        return <option key={f.field+"-op-"+option+"-"+i} value={option}/>
                    })}
                </datalist>
            })
            :"";
        return (
            <div className="contact-form-wrap">
                {
                    this.state.fields.map((f, i) => {
                    return (
                        <label className={"label " + (f.type === "checkbox" ? "checkbox-label" : "")} key={f.name + "_" + i}>
                            <div>{f.name}</div>
                            {
                                this.getInputField(f, values)
                            }
                        </label>
                    )
                    })
                }
                {dataLists}
            </div>
        );
    }
}