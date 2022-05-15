import React, { Component } from "react";
import Button from "@mui/material/Button";
import SingleGrid from "./Grid";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import AccordionSummary from "@mui/material/AccordionSummary";
import Accordion from "@mui/material/Accordion";

import TextField from "@mui/material/TextField";

import randomColor from "randomcolor";

import "./visualizer.css";

class LAMAPFVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numRow: 10,
      numCol: 15,
      algorithms: ["MC-CBS", "MC-CBS-M"],
      algorithm: 0,
      speed: "median",
      delays: { slow: 17, median: 7, fast: 3 },
      map: new Array(10).fill().map(() =>
        new Array(15).fill().map((u) => ({
          isWall: false,
          isStart: false,
          isGoal: false,
          agent: -1,
          color: "",
        }))
      ),
      agents: [],
      numAgents: 0,
      rendered: false,
      rendering: false,
      addedSRow: null,
      addedSCol: null,
      addedGRow: null,
      addedGCol: null,
      addedHeight: null,
      addedWidth: null,
      displayedAgent: null,
      snackbarOpen: false,
      isError: false,
      mapHeight: null,
      mapWidth: null,
      gridSideLength: null,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    };
  }

  updateDimensions = () => {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
  };
  componentDidMount() {
    window.addEventListener("resize", this.resizeGrid());
    this.resizeGrid();
    console.log("h" + this.state.gridSideLength);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  resizeGrid() {
    var gridHeight =
      document.getElementById("map-container").clientHeight / this.state.numRow;
    var gridWidth =
      document.getElementById("map-container").clientWidth / this.state.numCol;
    console.log(
      document.getElementById("map-container").clientWidth / this.state.numCol +
        " " +
        this.state.numCol
    );

    this.setState({
      gridSideLength: Math.floor(Math.min(gridHeight, gridWidth)),
    });
  }

  linearizeLocation(r, c) {
    return this.state.numCol * r + c;
  }

  decodeLocation(loc) {
    return {
      r: Math.floor(loc / this.state.numCol),
      c: loc % this.state.numCol,
    };
  }

  createEmptyMap(row, col) {
    return new Array(row).fill().map(() =>
      new Array(col).fill().map((u) => ({
        isWall: false,
        isStart: false,
        isGoal: false,
        agent: -1,
        color: "",
      }))
    );
  }

  requestSolution(e) {
    e.preventDefault();
    console.log("set");
    var walls = [];
    var agents = [];
    this.state.map.forEach((row, rowId) => {
      row.forEach((grid, gridId) => {
        if (grid.isWall) {
          walls.push(this.linearizeLocation(rowId, gridId));
        }
      });
    });
    this.state.agents.forEach((agent) => {
      agents.push({
        startLoc: this.linearizeLocation(agent.SR, agent.SC),
        goalLoc: this.linearizeLocation(agent.GR, agent.GC),
        height: agent.height,
        width: agent.width,
      });
    });

    const req = {
      method: "POST",
      headers: {
        // Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        row: this.state.numRow,
        col: this.state.numCol,
        walls: walls,
        agents: agents,
      }),
    };

    fetch("http://localhost:8080/LA-MAPF", req)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "Optimal") {
          console.log();
          var newMap = structuredClone(this.state.map);
          data.paths.forEach((path, agentId) => {
            var color = this.state.agents[agentId].color;
            path.forEach((loc) => {
              var l = this.decodeLocation(parseInt(loc));
              newMap[l.r][l.c].color = color;
            });
          });
          this.setState({ map: newMap });
        } else if (data.status === "No solutions") {
        } else if (data.status === "Timeout") {
        }
      });
  }

  handleEnterRow(e) {
    this.setState({ numRow: parseInt(e.target.value) });
  }

  changeMapRow(e) {
    let t = parseInt(e.target.value);
    t = t > 40 ? 40 : t < 4 ? 4 : t;
    this.setState(
      (state) => ({
        numRow: t,
        map: this.createEmptyMap(t, state.numCol),
      }),
      () => this.resizeGrid()
    );
  }

  handleEnterCol(e) {
    this.setState({ numCol: parseInt(e.target.value) });
  }

  changeMapCol(e) {
    let t = parseInt(e.target.value);
    t = t > 40 ? 40 : t < 4 ? 4 : t;
    this.setState(
      (state) => ({
        numCol: t,
        map: this.createEmptyMap(state.numRow, t),
      }),
      () => this.resizeGrid()
    );
  }

  handleAddAgent(e) {
    e.preventDefault();
    this.addAgentToMap();
    // this.emptyForm();
  }

  addAgent(color) {
    this.setState({
      numAgents: this.state.numAgents + 1,
      agents: [
        ...this.state.agents,
        {
          SR: this.state.addedSRow,
          SC: this.state.addedSCol,
          GR: this.state.addedGRow,
          GC: this.state.addedGCol,
          height: this.state.addedHeight,
          width: this.state.addedWidth,
          color: color,
        },
      ],
    });
    console.log(color);
  }

  showSnackbar(color) {
    if (!this.state.isError) this.addAgent(color);
    this.setState({ snackbarOpen: true });
    setTimeout(() => this.setState({ isError: false }), 1200);
  }

  handleCloseSnackbar(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackbarOpen: false });
  }

  addAgentToMap() {
    const color = randomColor();
    var newMap = structuredClone(this.state.map);
    for (
      let i = this.state.addedSRow;
      i < this.state.addedSRow + this.state.addedHeight;
      i++
    ) {
      for (
        let j = this.state.addedSCol;
        j < this.state.addedSCol + this.state.addedWidth;
        j++
      ) {
        if (newMap[i][j].agent !== -1) {
          console.log("aaaaassss");
          this.setState({ isError: true }, () => this.showSnackbar(color));
          return;
        }
        newMap[i][j].agent = this.state.numAgents + 1;
        newMap[i][j].isStart = true;
        newMap[i][j].color = color;
      }
    }
    for (
      let i = this.state.addedGRow;
      i < this.state.addedGRow + this.state.addedHeight;
      i++
    ) {
      for (
        let j = this.state.addedGCol;
        j < this.state.addedGCol + this.state.addedWidth;
        j++
      ) {
        if (newMap[i][j].agent !== -1) {
          console.log("aaaaassss");

          this.setState({ isError: true }, () => this.showSnackbar(color));
          return;
        }
        newMap[i][j].agent = this.state.numAgents + 1;
        newMap[i][j].isGoal = true;
        newMap[i][j].color = color;
      }
    }
    this.setState({ map: newMap }, () => this.showSnackbar(color));
  }

  emptyForm() {
    this.setState({
      addedSRow: null,
      addedSCol: null,
      addedGRow: null,
      addedGCol: null,
      addedHeight: null,
      addedWidth: null,
    });
  }

  checkRowOOR() {
    return (
      this.state.addedSRow + this.state.addedHeight > this.state.numRow ||
      this.state.addedGRow + this.state.addedHeight > this.state.numRow ||
      (this.state.addedHeight && this.state.addedHeight <= 0)
    );
  }

  checkColOOR() {
    return (
      this.state.addedSCol + this.state.addedWidth > this.state.numCol ||
      this.state.addedGCol + this.state.addedWidth > this.state.numCol ||
      (this.state.addedWidth && this.state.addedWidth <= 0)
    );
  }

  displayAgentDetail(e, expanded, panel) {
    this.setState({
      displayedAgent: expanded ? panel : null,
    });
  }

  render() {
    console.log("I was triggered during render");

    return (
      <div
        className="body"
        style={{
          marginTop: "5%",
          height: this.state.windowHeight * 0.7,
        }}
      >
        {/* 2d map */}
        <div
          id="map-container"
          style={{
            display: "inline-block",
            width: "65%",
            height: "100%",
          }}
        >
          <div
            className="map"
            style={{
              display: "table",
              margin: "0 auto",
            }}
          >
            {this.state.map.map((row, rowId) => {
              return (
                <div className="row" key={rowId}>
                  {row.map((grid, gridId) => {
                    return (
                      <SingleGrid
                        key={gridId}
                        row={rowId}
                        col={gridId}
                        height={this.state.gridSideLength}
                        width={this.state.gridSideLength}
                        isWall={grid.isWall}
                        isStart={grid.isStart}
                        isGoal={grid.isGoal}
                        agentId={grid.agent}
                        color={grid.color}
                      ></SingleGrid>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <div
          className="panel-container"
          style={{
            position: "fixed",
            display: "inline-block",
            width: "35%",
          }}
        >
          <div
            className="panel"
            style={{
              display: "table",
              marginLeft: "10%",
              // alignItems: "center",
            }}
          >
            {/* user editable fields */}
            <div className="options">
              <Divider
                sx={{
                  "&::before, &::after": {
                    borderColor: "info.light",
                  },
                }}
              >
                <Chip label="Map Info" variant="outlined" color="info" />
              </Divider>
              <div className="map-setting" style={{ marginTop: "3%" }}>
                <TextField
                  id="num-row"
                  label="Number of Rows"
                  color="info"
                  type="number"
                  sx={{ mr: 1 }}
                  helperText="Range between 4-40"
                  onChange={(e) => this.handleEnterRow(e)}
                  onBlur={(e) => this.changeMapRow(e)}
                  value={this.state.numRow ? this.state.numRow : ""}
                />
                <TextField
                  required
                  id="num-col"
                  label="Number of columns"
                  color="info"
                  type="number"
                  helperText="Range between 4-40"
                  onChange={(e) => this.handleEnterCol(e)}
                  onBlur={(e) => this.changeMapCol(e)}
                  value={this.state.numCol ? this.state.numCol : ""}
                />
              </div>
              <Divider
                sx={{
                  mt: "3%",
                  "&::before, &::after": {
                    borderColor: "secondary.light",
                  },
                }}
              >
                <Chip label="Add Agent" variant="outlined" color="secondary" />
              </Divider>
              <form
                className="add-agent"
                onSubmit={(e) => this.handleAddAgent(e)}
                style={{ marginTop: "3%" }}
              >
                <div>
                  <TextField
                    required
                    id="add-start-row"
                    label="Start row index"
                    color="secondary"
                    type="number"
                    sx={{ mr: 1 }}
                    onChange={(e) => {
                      this.setState({ addedSRow: parseInt(e.target.value) });
                    }}
                    error={
                      this.state.addedSRow >= this.state.numRow ||
                      this.state.addedSRow < 0
                    }
                    value={
                      this.state.addedSRow || this.state.addedSRow === 0
                        ? this.state.addedSRow
                        : ""
                    }
                    helperText={
                      this.state.addedSRow >= this.state.numRow ||
                      this.state.addedSRow < 0
                        ? "row index out of range"
                        : " "
                    }
                  />
                  <TextField
                    required
                    id="add-start-col"
                    label="Start column index"
                    color="secondary"
                    type="number"
                    onChange={(e) => {
                      this.setState({ addedSCol: parseInt(e.target.value) });
                    }}
                    error={
                      this.state.addedSCol >= this.state.numCol ||
                      this.state.addedSCol < 0
                    }
                    value={
                      this.state.addedSCol || this.state.addedSCol === 0
                        ? this.state.addedSCol
                        : ""
                    }
                    helperText={
                      this.state.addedSCol >= this.state.numCol ||
                      this.state.addedSCol < 0
                        ? "column index out of range"
                        : " "
                    }
                  />
                </div>
                <div>
                  <TextField
                    required
                    id="add-goal-row"
                    label="Goal row index"
                    color="secondary"
                    type="number"
                    sx={{ mr: 1 }}
                    onChange={(e) => {
                      this.setState({ addedGRow: parseInt(e.target.value) });
                    }}
                    // onBlur={(e) => {
                    //   agentRow = e.target.value;
                    // }}
                    error={
                      this.state.addedGRow >= this.state.numRow ||
                      this.state.addedGRow < 0
                    }
                    value={
                      this.state.addedGRow || this.state.addedGRow === 0
                        ? this.state.addedGRow
                        : ""
                    }
                    helperText={
                      this.state.addedGRow >= this.state.numRow ||
                      this.state.addedGRow < 0
                        ? "row index out of range"
                        : " "
                    }
                  />
                  <TextField
                    required
                    id="add-goal-col"
                    label="Goal column index"
                    color="secondary"
                    type="number"
                    onChange={(e) => {
                      this.setState({ addedGCol: parseInt(e.target.value) });
                    }}
                    error={
                      this.state.addedGCol >= this.state.numCol ||
                      this.state.addedGCol < 0
                    }
                    value={
                      this.state.addedGCol || this.state.addedGCol === 0
                        ? this.state.addedGCol
                        : ""
                    }
                    helperText={
                      this.state.addedGCol >= this.state.numCol ||
                      this.state.addedGCol < 0
                        ? "column index out of range"
                        : " "
                    }
                  />
                </div>
                <div>
                  <TextField
                    required
                    id="add-height"
                    label="Height"
                    color="secondary"
                    type="number"
                    sx={{ mr: 1 }}
                    onChange={(e) => {
                      this.setState({ addedHeight: parseInt(e.target.value) });
                    }}
                    // onBlur={(e) => this.handleOutOfRangeRow(e)}
                    error={this.checkRowOOR()}
                    value={this.state.addedHeight ? this.state.addedHeight : ""}
                    helperText={
                      this.checkRowOOR() ? "agent height out of range" : " "
                    }
                  />
                  <TextField
                    required
                    id="add-width"
                    label="Width"
                    color="secondary"
                    type="number"
                    onChange={(e) => {
                      this.setState({ addedWidth: parseInt(e.target.value) });
                    }}
                    // onBlur={(e) => this.handleOutOfRangeCol(e)}
                    error={this.checkColOOR()}
                    value={this.state.addedWidth ? this.state.addedWidth : ""}
                    helperText={
                      this.checkColOOR() ? "agent width out of range" : " "
                    }
                  />
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ width: 150 }}
                >
                  <AddIcon />
                  add agent
                </Button>

                <Snackbar
                  open={this.state.snackbarOpen}
                  autoHideDuration={1000}
                  onClose={(event, reason) =>
                    this.handleCloseSnackbar(event, reason)
                  }
                >
                  <Alert
                    onClose={(event, reason) =>
                      this.handleCloseSnackbar(event, reason)
                    }
                    severity={this.state.isError ? "error" : "success"}
                    sx={{ width: "100%" }}
                  >
                    {this.state.isError
                      ? "Agent position overlaps!"
                      : "Successfully added!"}
                  </Alert>
                </Snackbar>
              </form>
            </div>

            <Divider
              sx={{
                mt: "3%",
                "&::before, &::after": {
                  borderColor: "success.main",
                },
              }}
            >
              <Chip variant="outlined" label="Agents" color="success"></Chip>
            </Divider>

            {/* display map-related information */}
            <div className="display-info" style={{ marginTop: "3%" }}>
              <div>
                <Chip
                  color="secondary"
                  avatar={<Avatar>1</Avatar>}
                  label="H:10 W:20 (1,1)-> (2,2)"
                />

                {this.state.agents.map((agent, agentId) => {
                  return (
                    <Accordion
                      key={agentId}
                      expanded={this.state.displayedAgent === "panel" + agentId}
                      onChange={(e, expanded) =>
                        this.displayAgentDetail(e, expanded, "panel" + agentId)
                      }
                      sx={{
                        backgroundColor: agent.color,
                        width: "60%",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <Typography sx={{ width: "33%", flexShrink: 0 }}>
                          Agent {agentId + 1}
                        </Typography>
                        {/* <Typography sx={{ color: "text.secondary" }}>
                    I am an accordion
                  </Typography> */}
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>{`Height: ${agent.height} Width: ${agent.width}\n(${agent.SR},${agent.SC}) -> (${agent.GR},${agent.GC})`}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </div>
            </div>

            {/* plan button */}
            <div style={{ marginTop: "3%" }}>
              <Button
                variant="contained"
                color="success"
                sx={{
                  width: 150,
                  // background: "#0F0",
                }}
                endIcon={<SendIcon />}
                onClick={(e) => this.requestSolution(e)}
              >
                Plan!
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default LAMAPFVisualizer;
