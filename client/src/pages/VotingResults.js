import React from "react";
// import style from "./voting/Voting.scss";
import Meta from "../lib/meta";
import server from "../services/server";
import ReactDOM from "react-dom";
import BarChart from "../UIComponents/BarChart/BarChart";

export default class VotingResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      candidates: [],
      selected: [],
      finishedSelecting: false,
      code: "",
      openPopup: false,
      candidateNames: [],
      votingSet: [],
      votesTotal: 0
    };

    let getCandidates = server.get("candidates/fetchCandidates", {});
    let getVotes = server.get("votes/fetchAllVotes", {});
    Promise.all([getCandidates, getVotes]).then(([candidates, votes]) => {
      this.setState({ votes, votesTotal: votes.length });

      let allVotes = [];
      votes.forEach(vote => (allVotes = allVotes.concat(vote.votes)));
      candidates.forEach(candidate => {
        let votes = allVotes.reduce(
          (acc, curr) => acc + (curr == candidate._id),
          0
        );
        candidate.votes = votes;
      });

      candidates.sort((a, b) => b.votes - a.votes);
      let votingData = candidates.map(candidate => candidate.votes);

      let candidateNames = candidates.map(
        candidate => candidate.firstName + " " + candidate.lastName
      );
      this.setState({ candidates, candidateNames });

      // forcing the bar to start at 0
      votingData.push(0);
      const votingSet = [
        {
          label: "קולות",
          backgroundColor: "rgba(144,39,142,0.2)",
          borderColor: "rgba(144,39,142,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(144,39,142,0.4)",
          hoverBorderColor: "rgba(144,39,142,1)",
          data: votingData
        }
      ];
      this.setState({ votingSet });
    });
  }

  render() {
    return (
      <div className="page">
        <Meta />
        <BarChart
          lables={this.state.candidateNames}
          data={this.state.votingSet}
          votesTotal={this.state.votesTotal}
        />
        <div>
          {
            this.state.candidateNames.map((candidate, i) => {
              return <div>{candidate},{((this.state.votingSet[0] || {data:[0]})).data[i]}</div>
            })
          }
        </div>
      </div>
    );
  }
}
