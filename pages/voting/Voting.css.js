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

.page {
  padding: 10px 0;
}
.candidate {
  display: flex;
  flex: 0 0 calc(50% - 20px);
  margin-bottom: 40px;
  border: 4px solid rgba(144, 39, 142, 0.5);
}
.candidate.selected {
  border-color: rgba(144, 39, 142, 1);
}
.candidate.disabled {
  border-color: rgba(144, 144, 144, 1);
}
.candidate-member {
  flex: 0 0 100%;
}
.candidates {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 20px;
}

.candidate_picture {
  width: 240px;
  height: 240px;
  background-size: cover;
}
.candidate_name {
  display: flex;
  flex-direction: column;
  color: white;
  padding: 10px;
  font-size: 2em;
}
.candidate_image_wrapper {
  display: flex;
  flex-direction: column;
  background-color: rgba(144, 39, 142, 0.5);
  align-items: center;
}
.candidate_image_wrapper.selected {
  background-color: rgba(144, 39, 142, 1);
}
.candidate_image_wrapper.disabled {
  background-color: rgba(144, 144, 144, 1);
}
.voting-title {
  text-align: center;
  padding: 3px 10px;
}
.candidate_description {
  overflow: hidden;
  padding: 10px;
  font-size: 1.5em;
  direction: ltr;
  text-align: right;
}
.code_input {
  border: 2px solid rgba(14, 39, 142, 1);
  margin-left: 5px;
  font-size: 1.1em;
  padding: 5px;
}
.code_validation {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-around;
  padding-bottom: 20px;
}
.code_button {
  background-color: rgba(144, 39, 142, 1);
  color: white;
  margin-right: 5px;
  font-size: 1.3em;
  padding: 5px;
}
.vote_button {
  background-color: rgba(144, 39, 142, 1);
  color: white;
  margin-right: 5px;
  font-size: 2em;
  margin-left: 10px;
}
.hebrew {
  direction: ltr;
  text-align: right;
}
.center-content {
  display: flex;
  justify-content: center;
}
.form{
  display: flex;
}
`;
