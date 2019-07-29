import React from "react";
import style from "./voting/Voting.css";
import Meta from "../lib/meta";
import server from "../services/server";
import Modal from "react-modal";
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {faTimes} from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faTimes);


const MAX_VOTES = 4;

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
      if (candidates.length) this.setState({ candidates });
    });

    // this.selectCandidate = this.selectCandidate.bind(this);
    this.generateCandidate = this.generateCandidate.bind(this);
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
            alert("תודה רבה על ההצבעה!\n" + "شكرًا جزيلًا على التصويت!");
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
                ></input>
            </div>
        </div>
      </div>
    );
  }

  render() {
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
      <div className="page">
        <Meta />
        <style jsx global>
          {style}
        </style>
        <img
          src={"./static/logo_purple.svg"}
          width={250}
          className={"voting-logo"}
        />
        <div className={"introduction-wrap"}>
            <h1 className="voting-title">
                {"انتخابات لطاقم التنسيق القطريّ لحراك نقف معًا"}
            </h1>
            <h1 className="voting-title">
                    {"בחירות לצוות התיאום הארצי של תנועת עומדים ביחד"}
            </h1>
            <h3 className="introduction-paragraph">
                طاقم التنسيق القطري للحراك - والذي يُعتبر بمثابة قيادته - انتُخِب بطريقة ديمقراطية وبانتخابات مباشرة وسرّية.
                في انتخابات مندوبات ومندوبي حلقة تل-أبيب-يافا يمكن انتخاب حتى ٤ مرشحين ومرشحات.
            </h3>
            <h3>
                لكي يتسنى للجميع التصويت يجب إدخال كلمة السر التي ستُوزَع بكشك
                التسجيل. يمكن التصويت لمرة واحدة فقط، ل-١٥ مرشح/ة على الأكثر. بعد
                انتخاب المرشحين يجب تأكيد الاختيار عبر الضغط على "أنهيت"، من أجل إتمام
                عملية الانتخاب. لقراءة المزيد عن المرشّح/ة يجب الضغط على صورته/ا.
            </h3>
            <h3>كلمة السر هي عشوائية ولا يمكنها الكشف عن هوية الناخب/ة.</h3>
            <h3>
                بحال واجهتم/ن مشاكل أو صعوبات اطلبوا المساعدة من أحد الناشطين/ات
                بزاوية التصويت.
            </h3>
            <h3 className="introduction-paragraph">
                צוות התיאום הארצי של התנועה - המהווה את הנהגתה - נבחר בצורה דמוקרטית ובבחירות ישירות וחשאיות.
                בבחירות לנציגות ונציגי מעגל תל-אביב-יפו ניתן לבחור עד 4 מועמדים ומועמדות.
            </h3>
            <h3>
              על מנת להצביע יש להזין את הקוד שקיבלתם בדוכן ההרשמה. ניתן להצביע רק
              פעם אחת, עבור 15 מתמודדים/ות לכל היותר. לאחר בחירת המועמדים/ות יש לאשר
              את הבחירה על ידי לחיצה ״סיימתי״, על מנת להשלים את תהליך הבחירה. לקריאה
              נוספת על המועמד/ת יש ללחוץ על תמונתו/ה.
            </h3>
            <h3>הקוד הוא אקראי ואינו מאפשר את זיהוי הבוחר/ת.</h3>
            <h3>
              אם אתן/ם נתקלים/ות בקשיים בבקשה פנו לעזרה מאחד הפעילים/ות בעמדת
              ההצבעה.
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
            ></input>
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
              backgroundColor: "rgba(60,60,60,0.8)"
            },
            content: {
              height: "fit-content"
            }
          }}
        >
          <div>
            <button
              onClick={this.handleEventPopupToggle.bind(this)}
              className={"close-popup-button"}
            >
                <FontAwesomeIcon icon={faTimes}> </FontAwesomeIcon>
            </button>
            <h3 className="hebrew finish-popup-content">
              האם את/ה בטוח/ה בהצבעה? אי אפשר יהיה לבטל אח״כ
              <br />
              هل أنت متأكد/ة من تصويتك؟ لا يمكن إلغاؤه لاحقًا
            </h3>
            <button className="code_button" onClick={this.sendVote.bind(this)}>
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
              backgroundColor: "rgba(60,60,60,0.8)"
            },
            content: {
              height: "calc(100vh - 120px)"
            }
          }}
        >
          <div>
            <button
              onClick={this.handleCandidatePopupToggle}
              className={"close-popup-button"}
            >
                <FontAwesomeIcon icon={faTimes}> </FontAwesomeIcon>
            </button>
            <div
              className="popup-candidate-picture"
              style={{
                  backgroundImage: `url(${focusedCandidatePhoto})`,
                  backgroundPosition: focusedCandidatePhotoAlign
              }}
            />
            <div className="popup-candidate-description">
              {focusedCandidate.text1
                ? focusedCandidate.text1
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
