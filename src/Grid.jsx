import React, { Component } from "react";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

// import "./Node.css";

export default class SingleGrid extends Component {
  render() {
    const {
      row,
      col,
      height,
      width,
      isWall,
      isStart,
      isGoal,
      agentId,
      color,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    } = this.props;
    console.log(width + " " + height);
    var gridColor = isWall ? "#626262" : color;
    const content =
      (isStart ? "S_" : "") +
      (isGoal ? "G_" : "") +
      (agentId > 0 ? agentId : " ");
    return (
      <div
        id={`grid-${row}-${col}`}
        className="grid"
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
        style={{
          // flex: 1,
          color: "#222222",
          border:
            isWall || isStart || isGoal ? "" : "1px solid rgb(130, 130, 130)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: gridColor,
          height: height,
          width: width,
          textAlign: "center",
          lineHeight: "normal",
          verticalAlign: "middle",
        }}
      >
        <InlineMath math={content} />
      </div>
    );
  }
}
