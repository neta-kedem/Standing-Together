import React from 'react';
import SingleCondition from './SingleCondition';
import style from './QueryCreator.css'
// icons
import orIcon from '../../static/OR.png';
import andIcon from '../../static/AND.png';


class QueryCreator extends React.Component {
    render() {
        const conditions = this.props.currFilters.map((filter, index) => {
            if(index) return <div style={style.query} key={filter.id}>
                    <img style={style.filterIcon} src={orIcon} alt="OR"/>
                    <SingleCondition condition={filter}></SingleCondition>
                </div>
            return <div style={style.query} key={filter.id}>
                    <SingleCondition condition={filter}></SingleCondition>
                </div>
        });
        return(
            <section style={{height: "100%"}}>
                <div style={style.wrapper}>
                    {conditions}
                </div>
            </section>
        )
    }
}

export default QueryCreator;
