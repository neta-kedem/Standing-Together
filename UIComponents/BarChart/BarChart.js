import React from "react";
import { HorizontalBar } from "react-chartjs-2";

export default class BarChart extends React.Component {
  render(props) {
    let labels = this.props.lables;
    let datasets = this.props.data;
    return (
      <div>
        <h2 style={{textAlign:"center"}}>תוצאות זמן אמת</h2>
        <h3 style={{textAlign:"center", direction:"rtl"}}>{"הצבעות עד כה: " + this.props.votesTotal}</h3>
        <HorizontalBar
          data={{ labels, datasets }}
          width={100}
          height={50}
          options={{
            maintainAspectRatio: false,
          }}
        />
      </div>
    );
  }
}
