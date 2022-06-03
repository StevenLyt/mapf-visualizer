import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  square: {
    position: "relative",
    width: 120,
    "&::before": {
      display: "block",
      content: "''",
      paddingBottom: "100%",
    },
  },
}));

export default function SingleGrid(props) {
  const classes = useStyles();
  const {
    row,
    col,
    isWall,
    isStart,
    isGoal,
    isPlanned,
    agentId,
    color,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
  } = props;
  var gridColor = isWall ? "#626262" : color;
  var isLabel = col === -1;
  var isTopLeft = row === -1;
  const content = (isStart ? "S_" : "") + (isGoal ? "G_" : "") + (agentId > 0 ? agentId : " ");

  if (isWall) {
    console.log("isWall");
  }
  return (
    <Grid
      item
      xs={1}
      id={`grid-${row}-${col}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
      className={classes.square}
      sx={{
        border:
          isPlanned || isWall || isStart || isGoal || isLabel ? "" : "1px solid rgb(130, 130, 130)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: gridColor,
        pointerEvents: isLabel ? "none" : "auto",
        userSelect: isLabel || isStart || isGoal ? "none" : "auto",
        userDrag: "none",
      }}
    >
      {/* <MKTypography sx={{ userSelect: "none" }}> */}
      {isPlanned || isTopLeft ? "" : isLabel ? <em>{row}</em> : <InlineMath math={content} />}
      {/* </MKTypography> */}
    </Grid>
  );
}
