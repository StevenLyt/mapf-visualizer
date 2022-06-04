import React, { Component } from "react";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import SingleGrid from "components/Grid";
import LoadingAnimation from "components/LoadingAnimation";
import PlanningResult from "components/PlanningResult";
import BaseLayout from "layouts/sections/components/BaseLayout";
import {
  Alert,
  Slide,
  Modal,
  Grid,
  Switch,
  Divider,
  Container,
  TextField,
  Snackbar,
} from "@mui/material";
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

import randomColor from "randomcolor";

const DEFAULTROW = 8;
const DEFAULTCOL = 15;

class LAMAPFVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numRow: DEFAULTROW,
      numCol: DEFAULTCOL,
      tempRow: DEFAULTROW,
      tempCol: DEFAULTCOL,
      algorithms: ["MC-CBS", "MC-CBS-M"],
      algorithm: 1,
      map: new Array(DEFAULTROW).fill().map(() =>
        new Array(DEFAULTCOL).fill().map((u) => ({
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
      addedHeight: null,
      addedWidth: null,
      snackbarOpen: false,
      isError: false,
      isMousePressed: false,
      isPlanning: false,
      isPlanned: false,
      isAnimationFinished: false,
      planningTime: -1,
      planningStatus: "",
      paths: [],
      isInfoDialogOpen: true,
      isDialogOpen: false,
      isAlgDialogOpen: false,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

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
      console.log("No agents");
      return;
    }

    this.setState({ isPlanning: true });

    // change agents to border
    this.state.agents.forEach((agent) => {
      var height = agent.height;
      var width = agent.width;
      var color = agent.color;
      for (let i = agent.SR; i < agent.SR + height; i++) {
        for (let j = agent.SC; j < agent.SC + width; j++) {
          document.getElementById(`grid-${i}-${j}`).style.backgroundColor = "#fff";
          if (i === agent.SR) {
            document.getElementById(`grid-${i}-${j}`).style.borderTop = `4px solid ${color}`;
          }
          if (i === agent.SR + height - 1) {
            document.getElementById(`grid-${i}-${j}`).style.borderBottom = `4px solid ${color}`;
          }
          if (j === agent.SC) {
            document.getElementById(`grid-${i}-${j}`).style.borderLeft = `4px solid ${color}`;
          }
          if (j === agent.SC + width - 1) {
            document.getElementById(`grid-${i}-${j}`).style.borderRight = `4px solid ${color}`;
          }
        }
      }
      for (let i = agent.GR; i < agent.GR + height; i++) {
        for (let j = agent.GC; j < agent.GC + width; j++) {
          document.getElementById(`grid-${i}-${j}`).style.backgroundColor = "#fff";
          if (i === agent.GR) {
            document.getElementById(`grid-${i}-${j}`).style.borderTop = `4px solid ${color}`;
          }
          if (i === agent.GR + height - 1) {
            document.getElementById(`grid-${i}-${j}`).style.borderBottom = `4px solid ${color}`;
          }
          if (j === agent.GC) {
            document.getElementById(`grid-${i}-${j}`).style.borderLeft = `4px solid ${color}`;
          }
          if (j === agent.GC + width - 1) {
            document.getElementById(`grid-${i}-${j}`).style.borderRight = `4px solid ${color}`;
          }
        }
      }
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
        isMutex: this.state.algorithm === 1,
      }),
    };

    fetch("http://34.125.119.104:8080/LA-MAPF", req)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          isPlanning: false,
          isPlanned: true,
          planningTime: data.time,
          planningStatus: data.status,
          paths: data.paths,
        });
        if (data.status >= 0) {
          var finishTime = 0;
          data.paths.forEach((path, agentId) => {
            finishTime = Math.max(finishTime, path.length);
            var color = this.state.agents[agentId].color;
            var height = this.state.agents[agentId].height;
            var width = this.state.agents[agentId].width;
            for (let t = 0; t < path.length; t++) {
              var l = this.decodeLocation(parseInt(path[t]));
              var SR = l.r;
              var SC = l.c;
              for (let i = SR; i < SR + height; i++) {
                for (let j = SC; j < SC + width; j++) {
                  setTimeout(() => {
                    document.getElementById(`grid-${i}-${j}`).style.backgroundColor = color;
                    document.getElementById(`grid-${i}-${j}`).style.border = "";
                  }, 1000 * t);
                  if (t < path.length - 1) {
                    setTimeout(() => {
                      document.getElementById(`grid-${i}-${j}`).style.backgroundColor = "#ffffff";
                    }, 1000 * (t + 0.999));
                  }
                }
              }
            }
          });
          setTimeout(() => this.setState({ isAnimationFinished: true }), 1000 * finishTime);
        } else if (data.status === -1) {
        } else if (data.status === -2) {
        }
      });
  }

  handleChangeAlg(e) {
    this.setState({ algorithm: e.target.value });
  }

  changeMapRow(e) {
    let t = parseInt(e.target.value);
    t = t > 30 ? 30 : t < 4 ? 4 : t;
    t = Math.min(t, this.state.numCol);
    this.setState({
      tempRow: t,
      numRow: t,
      map: this.createEmptyMap(t, this.state.numCol),
    });
  }

  changeMapCol(e) {
    let t = parseInt(e.target.value);
    t = t > 30 ? 30 : t < 4 ? 4 : t;
    t = Math.max(t, this.state.numRow);
    this.setState({
      tempCol: t,
      numCol: t,
      map: this.createEmptyMap(this.state.numRow, t),
    });
  }

  handleAddAgent(e) {
    e.preventDefault();
    const error =
      this.state.addedSRow >= this.state.numRow ||
      this.state.addedSRow < 0 ||
      this.state.addedSCol >= this.state.numCol ||
      this.state.addedSCol < 0 ||
      this.state.addedGRow >= this.state.numRow ||
      this.state.addedGRow < 0 ||
      this.state.addedGCol >= this.state.numCol ||
      this.state.addedGCol < 0 ||
      this.checkRowOOR() ||
      this.checkColOOR();
    if (error) return;

    this.addAgentToMap();
  }

  // handleDeleteAgent(id) {
  //   console.log(this.state.map);
  //   console.log(id);
  //   var newAgents = structuredClone(this.state.agents);
  //   newAgents.splice(id, 1);
  //   var newMap = structuredClone(this.state.map);

  //   for (let i = 0; i < newMap.length; i++) {
  //     for (let j = 0; j < newMap[0].length; j++) {
  //       if (newMap[i][j].agent === id + 1) {
  //         newMap[i][j].agent = -1;
  //         newMap[i][j].isStart = false;
  //         newMap[i][j].isGoal = false;
  //         newMap[i][j].color = "";
  //       }
  //     }
  //   }
  //   this.setState({ agents: newAgents, map: newMap }, () => console.log(this.state.map));
  // }

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
  }

  showSnackbar(color) {
    if (!this.state.isError) this.addAgent(color);
    this.setState({ snackbarOpen: true });
    setTimeout(() => this.setState({ isError: false }), 1200);
    this.emptyForm();
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
    for (let i = this.state.addedSRow; i < this.state.addedSRow + this.state.addedHeight; i++) {
      for (let j = this.state.addedSCol; j < this.state.addedSCol + this.state.addedWidth; j++) {
        if (newMap[i][j].agent !== -1 || newMap[i][j].isWall) {
          this.setState({ isError: true }, () => this.showSnackbar(color));
          return;
        }
        newMap[i][j].agent = this.state.numAgents + 1;
        newMap[i][j].isStart = true;
        newMap[i][j].color = color;
      }
    }
    for (let i = this.state.addedGRow; i < this.state.addedGRow + this.state.addedHeight; i++) {
      for (let j = this.state.addedGCol; j < this.state.addedGCol + this.state.addedWidth; j++) {
        if (newMap[i][j].agent !== -1 || newMap[i][j].isWall) {
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
    if (this.state.map[row][col].agent === -1 && !this.state.isPlanning && !this.state.isPlanned) {
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
        numRow: DEFAULTROW,
        numCol: DEFAULTCOL,
        tempRow: DEFAULTROW,
        tempCol: DEFAULTCOL,
        map: this.createEmptyMap(DEFAULTROW, DEFAULTCOL),
        agents: [],
        numAgents: 0,
        addedSRow: null,
        addedSCol: null,
        addedGRow: null,
        addedGCol: null,
        addedHeight: null,
        addedWidth: null,
        snackbarOpen: false,
        isError: false,
        isMousePressed: false,
        isPlanning: false,
        isPlanned: false,
        isAnimationFinished: false,
        planningTime: -1,
        planningStatus: "",
        paths: [],
      },
      () => {
        for (let i = 0; i < DEFAULTROW; i++) {
          for (let j = 0; j < DEFAULTCOL; j++) {
            document.getElementById(`grid-${i}-${j}`).style.backgroundColor = "";
            document.getElementById(`grid-${i}-${j}`).style.border = "";
          }
        }
      }
    );
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

  render() {
    return (
      <BaseLayout title="Large Agent MAPF">
        <MKBox component="section">
          <Modal
            open={this.state.isInfoDialogOpen}
            onClose={() => {
              this.setState({ isInfoDialogOpen: false });
            }}
            sx={{ display: "grid", placeItems: "center" }}
          >
            <Slide direction="down" in={this.state.isInfoDialogOpen} timeout={500}>
              <MKBox
                position="relative"
                width="50vw"
                display="flex"
                flexDirection="column"
                borderRadius="xl"
                variant="gradient"
                shadow="sm"
              >
                <MKBox display="flex" alginItems="center" justifyContent="center" p={2}>
                  <MKTypography variant="h4">A few things to know</MKTypography>
                </MKBox>
                <Divider sx={{ my: 0 }} />

                <MKBox px={6} py={3} textAlign="left">
                  <MKTypography variant="body2" mb={1}>
                    1. For better display of the map, the number of rows are restricted to be no
                    more that the number of columns. So if you want to add a map with more rows than
                    columns, simply swap these two numbers.
                  </MKTypography>
                  <MKTypography variant="body2" mb={1}>
                    2. The MAPF variant you choose is <b>Large Agent MAPF</b>, and the algorithm you
                    choose is <b>MC-CBS</b>. The available improvement techniques include:{" "}
                    <b>Mutex Propagation</b>.
                  </MKTypography>
                  <MKTypography variant="body2" mb={1}>
                    3. In <b>Large Agent MAPF</b>, we denote the location of an agent by the
                    coordinate of its top-left grid.
                  </MKTypography>
                </MKBox>
                <Divider light sx={{ my: 0 }} />
                <MKBox display="flex" justifyContent="right" py={1} px={1.5}>
                  <MKButton onClick={() => this.setState({ isInfoDialogOpen: false })}>
                    ok, got it
                  </MKButton>
                </MKBox>
              </MKBox>
            </Slide>
          </Modal>
        </MKBox>
        <MKBox component="section">
          <Modal
            open={this.state.isDialogOpen}
            onClose={() => {
              this.setState({ isDialogOpen: false });
            }}
            sx={{ display: "grid", placeItems: "center" }}
          >
            <Slide direction="down" in={this.state.isDialogOpen} timeout={500}>
              <MKBox
                position="relative"
                width="fit-content"
                display="flex"
                flexDirection="column"
                borderRadius="xl"
                variant="gradient"
                shadow="sm"
              >
                <MKBox p={3} textAlign="center">
                  <MKTypography variant="h4" mt={1} mb={1}>
                    Empty agent list
                  </MKTypography>
                  <MKTypography variant="body2">
                    Please add at least one agent before starting planning.
                  </MKTypography>
                </MKBox>
                <Divider light sx={{ my: 0 }} />
                <MKBox display="flex" justifyContent="right" py={1} px={1.5}>
                  <MKButton onClick={() => this.setState({ isDialogOpen: false })}>
                    ok, got it
                  </MKButton>
                </MKBox>
              </MKBox>
            </Slide>
          </Modal>
        </MKBox>
        <Grid container className="body" px={4}>
          {/* 2d map */}
          <Grid
            item
            container
            xs={12}
            md={8}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid container id="map">
              <Grid
                item
                container
                justifyContent="center"
                columns={this.state.numCol >= 12 ? this.state.numCol + 1 : 12}
              >
                {Array.from("x".repeat(this.state.numCol + 1)).map((a, id) => {
                  return <SingleGrid key={id} row={id - 1} col={-1} />;
                })}
              </Grid>
              {this.state.map.map((row, rowId) => {
                return (
                  <Grid
                    item
                    container
                    justifyContent="center"
                    key={rowId}
                    columns={this.state.numCol >= 12 ? this.state.numCol + 1 : 12}
                  >
                    <SingleGrid row={rowId} col={-1} />
                    {row.map((grid, gridId) => {
                      return (
                        <SingleGrid
                          key={gridId}
                          row={rowId}
                          col={gridId}
                          isWall={grid.isWall}
                          isStart={grid.isStart}
                          isGoal={grid.isGoal}
                          agentId={grid.agent}
                          color={grid.color}
                          isPlanned={this.state.isPlanned}
                          onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                          onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                          onMouseUp={() => this.handleMouseUp()}
                        />
                      );
                    })}
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={12}
            md={4}
            className="panel-container"
            style={{
              display: "inline-block",
            }}
          >
            <div>
              {this.state.isPlanning ? (
                <LoadingAnimation />
              ) : this.state.isPlanned ? (
                <PlanningResult
                  algorithm={this.state.algorithms[this.state.algorithm]}
                  status={this.state.planningStatus}
                  planningTime={this.state.planningTime}
                  paths={this.state.paths}
                  numCol={this.state.numCol}
                  startNew={() => this.startNewTask()}
                  isDisabled={!this.state.isAnimationFinished}
                ></PlanningResult>
              ) : (
                <MKBox component="section" py={2}>
                  <Container>
                    {/* user editable fields */}
                    <Grid
                      container
                      item
                      justifyContent="center"
                      xs={10}
                      lg={7}
                      mx="auto"
                      textAlign="center"
                    >
                      <MKTypography variant="h3" mb={1}>
                        Algorithm
                      </MKTypography>
                    </Grid>
                    <Grid container item xs={12} lg={10} sx={{ mx: "auto" }}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={12}>
                          <MKButton
                            variant="outlined"
                            onClick={() => {
                              this.setState({ isAlgDialogOpen: true });
                            }}
                            fullWidth
                            color="info"
                          >
                            Choose reasoning techniques
                          </MKButton>
                        </Grid>
                        <Modal
                          open={this.state.isAlgDialogOpen}
                          onClose={() => {
                            this.setState({ isAlgDialogOpen: false });
                          }}
                          sx={{ display: "grid", placeItems: "center" }}
                        >
                          <Slide direction="down" in={this.state.isAlgDialogOpen} timeout={500}>
                            <MKBox
                              position="relative"
                              width="500px"
                              display="flex"
                              flexDirection="column"
                              borderRadius="xl"
                              variant="gradient"
                              shadow="sm"
                            >
                              <MKBox
                                display="flex"
                                alginItems="center"
                                justifyContent="center"
                                py={3}
                                px={2}
                              >
                                <MKTypography variant="h4">Choose techniques </MKTypography>
                              </MKBox>
                              <Divider dark sx={{ my: 0 }} />
                              <MKBox p={2} textAlign="center">
                                <MKTypography variant="h6" mt={1} mb={1}>
                                  Mutex Propagation
                                </MKTypography>
                                <Switch
                                  checked={this.state.algorithm === 1}
                                  onChange={(e) =>
                                    this.setState({ algorithm: e.target.checked ? 1 : 0 })
                                  }
                                />
                                <MKTypography variant="body2" opacity={0.8} mb={2}>
                                  Generate stronger symmetry-breaking constraints.
                                </MKTypography>
                              </MKBox>
                              <Divider light sx={{ my: 0 }} />
                              <MKBox display="flex" justifyContent="right" py={2} px={1.5}>
                                <MKButton
                                  color="info"
                                  onClick={() => {
                                    this.setState({ isAlgDialogOpen: false });
                                  }}
                                >
                                  set
                                </MKButton>
                              </MKBox>
                            </MKBox>
                          </Slide>
                        </Modal>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      item
                      justifyContent="center"
                      xs={10}
                      lg={7}
                      mx="auto"
                      textAlign="center"
                      mt={3}
                    >
                      <MKTypography variant="h3" mb={1}>
                        Map info
                      </MKTypography>
                    </Grid>
                    <Grid container item xs={12} lg={10} sx={{ mx: "auto" }}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={6}>
                          <MKInput
                            fullWidth
                            required
                            id="num-row"
                            label="Number of Rows"
                            color="info"
                            type="number"
                            helperText="Range between 4-30"
                            onChange={(e) => this.setState({ tempRow: parseInt(e.target.value) })}
                            onBlur={(e) => this.changeMapRow(e)}
                            value={this.state.tempRow ? this.state.tempRow : ""}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <MKInput
                            required
                            fullWidth
                            id="num-col"
                            label="Number of columns"
                            color="info"
                            type="number"
                            helperText="Range between 4-30"
                            onChange={(e) => {
                              this.setState({ tempCol: parseInt(e.target.value) });
                              console.log("this");
                            }}
                            onBlur={(e) => this.changeMapCol(e)}
                            value={this.state.tempCol ? this.state.tempCol : ""}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      item
                      justifyContent="center"
                      xs={10}
                      lg={7}
                      mx="auto"
                      mt={3}
                      textAlign="center"
                    >
                      <MKTypography variant="h3" mb={1}>
                        Add agent
                      </MKTypography>
                    </Grid>
                    <Grid container item xs={12} lg={10} sx={{ mx: "auto" }}>
                      <form onSubmit={(e) => this.handleAddAgent(e)}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
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
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
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
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
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
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
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
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              required
                              id="add-height"
                              label="Height"
                              color="secondary"
                              type="number"
                              sx={{ mr: 1 }}
                              onChange={(e) => {
                                this.setState({
                                  addedHeight: parseInt(e.target.value),
                                });
                              }}
                              error={this.checkRowOOR()}
                              value={this.state.addedHeight ? this.state.addedHeight : ""}
                              helperText={this.checkRowOOR() ? "agent height out of range" : " "}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              required
                              id="add-width"
                              label="Width"
                              color="secondary"
                              type="number"
                              onChange={(e) => {
                                this.setState({ addedWidth: parseInt(e.target.value) });
                              }}
                              error={this.checkColOOR()}
                              value={this.state.addedWidth ? this.state.addedWidth : ""}
                              helperText={this.checkColOOR() ? "agent width out of range" : " "}
                            />
                          </Grid>

                          <Grid item xs={12} md={12}>
                            <MKButton
                              variant="gradient"
                              color="info"
                              type="submit"
                              startIcon={<AddIcon />}
                              fullWidth
                            >
                              add agent
                            </MKButton>
                          </Grid>

                          <Snackbar
                            open={this.state.snackbarOpen}
                            autoHideDuration={1000}
                            onClose={(event, reason) => this.handleCloseSnackbar(event, reason)}
                          >
                            <Alert
                              onClose={(event, reason) => this.handleCloseSnackbar(event, reason)}
                              severity={this.state.isError ? "error" : "success"}
                              sx={{ width: "100%" }}
                            >
                              {this.state.isError
                                ? "Position already taken!"
                                : "Successfully added!"}
                            </Alert>
                          </Snackbar>
                        </Grid>
                      </form>
                    </Grid>
                    <Grid container item xs={12} lg={10} mt={3} sx={{ mx: "auto" }}>
                      <Grid item xs={12} md={12}>
                        <MKButton
                          variant="contained"
                          color="success"
                          endIcon={<SendIcon />}
                          onClick={(e) => this.requestSolution(e)}
                          fullWidth
                        >
                          Plan!
                        </MKButton>
                      </Grid>
                    </Grid>
                  </Container>
                </MKBox>
              )}
            </div>
          </Grid>
        </Grid>
      </BaseLayout>
    );
  }
}
export default LAMAPFVisualizer;
