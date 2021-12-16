import React from "react";
import "./voting/Voting.scss";
import Meta from "../lib/meta";
import server from "../services/server";
import af from "../services/arrayFunctions";
import Modal from "react-modal";
import logo from "../static/logo_purple.svg"
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTimes, faInfoCircle, faInfo, faCircle} from '@fortawesome/free-solid-svg-icons'
import cookie from 'js-cookie';

library.add(faTimes, faInfoCircle, faInfo, faCircle);

const MAX_VOTES = 15;

export default class Voting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      candidates: [],
      selected: [],
      finishedSelecting: false,
      code: "",
      openPopup: false,
      openCandidateDetails: false,
      focusedCandidate: 0
    };

    server.get("candidates/fetchCandidates", {}).then(candidates => {
      if (candidates.length){
          let seed = cookie.get('seed')
          if(!seed) {
              seed = String(Date.now())
              cookie.set('seed', seed)
          }
          this.setState({ candidates: af.seedShuffle(candidates, seed) });
      }
    });

    this.validateCode = this.validateCode.bind(this);
    //used to auto-scroll back to the voting code input
    this.codeFormRef = React.createRef();

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
        code: this.state.code.trim()
      })
      .then(isValid => {
        if (isValid) {
          alert("כן! אפשר להצביע\n نعم! يمكنك التصويت");
        } else {
          alert(
            "הקוד שגוי, או כבר משומש\n" +
              "تمّ تلقّي التصويت الخاص بهذا الكود"
          );
        }
      });
  }

  handleSubmitVote() {
      if(this.state.code === "") {
          alert("שימו לב לא לשכוח להזין קוד הצבעה");
          window.scrollTo(0, this.codeFormRef.current.offsetTop - 200);
          return;
      }
      this.setState({ openPopup: true });
  }

  handleEventPopupToggle() {
    let openPopup = this.state.openPopup;
    this.setState({ openPopup: !openPopup });
  }

  handleCandidatePopupToggle = function(focusedCandidate) {
    let openPopup = this.state.openCandidateDetails;
    this.setState({
      openCandidateDetails: !openPopup,
      focusedCandidate: focusedCandidate ? focusedCandidate : 0
    });
  }.bind(this);

  sendVote() {
    if (this.state.attemptedPost) return;
    this.setState({ attemptedPost: true }, () => {
      server
        .post("candidates/placeVote", {
          votes: this.state.selected,
          code: this.state.code.trim()
        })
        .then(res => {
          if (res) {
            alert("תודה רבה על ההצבעה!\nشكرًا جزيلًا على التصويت!");
            this.setState({
                selected: [],
                finishedSelecting: false,
                code: "",
                openPopup: false,
                attemptedPost: false
            });
          } else {
            alert(
              "הקוד שגוי, או כבר אינו תקף.\n" +
                " ההצבעה לא נקלטה\n" +
                "ألكود الذي بحوزتك ليس صالح الفعالية.\n" +
                "لم يتمّ استيعاب التصويت"
            );
            this.setState({
                openPopup: false,
                attemptedPost: false
            });
            window.scrollTo(0, this.codeFormRef.current.offsetTop - 200);
          }
        });
    });
  }

  generateCandidate(candidate, index) {
    const isSelected = this.state.selected.includes(candidate._id);
    const selectedClass = isSelected ? "selected" : "";
    const finishedSelecting = this.state.finishedSelecting;
    const isDisabled = finishedSelecting && !isSelected;
    const disabledClass = isDisabled ? "disabled" : "";
    const photo = candidate.photo ? candidate.photo.replace(" ", "%20") : "";
    const photoAlign = candidate.photoAlign;
    return (
      <div
        className={"candidate " + selectedClass + disabledClass}
        key={candidate._id}
      >
        <div className="candidate-picture-wrap">
            <div className="fa-stack candidate-picture-info">
            <FontAwesomeIcon icon={faCircle} className="fa-stack-2x" style={{fontSize: 11, color:'black'}}/>
            <FontAwesomeIcon icon={faInfoCircle} className="fa-stack-2x" style={{fontSize: 10, color:'darkGrey'}}/>
            <FontAwesomeIcon icon={faInfo} className="fa-stack-1x" style={{fontSize: 10, color:'white'}} />
            </div>
            <div
            className="candidate_picture"
            style={{
                backgroundImage: `url(${photo})`,
                backgroundPosition: photoAlign
            }}
            onClick={() => {
                this.handleCandidatePopupToggle(index);
            }}
          />
        </div>
        <div className="candidate-details-wrap">
          <div className="candidate_name">
          <span className="candidate_name_lang">
            {candidate.firstNameAr + " " + candidate.lastNameAr}
          </span>
                <span className="candidate_name_lang">
            {candidate.firstName + " " + candidate.lastName}
          </span>
            </div>
            <div className={"candidate-selection-wrap"}>
                <label
                    htmlFor={"select-candidate-" + candidate._id}
                    className="candidate-selection-label"
                >
                    <div>تصويت</div>
                    <div>בחירה</div>
                </label>
                <input
                    type="button"
                    className={
                        "candidate-selection-button " + selectedClass + disabledClass
                    }
                    id={"select-candidate-" + candidate._id}
                    value={isSelected ? "✔" : ""}
                    onClick={this.selectCandidate.bind(this, candidate._id)}
                />
            </div>
        </div>
      </div>
    );
  }

  render() {
      /*return (
        <div style={{display:"flex", alignItems: "center", flexDirection:"column"}}>
          <img
            alt={"logo"}
            src={logo}
            width={250}
            className={"voting-logo"}
          />
          <h1 style={{ color: "#90278e", paddingTop: 50 }}>
            Voting Is Closed
          </h1>
        </div>
      );*/
    const candidates = this.state.candidates.slice();
    const focusedCandidateIndex = this.state.focusedCandidate;
    const focusedCandidate = candidates[focusedCandidateIndex]
      ? candidates[focusedCandidateIndex]
      : {};
    const focusedCandidatePhoto = focusedCandidate.photo
      ? focusedCandidate.photo.replace(" ", "%20")
      : "";
    const focusedCandidatePhotoAlign = focusedCandidate.photoAlign;
    return (
      <div className={"page page-wrap-voting"}>
        <Meta />
        <img
            alt={"logo"}
            src={logo}
             width={250}
            className={"voting-logo"}
        />
          <div className={"introduction-wrap"}>
              <h1 className="voting-title">
                  {"בחירות למזכירות עומדים ביחד"}
              </h1>
              <h3 className="introduction-paragraph hebrew">
                  ניתן להצביע ל13 מועמדות ומועמדים לכל היותר
              </h3>
          </div>
        <div className="code_validation" ref={this.codeFormRef}>
          <form className="form">
            <div className="code-input-wrap">
              <label htmlFor="code-input" className="code-input-label">
                  <div>
                      كلمة السر للتصويت:
                  </div>
                  <div>
                      קוד הצבעה:
                  </div>
              </label>
              <input
                type="text"
                name="code"
                placeholder={"إدخال الرمز هنا • להזין קוד פה"}
                className="code_input"
                id="code-input"
                maxLength="6"
                size="25"
                value={this.state.code}
                onChange={e => {
                  this.setState({ code: e.target.value });
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    this.validateCode();
                    e.preventDefault();
                    return false;
                  }
                }}
              />
            </div>
            <input
              type="button"
              id=""
              value={"האם הקוד שלי תקף? هل الكود الذي أملكه صالح الفعالية؟"}
              className="code_button"
              onClick={this.validateCode}
            />
          </form>
        </div>
        <div className="candidates">
          {this.state.candidates.map((x, i) => {
            return this.generateCandidate(x, i);
          })}
        </div>
        <div className="center-content">
          <input
            className="vote_button"
            type="submit"
            value="סיימתי أنهيت"
            onClick={this.handleSubmitVote.bind(this)}
          />
        </div>
        <Modal
          isOpen={this.state.openPopup}
          onRequestClose={this.handleEventPopupToggle.bind(this)}
          ariaHideApp={false}
          style={{
            overlay: {
                backgroundColor: "rgba(60,60,60,0.8)", zIndex: 2
            },
            content: {
                height: "fit-content",
                direction: "rtl"
            }
          }}
        >
          <div>
            <button type={"button"}
                onClick={this.handleEventPopupToggle.bind(this)}
                className={"close-popup-button"}
            >
                <FontAwesomeIcon icon={faTimes}/>
            </button>
            <h3 className="hebrew finish-popup-content">
              האם את/ה בטוח/ה בהצבעה? אי אפשר יהיה לבטל אח״כ
              <br />
              هل أنت متأكد/ة من تصويتك؟ لا يمكن إلغاؤه لاحقًا
            </h3>
            <button type={"button"} className="vote_button" onClick={this.sendVote.bind(this)}
                    style={{
                        "border": "2px solid #90278e",
                        "margin": "0 auto",
                        "display": "block"
                    }}>
              {"כן כן, זו ההצבעה שאני רוצה\n" +
                "نعم نعم، هذا التصويت الذي أريده"}
            </button>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.openCandidateDetails}
          onRequestClose={this.handleCandidatePopupToggle}
          ariaHideApp={false}
          style={{
            overlay: {
              backgroundColor: "rgba(60,60,60,0.8)", zIndex: 2
            },
            content: {
              height: "calc(100vh - 120px)", direction: 'rtl'
            }
          }}
        >
          <div>
            <button type={"button"}
              onClick={this.handleCandidatePopupToggle}
              className={"close-popup-button"}
            >
                <FontAwesomeIcon icon={faTimes}/>
            </button>
            <div
              className="popup-candidate-picture"
              style={{
                  backgroundImage: `url(${focusedCandidatePhoto})`,
                  backgroundPosition: focusedCandidatePhotoAlign
              }}
            />
            <div className="popup-candidate-description hebrew">
              <div style={{color: '#90278e', fontSize: '1.15em', lineHeight: '1.15em'}}>כמה מילים על המועמד/ת بعض الكلمات عن المرشّح/ة</div>
              {focusedCandidate.text1
                ? focusedCandidate.text1
                    .split("\n")
                    .map((paragraph, i) => (
                      <p key={"paragraph_" + i}>{paragraph}</p>
                    ))
                : ""}
                <div style={{color: '#90278e', fontSize: '1.15em'}}>חזון פוליטי الرؤوية السياسية</div>
              {focusedCandidate.text2
                ? focusedCandidate.text2
                    .split("\n")
                    .map((paragraph, i) => (
                      <p key={"paragraph_" + i}>{paragraph}</p>
                    ))
                : ""}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
