import React from "react";
import style from "./voting/Voting.css";
import Meta from "../lib/meta";
import server from "../services/server";
import ReactDOM from "react-dom";
import Modal from "react-modal";

const MAX_VOTES = 1;

export default class Voting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      candidates: [],
      selected: [],
      finishedSelecting: false,
      code: "",
      openPopup: false
    };

    server.get("candidates/fetchCandidates", {}).then(candidates => {
      if (candidates.length) this.setState({ candidates });
    });

    // this.selectCandidate = this.selectCandidate.bind(this);
    this.generateCandidate = this.generateCandidate.bind(this);
    this.validateCode = this.validateCode.bind(this);
  }

  selectCandidate(id) {
    let selected = this.state.selected;
    let finishedSelecting = selected.length === MAX_VOTES;
    if (selected.includes(id)) {
      selected = selected.filter(index => index !== id);
    } else if (!finishedSelecting) {
      selected.push(id);
    }
    finishedSelecting = selected.length === MAX_VOTES;
    this.setState({ selected, finishedSelecting });
  }

  validateCode() {
    server
      .post("candidates/validateCode", {
        code: this.state.code
      })
      .then(isValid => {
        if (isValid) {
          alert("כן! אפשר להצביע");
        } else {
          alert("המון תודה על ההתלהבות, אבל כבר הצבעת");
        }
      });
  }

  handleSubmitVote() {
    this.setState({ openPopup: true });
  }

  handleEventPopupToggle() {
    let openPopup = this.state.openPopup;
    this.setState({ openPopup: !openPopup });
  }
  sendVote() {
    server
      .post("candidates/placeVote", {
        votes: this.state.selected,
        code: this.state.code
      })
      .then(res => {
        if (res) {
          alert("תודה רבה על ההצבעה!");
        } else {
          alert("הקוד שלך כבר לא תקף. ההצבעה לא נקלטה");
        }
      });
  }

  generateCandidate(candidate) {
    const isSelected = this.state.selected.includes(candidate._id);
    const selectedClass = isSelected ? "selected" : "";
    const finishedSelecting = this.state.finishedSelecting;
    const isDisabled = finishedSelecting && !isSelected;
    const disabledClass = isDisabled ? "disabled" : "";

    return (
      <div
        className={"candidate " + selectedClass + disabledClass}
        onClick={this.selectCandidate.bind(this, candidate._id)}
        key={candidate._id}
      >
        <div
          className={"candidate_image_wrapper " + selectedClass + disabledClass}
        >
          <div
            className="candidate_picture"
            style={{
              backgroundImage: `url(${candidate.photo})`
            }}
          />
          <div className="candidate_name">
            {candidate.firstName + " " + candidate.lastName}
          </div>
          <div className="candidate_name">{candidate.circle}</div>
        </div>
        <div>
          <div className="p-4 bg-white p-relative">
            <div className="line-height-15 mb-0">
              <div className="candidate_description">
                <p>{candidate.text1}</p>
                <p>{candidate.text2}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="page">
        <Meta />
        <style jsx global>
          {style}
        </style>
        <h2 className="voting-title">
          {"בחירות לצוות התיאום הארצי של תנועת עומדים ביחד"}
        </h2>
        <h2 className="voting-title">
          {"انتخابات لطاقم التنسيق القطريّ لحراك نقف معًا"}
        </h2>
        <h3 className="voting-title">
          {
            "ההנהגה הארצית מורכבת משני גופים: צוות התיאום הארצי והמזכירות. צוות התיאום הארצי הוא גוף רחב, הנפגש אחת לחודשיים ומורכב מנציגים מהמעגלים המקומיים של התנועה וכן מ-25 נציגים שנבחרים בבחירות ישירות וחשאיות באסיפה הארצית. תפקידו לייצג את החברים והחברות בתנועה במהלך השנה, להתוות אסטרטגיה ארוכת טווח לתנועה, הכוללת קביעת סדרי עדיפויות והחלטה על קמפיינים יזומים ארוכי-טווח, ולבקר את עבודת המזכירות. מזכירות התנועה הוא גוף מצומצם אשר נבחר מתוך צוות התיאום הארצי, במטרה להוציא אל הפועל את האסטרטגיה התנועתית ולנהל את התנועה ברמה היומיומית. "
          }
        </h3>
        <h3 className="voting-title">
          {
            "تتكون القيادة القطرية من جسمين: طاقم التنسيق القطري والسكرتارية. طاقم التنسيق القطري هو جسم واسع يلتقي أعضاؤه كل شهرين ويتألف من ممثلين وممثلات عن الحلقات المحلية للحراك، بالإضافة إلى ٢٥ ممثلاً وممثلة منتخبون ومنتخبات بانتخابات مباشرة وسرية في الاجتماع القطري. يهدف طاقم التنسيق القطري لتمثيل أعضاء الحراك خلال العام، بناء استراتيجية طويلة الأمد للحراك - تشمل تحديد وترتيب الأولويات واتخاذ القرارات بشأن الحملات طويلة الأمد التي يبادر لها الحراك - والإشراف على عمل السكرتارية. سكرتارية الحراك هي جسم مصغّر منتخَب من طاقم التنسيق القطري، من أجل تنفيذ استراتيجية الحراك وإدارته على أساس يومي."
          }
        </h3>
        <div className="code_validation">
          <form className="form">
            <input
              type="button"
              value="האם הקוד שלי תקף"
              className="code_button"
              onClick={this.validateCode}
            />
            <input
              type="text"
              name="code"
              placeholder={"123456"}
              className="code_input"
              maxLength="6"
              size="8"
              onChange={e => this.setState({ code: e.target.value })}
            />
          </form>
        </div>

        <div className="candidates">
          {this.state.candidates.map(this.generateCandidate)}
        </div>
        <div className="center-content">
          <input
            className="vote_button"
            type="submit"
            value="יאללה, נצביע"
            onClick={this.handleSubmitVote.bind(this)}
          ></input>
        </div>
        <Modal
          isOpen={this.state.openPopup}
          onRequestClose={this.handleEventPopupToggle.bind(this)}
          ariaHideApp={false}
          style={{
            overlay: {
              backgroundColor: "rgba(60,60,60,0.8)"
            },
            content: {
              height: "max-content"
            }
          }}
        >
          <div>
            <button onClick={this.handleEventPopupToggle.bind(this)}>
              close
            </button>
            <h3 className="hebrew">
              {
                "אני פופ אפ חברותי שמוודא שהלחיצה הייתה בכוונה. פשוט אי אפשר לתקן לאחר האישור"
              }
            </h3>
            <button className="code_button" onClick={this.sendVote.bind(this)}>
              {"כן כן, זו ההצבעה שאני רוצה"}
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}
