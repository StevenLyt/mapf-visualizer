import React, { Component } from "react";
import Button from "@mui/material/Button";
import SingleGrid from "./Grid";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { FormHelperText } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import PlanningResult from "./PlanningResult";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import AccordionSummary from "@mui/material/AccordionSummary";
import Accordion from "@mui/material/Accordion";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import LoadingAnimation from "./LoadingAnimation";
import randomColor from "randomcolor";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
// import "./visualizer.css";

class MAPFVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numRow: 10,
      numCol: 15,
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
      addedSRow: null,
      addedSCol: null,
      addedGRow: null,
      addedGCol: null,
      snackbarOpen: false,
      isError: false,
      gridSideLength: null,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      isMousePressed: false,
      isPlanning: false,
      isPlanned: false,
      planningTime: -1,
      planningStatus: "",
      paths: [],
      isDialogOpen: false,
      isAlgDialogOpen: false,

      heuristics: ["Zero", "CG", "DG", "WDG"],
      rectangleReasoning: ["None", "R", "RM", "GR", "Disjoint"],
      corridorReasoning: ["None", "C", "PC", "STC", "GC", "Disjoint"],
      whichHeuristic: 3,
      whichRectangle: 3,
      whichCorridor: 4,
      isBypass: true,
      isPrioritizeConflict: true,
      isDisjointSplitting: false,
      isMutex: false,
      isTarget: true,
      isSIPP: false,
      algorithmSummary: "",
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
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  resizeGrid() {
    var gridHeight =
      document.getElementById("map-container").clientHeight / this.state.numRow;
    var gridWidth =
      document.getElementById("map-container").clientWidth / this.state.numCol;

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

  async requestSolution(e) {
    e.preventDefault();

    if (this.state.agents.length === 0) {
      this.setState({ isDialogOpen: true });
      return;
    }
    this.setState({ isPlanning: true });

    // change agents to border
    this.state.agents.forEach((agent) => {
      var color = agent.color;
      document.getElementById(
        `grid-${agent.SR}-${agent.SC}`
      ).style.backgroundColor = "#fff";
      document.getElementById(
        `grid-${agent.SR}-${agent.SC}`
      ).style.border = `4px solid ${color}`;
      document.getElementById(
        `grid-${agent.GR}-${agent.GC}`
      ).style.backgroundColor = "#fff";
      document.getElementById(
        `grid-${agent.GR}-${agent.GC}`
      ).style.border = `4px solid ${color}`;
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

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
        heuristic: this.state.heuristics[this.state.whichHeuristic],
        rectangle: this.state.rectangleReasoning[this.state.whichRectangle],
        corridor: this.state.corridorReasoning[this.state.whichCorridor],
        isBypass: this.state.isBypass,
        isPrioritizeConflict: this.state.isPrioritizeConflict,
        isDisjointSplitting: this.state.isDisjointSplitting,
        isMutex: this.state.isMutex,
        isTarget: this.state.isTarget,
        isSIPP: this.state.isSIPP,
      }),
    };

    fetch("http://34.125.119.104:8080/MAPF", req)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          isPlanning: false,
          isPlanned: true,
          algorithmSummary: data.algorithm,
          planningTime: data.time,
          planningStatus: data.status,
          paths: data.paths,
        });
        if (data.status === "Optimal") {
          data.paths.forEach((path, agentId) => {
            var color = this.state.agents[agentId].color;
            var height = 1;
            var width = 1;
            for (let t = 0; t < path.length; t++) {
              var l = this.decodeLocation(parseInt(path[t]));
              let i = l.r;
              let j = l.c;
              setTimeout(() => {
                document.getElementById(
                  `grid-${i}-${j}`
                ).style.backgroundColor = color;
                document.getElementById(`grid-${i}-${j}`).style.border = "";
              }, 1000 * t);
              if (t < path.length - 1) {
                setTimeout(() => {
                  document.getElementById(
                    `grid-${i}-${j}`
                  ).style.backgroundColor = "#ffffff";
                }, 1000 * (t + 0.999));
              }
            }
          });
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
      {
        numRow: t,
        map: this.createEmptyMap(t, this.state.numCol),
      },
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
      {
        numCol: t,
        map: this.createEmptyMap(this.state.numRow, t),
      },
      () => this.resizeGrid()
    );
  }

  handleAddAgent(e) {
    e.preventDefault();
    this.addAgentToMap();
    // this.emptyForm();
  }
  handleDeleteAgent(e) {
    console.log("color");
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
          color: color,
        },
      ],
    });
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
    var i = this.state.addedSRow;
    var j = this.state.addedSCol;

    if (newMap[i][j].agent !== -1 || newMap[i][j].isWall) {
      this.setState({ isError: true }, () => this.showSnackbar(color));
      return;
    }
    newMap[i][j].agent = this.state.numAgents + 1;
    newMap[i][j].isStart = true;
    newMap[i][j].color = color;

    i = this.state.addedGRow;
    j = this.state.addedGCol;
    if (newMap[i][j].agent !== -1 || newMap[i][j].isWall) {
      this.setState({ isError: true }, () => this.showSnackbar(color));
      return;
    }
    newMap[i][j].agent = this.state.numAgents + 1;
    newMap[i][j].isGoal = true;
    newMap[i][j].color = color;

    this.setState({ map: newMap }, () => this.showSnackbar(color));
  }

  emptyForm() {
    this.setState({
      addedSRow: null,
      addedSCol: null,
      addedGRow: null,
      addedGCol: null,
    });
  }

  handleMouseDown(row, col) {
    this.setState({ isMousePressed: true }, () => this.updateWall(row, col));
  }

  handleMouseEnter(row, col) {
    if (this.state.isMousePressed) {
      this.updateWall(row, col);
    }
  }

  handleMouseUp() {
    this.setState({ isMousePressed: false });
  }

  updateWall(row, col) {
    if (
      this.state.map[row][col].agent === -1 &&
      !this.state.isPlanning &&
      !this.state.isPlanned
    ) {
      var newMap = this.state.map.slice();
      newMap[row][col] = {
        ...newMap[row][col],
        isWall: !newMap[row][col].isWall,
      };
      this.setState({ map: newMap });
    }
  }

  startNewTask() {
    this.setState(
      {
        numRow: 10,
        numCol: 15,
        isPlanned: false,
        map: this.createEmptyMap(10, 15),
        agents: [],
        numAgents: 0,
        addedSRow: null,
        addedSCol: null,
        addedGRow: null,
        addedGCol: null,
        snackbarOpen: false,
        isError: false,
        isMousePressed: false,
        isPlanning: false,
        isPlanned: false,
        planningTime: -1,
        planningStatus: "",
        paths: [],
        whichHeuristic: 3,
        whichRectangle: 3,
        whichCorridor: 4,
        isBypass: true,
        isPrioritizeConflict: true,
        isDisjointSplitting: false,
        isMutex: false,
        isTarget: true,
        isSIPP: false,
        algorithmSummary: "",
      },
      () => this.resizeGrid()
    );
  }

  checkRowOOR() {
    return (
      this.state.addedSRow + 1 > this.state.numRow ||
      this.state.addedGRow + 1 > this.state.numRow
    );
  }

  checkColOOR() {
    return (
      this.state.addedSCol + 1 > this.state.numCol ||
      this.state.addedGCol + 1 > this.state.numCol
    );
  }

  render() {
    return (
      <div
        className="body"
        style={{
          marginTop: "5%",
          height: this.state.windowHeight * 0.7,
        }}
      >
        <Dialog
          open={this.state.isDialogOpen}
          onClose={() => {
            this.setState({ isDialogOpen: false });
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Empty agent list!</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please add at least one agent before start planning.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ isDialogOpen: false });
              }}
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* 2d map */}
        <div
          id="map-container"
          style={{
            display: "inline-block",
            width: "62%",
            height: "100%",
            marginLeft: "3%",
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
                        isPlanned={this.state.isPlanned}
                        onMouseDown={(row, col) =>
                          this.handleMouseDown(row, col)
                        }
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        onMouseUp={() => this.handleMouseUp()}
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
            marginTop: 0,
          }}
        >
          {this.state.isPlanning ? (
            <LoadingAnimation />
          ) : this.state.isPlanned ? (
            <PlanningResult
              algorithm={this.state.algorithmSummary}
              status={this.state.planningStatus}
              planningTime={this.state.planningTime}
              paths={this.state.paths}
              numCol={this.state.numCol}
              startNew={() => this.startNewTask()}
            ></PlanningResult>
          ) : (
            <div
              className="panel"
              style={{
                display: "table",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: 0,
              }}
            >
              {/* user editable fields */}
              <div className="options">
                <Divider
                  sx={{
                    mt: "3%",
                    "&::before, &::after": {
                      borderColor: "warning.main",
                    },
                  }}
                >
                  <Chip label="Algorithm" variant="outlined" color="warning" />
                </Divider>
                <Button
                  variant="outlined"
                  onClick={() => {
                    this.setState({ isAlgDialogOpen: true });
                  }}
                  fullWidth
                  sx={{ mt: "3%" }}
                  color="warning"
                >
                  Choose reasoning techniques
                </Button>
                <Dialog
                  // fullWidth={fullWidth}
                  // maxWidth={maxWidth}
                  open={this.state.isAlgDialogOpen}
                  onClose={() => {
                    this.setState({ isAlgDialogOpen: false });
                  }}
                >
                  <DialogTitle sx={{ textAlign: "center" }}>
                    CBS improvement techniques
                  </DialogTitle>
                  <DialogContent>
                    <Box
                      noValidate
                      component="form"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        m: "auto",
                        width: "fit-content",
                      }}
                    >
                      <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          High level heuristics
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={this.state.whichHeuristic}
                          onChange={(e) =>
                            this.setState({ whichHeuristic: e.target.value })
                          }
                        >
                          {this.state.heuristics.map((heuristic, id) => {
                            return (
                              <FormControlLabel
                                key={id}
                                value={id}
                                control={<Radio />}
                                label={heuristic}
                              />
                            );
                          })}
                        </RadioGroup>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Rectangle reasoning
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={this.state.whichRectangle}
                          onChange={(e) =>
                            this.setState({ whichRectangle: e.target.value })
                          }
                        >
                          {this.state.rectangleReasoning.map((a, id) => {
                            return (
                              <FormControlLabel
                                key={id}
                                value={id}
                                control={<Radio />}
                                label={a}
                              />
                            );
                          })}
                        </RadioGroup>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Corridor Reasoning
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={this.state.whichCorridor}
                          onChange={(e) =>
                            this.setState({ whichCorridor: e.target.value })
                          }
                        >
                          {this.state.corridorReasoning.map((a, id) => {
                            return (
                              <FormControlLabel
                                key={id}
                                value={id}
                                control={<Radio />}
                                label={a}
                              />
                            );
                          })}
                        </RadioGroup>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Prioritize conflict
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={this.state.isPrioritizeConflict}
                          onChange={(e) =>
                            this.setState({
                              isPrioritizeConflict: e.target.value,
                            })
                          }
                        >
                          <FormControlLabel
                            key={1}
                            value={true}
                            control={<Radio />}
                            label="True"
                          />
                          <FormControlLabel
                            key={0}
                            value={false}
                            control={<Radio />}
                            label="False"
                          />
                        </RadioGroup>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Bypass conflict
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={this.state.isBypass}
                          onChange={(e) =>
                            this.setState({
                              isBypass: e.target.value,
                            })
                          }
                        >
                          <FormControlLabel
                            key={1}
                            value={true}
                            control={<Radio />}
                            label="True"
                          />
                          <FormControlLabel
                            key={0}
                            value={false}
                            control={<Radio />}
                            label="False"
                          />
                        </RadioGroup>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Mutex Propagation
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={this.state.isMutex}
                          onChange={(e) =>
                            this.setState({
                              isMutex: e.target.value,
                            })
                          }
                        >
                          <FormControlLabel
                            key={1}
                            value={true}
                            control={<Radio />}
                            label="True"
                          />
                          <FormControlLabel
                            key={0}
                            value={false}
                            control={<Radio />}
                            label="False"
                          />
                        </RadioGroup>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Target reasoning
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={this.state.isTarget}
                          onChange={(e) =>
                            this.setState({
                              isTarget: e.target.value,
                            })
                          }
                        >
                          <FormControlLabel
                            key={1}
                            value={true}
                            control={<Radio />}
                            label="True"
                          />
                          <FormControlLabel
                            key={0}
                            value={false}
                            control={<Radio />}
                            label="False"
                          />
                        </RadioGroup>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Disjoint splitting
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={this.state.isDisjointSplitting}
                          onChange={(e) =>
                            this.setState({
                              isDisjointSplitting: e.target.value,
                            })
                          }
                        >
                          <FormControlLabel
                            key={1}
                            value={true}
                            control={<Radio />}
                            label="True"
                          />
                          <FormControlLabel
                            key={0}
                            value={false}
                            control={<Radio />}
                            label="False"
                          />
                        </RadioGroup>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          SIPP
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={this.state.isSIPP}
                          onChange={(e) =>
                            this.setState({
                              isSIPP: e.target.value,
                            })
                          }
                        >
                          <FormControlLabel
                            key={1}
                            value={true}
                            control={<Radio />}
                            label="True"
                          />
                          <FormControlLabel
                            key={0}
                            value={false}
                            control={<Radio />}
                            label="False"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => this.setState({ isAlgDialogOpen: false })}
                    >
                      Set
                    </Button>
                  </DialogActions>
                </Dialog>

                <Divider
                  sx={{
                    "&::before, &::after": {
                      borderColor: "info.light",
                    },
                    mt: "3%",
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
                  <Chip
                    label="Add Agent"
                    variant="outlined"
                    color="secondary"
                  />
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

                  <Button
                    variant="contained"
                    type="submit"
                    startIcon={<AddIcon />}
                    sx={{ width: "100%", bgcolor: "secondary.light" }}
                  >
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
                        ? "Position already taken!"
                        : "Successfully added!"}
                    </Alert>
                  </Snackbar>
                </form>
              </div>

              {/* display map-related information */}
              <div className="display-info" style={{ marginTop: "3%" }}>
                <div>
                  {this.state.agents.map((agent, agentId) => {
                    return (
                      <Chip
                        sx={{
                          bgcolor: agent.color,
                          mr: 2,
                        }}
                        key={agentId + 1}
                        label={`agent ${agentId + 1}`}
                        onDelete={(e) => this.handleDeleteAgent(e)}
                      ></Chip>
                    );
                  })}
                </div>
              </div>

              {/* plan button */}
              <div style={{ marginTop: "3%" }}>
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<SendIcon />}
                  sx={{ width: "100%" }}
                  onClick={(e) => this.requestSolution(e)}
                >
                  Plan!
                </Button>
              </div>
              <div></div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default MAPFVisualizer;
