import React from "react";
import style from "./voting/Voting.css";
import Meta from "../lib/meta";
import server from "../services/server";
import Modal from "react-modal";

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
            if (candidates.length) this.setState({candidates});
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
        this.setState({selected, finishedSelecting});
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
        this.setState({openPopup: true});
    }

    handleEventPopupToggle() {
        let openPopup = this.state.openPopup;
        this.setState({openPopup: !openPopup});
    }

    handleCandidatePopupToggle = function(focusedCandidate) {
        let openPopup = this.state.openCandidateDetails;
        this.setState({openCandidateDetails: !openPopup, focusedCandidate: focusedCandidate ? focusedCandidate : 0});
    }.bind(this);

    sendVote() {
        if(this.state.attemptedPost)
            return;
        this.setState({attemptedPost: true}, ()=>{
            server.post("candidates/placeVote", {
                votes: this.state.selected,
                code: this.state.code
            })
            .then(res => {
                if (res) {
                    alert("תודה רבה על ההצבעה!");
                } else {
                    alert("הקוד שלך כבר לא תקף. ההצבעה לא נקלטה");
                }
                this.setState({
                    selected: [],
                    finishedSelecting: false,
                    code: "",
                    openPopup: false,
                    attemptedPost: false
                });
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
        return (
            <div className={"candidate " + selectedClass + disabledClass}
                key={candidate._id}>
                <div className="candidate-picture-wrap">
                    <div className="candidate_picture" style={{backgroundImage: `url(${photo})`}} onClick={()=>{this.handleCandidatePopupToggle(index)}}/>
                </div>
                <div className="candidate_name">
                    <span className="candidate_name_lang">{candidate.firstName + " " + candidate.lastName}</span>
                    <span className="candidate_name_lang">{candidate.firstNameAr + " " + candidate.lastNameAr}</span>
                </div>
                <div className={"candidate-selection-wrap"}>
                    <label htmlFor={"select-candidate-" + candidate._id} className="candidate-selection-label">
                        בחירה
                    </label>
                    <input
                        type="button"
                        className={"candidate-selection-button " + selectedClass + disabledClass}
                        id={"select-candidate-" + candidate._id}
                        value = {isSelected ? "✔" : ""}
                        onClick={this.selectCandidate.bind(this, candidate._id)}
                    >
                    </input>
                </div>
                {/**<div>
                    <div className="p-4 bg-white p-relative">
                        <div className="line-height-15 mb-0">
                            <div className="candidate_description">
                                <p>{candidate.text1}</p>
                                <p>{candidate.text2}</p>
                            </div>
                        </div>
                    </div>
                </div>**/}
            </div>
        );
    }

    render() {
        const candidates = this.state.candidates.slice();
        const focusedCandidateIndex = this.state.focusedCandidate;
        const focusedCandidate = candidates[focusedCandidateIndex] ? candidates[focusedCandidateIndex] : {};
        const focusedCandidatePhoto = focusedCandidate.photo ? focusedCandidate.photo.replace(" ", "%20") : "";
        return (
            <div className="page">
                <Meta/>
                <style jsx global>
                    {style}
                </style>
                <img src={"./static/logo_purple.svg"} width={250} className={"voting-logo"}/>
                <h1 className="voting-title">
                    {"בחירות לצוות התיאום הארצי של תנועת עומדים ביחד"}
                </h1>
                <h1 className="voting-title">
                    {"انتخابات لطاقم التنسيق القطريّ لحراك نقف معًا"}
                </h1>
                <h3 className="introduction-paragraph">
                    צוות התיאום הארצי של התנועה – המהווה את הנהגת התנועה – נבחר באופן דמוקרטי ובבחירות חשאיות וישירות בידי חברות וחברי התנועה. באסיפה הארצית תוכל כל חברה לבחור 15 מועמדות ומועמדים לכל היותר, כאשר לבסוף יבחרו 25 חברות וחברים לצוות התיאום הארצי. בחודש שלאחר האסיפה הארצית יתקיימו בחירות גם במעגלים המקומיים, וייבחרו לצוות התיאום הארצי חברות וחברים נוספים, כנציגי המעגלים.
                </h3>
                <h3>
                    על מנת להצביע יש להזין את הקוד שקיבלתם בדוכן ההרשמה. ניתן להצביע רק פעם אחת, עבור 15 מתמודדים/ות לכל היותר. לאחר בחירת המועמדים/ות יש לאשר את הבחירה על ידי לחיצה ״סיימתי״, על מנת להשלים את תהליך הבחירה.
                </h3>
                <h3>
                    הקוד הוא אקראי ואינו מאפשר את זיהוי הבוחר/ת.
                </h3>
                <h3>
                    אם אתן/ם נתקלים/ות בקשיים בבקשה פנו לעזרה מאחד הפעילים/ות בעמדת ההצבעה.
                </h3>
                <h3 className="introduction-paragraph">
                    طاقم التنسيق القطري للحراك - الذي يمثل قيادة الحراك - يُنتخَب بشكلٍ ديمقراطيّ وبانتخاباتٍ سرية ومباشرة على يد عضوات وأعضاء الحراك. في الاجتماع القطريّ سيكون بإمكان كل عضوة انتخاب ١٥ مرشحة ومرشح على الأكثر، بحيث أنه بنهاية المطاف سيتم انتخاب ٢٥ عضوة وعضو لطاقم التنسيق القطري. بالشهر الذي سيلي الاجتماع القطري ستقام انتخابات أيضًا في الحلقات المحلية، وسيُنتخَب لطاقم التنسيق القطري عضوات وأعضاء إضافيين، كمندوبين عن الحلقات.
                </h3>
                <h3>
                    لكي يتسنى للجميع التصويت يجب إدخال كلمة السر التي ستُوزَع بكشك التسجيل. يمكن التصويت لمرة واحدة فقط، ل-١٥ مرشح/ة على الأكثر. بعد انتخاب المرشحين يجب تأكيد الاختيار عبر الضغط على "أنهيت"، من أجل إتمام عملية الانتخاب.
                </h3>
                <h3>
                    كلمة السر هي عشوائية ولا يمكنها الكشف عن هوية الناخب/ة.
                </h3>
                <h3>
                    بحال واجهتم/ن مشاكل أو صعوبات اطلبوا المساعدة من أحد الناشطين/ات بزاوية التصويت.
                </h3>
                <div className="code_validation">
                    <form className="form">
                        <div className="code-input-wrap">
                        <label htmlFor="code-input" className="code-input-label">
                            קוד הצבעה إلينا:
                        </label>
                        <input
                            type="text"
                            name="code"
                            placeholder={"123456"}
                            className="code_input"
                            id="code-input"
                            maxLength="6"
                            size="8"
                            value = {this.state.code}
                            onChange={e => {this.setState({code: e.target.value});}}
                            onKeyDown={e => {if(e.key === 'Enter'){this.validateCode(); e.preventDefault(); return false;}}}
                        />
                        </div>
                        <input
                            type="button"
                            id=""
                            value="האם הקוד שלי תקף? انضموا إلينا?"
                            className="code_button"
                            onClick={this.validateCode}
                        />
                    </form>
                </div>
                <div className="candidates">
                    {this.state.candidates.map((x, i)=>{return this.generateCandidate(x, i)})}
                </div>
                <div className="center-content">
                    <input
                        className="vote_button"
                        type="submit"
                        value="סיימתי! انضموا إلينا"
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
                            height: "max-content"
                        }
                    }}
                >
                    <div>
                        <button onClick={this.handleEventPopupToggle.bind(this)} className={"close-popup-button"}>
                            ⬅
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
                <Modal
                    isOpen={this.state.openCandidateDetails}
                    onRequestClose={this.handleCandidatePopupToggle}
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
                        <button onClick={this.handleCandidatePopupToggle} className={"close-popup-button"}>
                            ⬅
                        </button>
                        <div className="popup-candidate-picture" style={{backgroundImage: `url(${focusedCandidatePhoto})`}}/>
                        <div className="popup-candidate-description">
                        {
                            focusedCandidate.text1 ? focusedCandidate.text1.split("\n").map((paragraph, i)=><p key={"paragraph_" + i}>{paragraph}</p>) : ""
                        }
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
