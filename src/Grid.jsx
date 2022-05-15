import React, { Component } from "react";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

// import "./Node.css";

export default class SingleGrid extends Component {
  render() {
    const { row, col, height, width, isWall, isStart, isGoal, agentId, color } =
      this.props;
    console.log(width + " " + height);
    return (
      <div
        id={`grid-${row}-${col}`}
        className="grid"
        style={{
          // flex: 1,
          color: "#222222",
          outline: "1px solid rgb(130, 130, 130)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: color,
          height: height,
          width: width,
          textAlign: "center",
          lineHeight: "normal",
          verticalAlign: "middle",
        }}
      >
        {(isStart ? "S" : "") +
          (isGoal ? "G" : "") +
          (agentId > 0 ? agentId : "")}
      </div>
    );
  }
}
