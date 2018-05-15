import React from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Meta from '../lib/meta';
import styles from './caller/Caller.css'

import Nav from './caller/Nav'
import SelectableRow from './caller/SelectableRow'
import ToggleSwitch from '../UIComponents/SelectableTable/FieldTypes/ToggleSwitch.js'
import ItemService from '../services/ItemService'
import {faClock, faChevronCircleDown, faUser, faPhone, faEnvelopeOpen, faUserTimes, faCopy, faMicrophoneSlash} from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faClock, faChevronCircleDown, faUser, faPhone, faEnvelopeOpen, faUserTimes, faCopy, faMicrophoneSlash);

export default class Caller extends React.Component {
constructor(props) {
    super(props);
    this.state = {
        activits:
            [{
                "fname": "שמעון",
                "lname": "לוי",
                "settlement": "חיפה",
                "phone": "0526358655"
              },
              {
                "fname": "ישראל",
                "lname": "ישראלי",
                "settlement": "תל-אביב",
                "phone": "0540000000"
              },
              {
                "fname": "ישראל",
                "lname": "ישראלי",
                "settlement": "תל-אביב",
                "phone": "0541111111"
              },
              {
                "fname": "ישראל",
                "lname": "ישראלי",
                "settlement": "תל-אביב",
                "phone": "0542222222"
              },
              {
                "fname": "ישראל",
                "lname": "ישראלי",
                "settlement": "תל-אביב",
                "phone": "0543333333"
              }],
        selectedRowArr : {0:1,1:0,2:0,3:0,4:0},
        selectedRow : 0,
        header:[
            {title: "טלפון",  visibility: true, key: "phone", icon:"phone", type:"text"},
            {title: "יישוב",  visibility: true, key: "city", icon:"building", type:"text"},
            {title: "שם משפחה", visibility: true, key: "lname", icon:"user", type:"text"},
            {title: "שם פרטי", visibility: true, key: "name", icon:"user", type:"text"}
            
        ]
      }
      this.handleSelection = this.handleSelection.bind(this);
      this.selectedName = this.selectedName.bind(this);
    }
    handleSelection(i){
        let arr = this.state.selectedRowArr;
        arr[this.state.selectedRow] = 0;
        arr[i] = 1;
        this.setState((props) => ({selectedRowArr: arr , selectedRow : i}));
    }
    selectedName(){
        var name = (this.state.activits[this.state.selectedRow]).fname;
        return name;
    }


render() {
    const tableHeader = 
			<tr style={styles['list-table-header']}>
				<th style={styles['list-row-selection-indicator']}> </th>
				{this.state.header.map((field, i) =>
				<th key={i} style={{...styles['list-table-header-field'], ...(!field.visibility?{'display':'none'}:'')}}>
                    {field.title+" "}
                    {field.icon!=""?<FontAwesomeIcon icon={field.icon}></FontAwesomeIcon>:''}
				</th>)}
            </tr>;
    let selectedName = (this.state.activits[this.state.selectedRow]).fname;
	return (
		<div style={{'height':'100vh','fontWeight':'540'}}>
            <style jsx global>{`
					/* width */
                    ::-webkit-scrollbar {
                        width: 5px;
                    }
                    
                    /* Track */
                    ::-webkit-scrollbar-track {
                        background: rgb(169,169,169); 
                    }
                     
                    /* Handle */
                    ::-webkit-scrollbar-thumb {
                        background:rgba(86, 95, 108, .9); 
                    }
                    
                    /* Handle on hover */
                    ::-webkit-scrollbar-thumb:hover {
                        background: rgba(86, 95, 108, .9); 
                    }
				`}
				</style>
			<Meta/>
			<Nav name={(this.state.activits[this.state.selectedRow]).fname} lname={(this.state.activits[this.state.selectedRow]).lname} phone={(this.state.activits[this.state.selectedRow]).phone} ></Nav>
            <div style={styles['right-panel']}>
                  <table>
                     <thead style={{...styles['row'],...styles['info_table']}}>
                         {tableHeader}
                     </thead>
                     <tbody style={styles['row1']}>
                     {
                       this.state.activits.map((person, i) =>
                         <SelectableRow key={i} data={person} num={i} selected = {this.state.selectedRowArr[i]}
                         onSelect ={this.handleSelection.bind(this,i)}/>)}
                     </tbody>
                  </table>
                  <div style = {styles['chevron-style']}>
                      <br/>עוד שמות <FontAwesomeIcon icon="chevron-circle-down"/><br/>
                      المزبد من الاسماء
                  </div>
                  <div style = {{...styles['query'],...styles['space']}}>
                  העתק טקסט &nbsp; <FontAwesomeIcon icon="copy"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<ToggleSwitch/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; 
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; מסכימ/ה להגיע להפגנה 
                  </div>
        
                  <div style = {styles['query']}>
                  העתק טקסט &nbsp; <FontAwesomeIcon icon="copy"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<ToggleSwitch/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; 
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; מסכימ/ה לתרום לתנועה 
                  </div>
                  <div style = {{...styles['query'],...styles['space']}}>
                      <div>
                     הסרה מהרשימה &nbsp; <FontAwesomeIcon icon="user-times"/><br/>
                     ازالة من القائمة
                     </div>
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                     <div>
                     להתקשר בשעה &nbsp; <FontAwesomeIcon icon="clock"/><br/>
                     الاتصال في الساعة
                     </div>
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                     <div>
                     לא עונים &nbsp; <FontAwesomeIcon icon="microphone-slash"/><br/>
                     لا بجيب
                     </div>
                     
                  </div>
            </div>
            <div style={styles['left-panel']}>
            <textarea style = {styles['talking-scenario']}>
            .שלום ישראל ישראלי מדבר עמד עמעדי מעומדים ביחד
            מסכימ/ה להגיע להפגנהמסכימ/ה לתרום לתנועהורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית קוואזי במר מודוף. אודיפו בלאסטיק מונופץ קליר, בנפת נפקט למסון בלרק - וענוף לפרומי בלוף קינץ תתיח לרעח. לת צשחמי צש בליא, מנסוטו צמלח לביקו ננבי, צמוקו בלוקריה שיצמה ברורק.ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג ישבעס.קולורס מונפרד אדנדום סילקוף, מרגשי ומרגשח. עמחליף להאמית קרהשק סכעיט דז מא, מנכם למטכין נשואי מנורך. קולורס מונפרד אדנדום סילקוף, מרגשי ומרגשח. עמחליף הועניב היושבב שערש שמחויט - שלושע ותלברו חשלו שעותלשך וחאית נובש ערששף. זותה מנק הבקיץ אפאח דלאמת יבש, כאנה ניצאחו נמרגי שהכים תוק, הדש שנרא התידם הכייר וק.סחטיר בלובק. תצטנפל בלינדו למרקל אס לכימפו, דול, צוט ומעיוט - לפתיעם ברשג - ולתיעם גדדיש. קוויז דומור ליאמום בלינך רוגצה. לפמעט מוסן מנת. ושבעגט ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג ישבעס.הועניב היושבב שערש שמחויט - שלושע ותלברו חשלו שעותלשך וחאית נובש ערששף. זותה מנק הבקיץ אפאח דלאמת יבש, כאנה ניצאחו נמרגי שהכים תוק, הדש שנרא התידם הכייר ו
            </textarea>
            </div>
		</div>
	)
}

}

