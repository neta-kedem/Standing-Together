import css from "styled-jsx/css";
export default css`
@media (max-width: 768px) {
.candidate {
    height: auto;
    flex-direction: column;
  }
  .candidates {
    flex-direction: column;
    margin: 0;
  }
  .candidate_picture {
    border-left: 0;
  }
}
.page{
	font-family: Assistant, Cairo, Rubik, sans-serif;
	width: 85%;
	margin: 0 auto;
	direction: rtl;
}
.page input, .page textarea, .page select, .page button {
    font-family: Assistant, Cairo, Rubik, sans-serif !important;
}
.voting-logo{
    margin: 100px auto 25px;
    display: block;
}
.voting-title {
    margin: auto auto 10px;
    color: #242424;
    line-height: 32px;
    font-weight: 600;
    text-align: center;
}
.introduction-paragraph{
    margin-right: auto;
    margin-left: auto;
    padding-top: 20px;
    text-align: right;
    direction: rtl;
}
.code_validation {
    padding-bottom: 20px;
}
.code-input-wrap{
    display: block;
    text-align: center;
    color: #90278e;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 10px;
    font-size: 24px;
    line-height: 30px;
    font-weight: 700;
}
.code-input-label{
    display: inline-block;
    color: #90278e;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 10px;
    font-size: 24px;
    line-height: 30px;
    font-weight: 700;
}
.code_input{
    display: inline-block;
    color: #90278e;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 10px;
    font-size: 20px;
    line-height: 20px;
    font-weight: 700;
    border: none;
    border-bottom: 2px solid #90278e;
    outline: none;
}
.code_button {
    display: block;
    padding: 9px 15px;
    margin: 0 auto;
    cursor: pointer;
    border: 2px solid #90278e;
    border-radius: 10px;
    background-color: #fff;
    transition: background-color 0.5s;
    color: #90278e;
    font-weight: 700;
    font-size: 24px;
    line-height: 30px;
    text-align: center;
    outline: none;
}
.candidates {
  display: flex;
  flex-direction: column;
  margin: 0 20px;
}
.candidate {
  display: flex;
  flex: 0 0 calc(50% - 20px);
  padding: 20px 10px 20px;
  border: none;
  border-bottom: 2px solid #90278e;
  transition: background-color 0.2s, box-shadow 0.5s;
}
.candidate.selected {
  background-color: rgba(144, 39, 142, 0.1);
  box-shadow: 0px 0px 30px #90278e15 inset;
}
.candidate.disabled {
  background-color: rgba(144, 144, 144, 0.1);
  box-shadow: 0px 0px 30px #00000015 inset;
}
.candidate-member {
  flex: 0 0 100%;
}
.candidate_picture {
  width: 100px;
  height: 100px;
  background-size: cover;
}
.candidate_details{
    padding: 13px;
}
.candidate_name {
  display: flex;
  flex-direction: row;
  color: black;
  font-size: 32px;
  line-height: 36px;
  font-weight: 400;
}
.candidate_name_lang{
    margin-left: 20px;
}
.candidate_circle{
    margin-top: 10px;
    font-size: 24px;
    line-height: 30px;
    font-weight: 700;
    color: #90278e;
}
.candidate-selection-wrap{
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: left;
    margin-right: auto;
}
.candidate-selection-label{
    cursor: pointer;
    margin-top: 5px;
    margin-bottom: 5px;
    padding-left: 20px;
    font-size: 32px;
    line-height: 36px;
    font-weight: 400;
    color: #90278e;
}
.candidate-selection-button{
    cursor: pointer;
    color: white;
    border: 2px solid #90278e;
    border-radius: 30px;
    width: 60px;
    height: 60px;
    background: none;
    outline: none;
    transition: background-color 0.3s, box-shadow 0.5s;
    font-size: 2em;
    line-height: 100%;
}
.candidate-selection-button.selected{
    border: 2px solid #fff;
    background-color: #90278e !important;
}
.candidate-selection-button.disabled{
    background-color: #ddd !important;
    cursor: not-allowed;
}
.candidate-selection-button:hover{
    background-color: #eee;
    box-shadow: 0px 0px 8px #00000030 inset;
}
.candidate-selection-button:active{
    background-color: #ccc;
}
.candidate_description {
  overflow: hidden;
  padding: 10px;
  font-size: 1.5em;
  direction: ltr;
  text-align: right;
}
.vote_button {
    display: block;
    padding: 9px 15px;
    margin: 2.5% auto;
    cursor: pointer;
    border: 2px solid #90278e;
    border-radius: 10px;
    background-color: #fff;
    transition: background-color 0.5s;
    color: #90278e;
    font-weight: 700;
    font-size: 24px;
    line-height: 30px;
    text-align: center;
    outline: none;
}
.hebrew {
  direction: ltr;
  text-align: right;
}
.center-content {
  display: flex;
  justify-content: center;
}
.close-popup-button{
    display: block;
    cursor: pointer;
    background-color: rgb(144, 39, 142);
    color: white;
    font-size: 2em;
    line-height: 0.5em;
    font-weight: 700;
    text-align: center;
    padding: 9px 15px;
    border: none;
    border-radius: 5px;
    outline: none;
}
.popup-candidate-picture{
    margin: 0 auto;
    width: 20vw;
    height: 20vw;
    background-size: cover;
    border-radius: 100%;
}
.popup-candidate-description{
    max-height: calc(100vh - 120px - 20vw - 4em);
    padding: 0 2em;
    box-sizing: border-box;
    overflow: auto;
    direction: rtl;
    text-align: right;
    margin-top: 2em;
}
.vote_button:hover, .code_button:hover{
    background-color: #90278e15;
}
.vote_button:hover, .code_button:active{
    background-color: #90278e25;
}
`;
