import React, { Component } from "react";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SingleGrid from "components/Grid";
import LoadingAnimation from "components/LoadingAnimation";
import PlanningResult from "components/PlanningResult";
import BaseLayout from "layouts/sections/components/BaseLayout";
import {
  Slide,
  Modal,
  Grid,
  Switch,
  Divider,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  Typography,
} from "@mui/material";
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import UploadMap from "components/UploadMap";
import randomColor from "randomcolor";

const DEFAULTROW = 8;
const DEFAULTCOL = 15;

class MAPFVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numRow: DEFAULTROW,
      numCol: DEFAULTCOL,
      tempRow: DEFAULTROW,
      tempCol: DEFAULTCOL,
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

      algorithmSummary: "",

      startToAdd: false,
      goalToAdd: false,
      colorToAdd: "",
      addedSRowClick: null,
      addedSColClick: null,
      toDelete: false,

      name: this.props.populate.name,
      options: structuredClone(this.props.populate.options),
      description: this.props.populate.description,
    };
  }

  adjustMap(height, width, map) {
    this.setState({
      numRow: height,
      numCol: width,
      map: map,
      agents: [],
      numAgents: 0,
      startToAdd: false,
      goalToAdd: false,
      addedSRowClick: null,
      addedSColClick: null,
    });
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
      return;
    }

    if (this.state.goalToAdd) return;

    this.setState({ isPlanning: true });

    // change agents to border
    this.state.agents.forEach((agent) => {
      var color = agent.color;
      document.getElementById(`grid-${agent.SR}-${agent.SC}`).style.border = `4px solid ${color}`;
      document.getElementById(`grid-${agent.GR}-${agent.GC}`).style.border = `4px solid ${color}`;
    });

    // delay 1s before showing animation
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

    var data = { row: this.state.numRow, col: this.state.numCol, walls: walls, agents: agents };
    let options = this.state.options;
    for (let key in options) {
      data[key] =
        typeof options[key].options[0] === "number"
          ? options[key].value
          : options[key].options[options[key].value];
    }
    console.log(data);
    const req = {
      method: "POST",
      headers: {
        // Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    // fetch("http://localhost:8080/MAPF", req)
    fetch("http://34.125.119.104:8080/" + this.state.name, req)
      .then((response) => response.json())
      .then((data) => {
        this.setState(
          {
            isPlanning: false,
            isPlanned: true,
            algorithmSummary: data.algorithm,
            planningTime: data.time,
            planningStatus: data.status,
            paths: data.paths,
          },
          () => {
            if (data.status >= 0) {
              this.playAnimation();
            }
          }
        );
      });
  }

  playAnimation() {
    this.setState({ isAnimationFinished: false });
    var finishTime = 0;
    const paths = this.state.paths;
    for (var t = 0; t < paths.length; t++) {
      finishTime = Math.max(finishTime, paths[t].length);
    }
    for (let t = 0; t < finishTime; t++) {
      setTimeout(() => {
        let map = this.state.map;
        console.log(map);
        for (let i = 0; i < map.length; i++) {
          for (let j = 0; j < map[i].length; j++) {
            map[i][j].isStart = false;
            map[i][j].agent = -1;
            map[i][j].color = "";
          }
        }
        for (let i = 0; i < paths.length; i++) {
          let loc = this.decodeLocation(paths[i][paths[i].length > t ? t : paths[i].length - 1]);
          map[loc.r][loc.c].isStart = true;
          map[loc.r][loc.c].agent = i + 1;
          map[loc.r][loc.c].color = this.state.agents[i].color;
        }
        this.setState({ map: map });
      }, 1000 * t);
    }
    setTimeout(() => this.setState({ isAnimationFinished: true }), 1000 * finishTime);
  }

  changeMapRow(e) {
    let t = parseInt(e.target.value);
    t = t > 30 ? 30 : t < 4 ? 4 : t;
    t = Math.min(t, this.state.numCol);
    this.setState({ tempRow: t });
    this.adjustMap(t, this.state.numCol, this.createEmptyMap(t, this.state.numCol));
  }

  changeMapCol(e) {
    let t = parseInt(e.target.value);
    t = t > 30 ? 30 : t < 4 ? 4 : t;
    t = Math.max(t, this.state.numRow);
    this.setState({ tempCol: t });
    this.adjustMap(this.state.numRow, t, this.createEmptyMap(this.state.numRow, t));
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
      this.state.addedGCol < 0;
    if (error) return;
    this.addAgentToMap();
  }

  handleAddAgentByClick() {
    const color = randomColor();
    this.setState({ startToAdd: true, colorToAdd: color });
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

  removeAgent() {
    this.setState({ toDelete: true });
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
    if (this.state.toDelete) {
      let agentToDelete = this.state.map[row][col].agent;
      let agents = this.state.agents;
      agents.splice(agentToDelete - 1, 1);
      let map = this.state.map;
      for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
          if (!map[i][j].isWall) {
            map[i][j].isStart = false;
            map[i][j].isGoal = false;
            map[i][j].agent = -1;
            map[i][j].color = "";
          }
        }
      }
      for (let i = 0; i < agents.length; i++) {
        let agent = agents[i];
        map[agent.SR][agent.SC].isStart = true;
        map[agent.SR][agent.SC].agent = i + 1;
        map[agent.SR][agent.SC].color = agent.color;
        map[agent.GR][agent.GC].isGoal = true;
        map[agent.GR][agent.GC].agent = i + 1;
        map[agent.GR][agent.GC].color = agent.color;
      }
      this.setState({ map: map, agents: agents, numAgents: agents.length, toDelete: false });
    } else if (this.state.startToAdd) {
      if (!this.state.map[row][col].isWall && this.state.map[row][col].agent === -1) {
        var map = this.state.map;
        map[row][col].agent = this.state.numAgents + 1;
        map[row][col].isStart = true;
        map[row][col].color = this.state.colorToAdd;
        this.setState({
          startToAdd: false,
          goalToAdd: true,
          addedSRowClick: row,
          addedSColClick: col,
          map: map,
        });
      }
    } else if (this.state.goalToAdd) {
      if (!this.state.map[row][col].isWall && this.state.map[row][col].agent === -1) {
        var map = this.state.map;
        map[row][col].agent = this.state.numAgents + 1;
        map[row][col].isGoal = true;
        map[row][col].color = this.state.colorToAdd;
        this.setState({
          goalToAdd: false,
          addedSRowClick: null,
          addedSColClick: null,
          colorToAdd: "",
          numAgents: this.state.numAgents + 1,
          map: map,
          agents: [
            ...this.state.agents,
            {
              SR: this.state.addedSRowClick,
              SC: this.state.addedSColClick,
              GR: row,
              GC: col,
              color: this.state.colorToAdd,
            },
          ],
        });
      }
    } else {
      this.setState({ isMousePressed: true }, () => this.updateWall(row, col));
    }
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
        snackbarOpen: false,
        isError: false,
        isMousePressed: false,
        isPlanning: false,
        isPlanned: false,
        isAnimationFinished: false,
        planningTime: -1,
        planningStatus: "",
        paths: [],
        options: structuredClone(this.props.populate.options),
        algorithmSummary: "",

        startToAdd: false,
        goalToAdd: false,
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

  populateDescription() {
    return (
      <MKBox px={6} py={3} textAlign="left">
        {this.state.description.map((description, i) => {
          return (
            <MKTypography component="div" variant="body2" mb={1} key={i}>
              <div dangerouslySetInnerHTML={{ __html: i + 1 + ". " + description }} />
            </MKTypography>
          );
        })}
      </MKBox>
    );
  }

  populateOptions() {
    var options = [];
    for (let key in this.state.options) {
      let option = this.state.options[key];
      let sliderDisplay = true;
      if (option.hasOwnProperty("restrictions")) {
        for (let key2 in option.restrictions) {
          option.restrictions[key2].forEach((restriction) => {
            if (this.state.options[key2].value === restriction) {
              sliderDisplay = false;
            }
          });
        }
      }
      options.push(
        option.options[0] === false ? (
          // switch button for true/false options
          <MKBox px={2} key={key}>
            <Grid container>
              <Grid item container xs={12} md={5} alignItems="center">
                <MKTypography variant="h6">{option.name}</MKTypography>
              </Grid>
              <Grid item container xs={12} md={7} alignItems="center">
                <Switch
                  checked={!!option.value}
                  onChange={(e) => {
                    if (option.hasOwnProperty("restrictions")) {
                      let check = false;
                      for (let key2 in option.restrictions) {
                        option.restrictions[key2].forEach((restriction) => {
                          if (this.state.options[key2].value === restriction) {
                            check = true;
                          }
                        });
                      }
                      if (!check) {
                        option.value = Number(e.target.checked);
                        this.setState({});
                      }
                    } else {
                      option.value = Number(e.target.checked);
                      this.setState({});
                    }
                  }}
                />
              </Grid>
            </Grid>
          </MKBox>
        ) : typeof option.options[0] === "number" ? (
          sliderDisplay ? (
            // slider for numeric options
            <MKBox px={2} key={key}>
              <Grid container justifyContent="center">
                <Grid item container xs={12} md={11} alignItems="center">
                  <Slider
                    aria-label="Custom marks"
                    getAriaValueText={(value) => {
                      return value;
                    }}
                    step={0.001}
                    min={option.options[0]}
                    max={option.options[1]}
                    valueLabelDisplay="auto"
                    color="secondary"
                    value={option.value}
                    marks={[
                      {
                        value: option.options[0],
                        label: option.options[0],
                      },
                      {
                        value: option.options[1],
                        label: option.options[1],
                      },
                    ]}
                    onChange={(e) => {
                      option.value = Number(e.target.value);
                      this.setState({});
                    }}
                  />
                </Grid>
              </Grid>
            </MKBox>
          ) : (
            ""
          )
        ) : (
          // radio button
          <MKBox px={2} key={key}>
            <MKTypography variant="h6">{option.name}</MKTypography>
            <RadioGroup
              row
              value={option.value}
              onChange={(e) => {
                option.value = Number(e.target.value);
                this.setState({});
                if (option.hasOwnProperty("control")) {
                  for (let key2 in option.control) {
                    option.control[key2].forEach((control) => {
                      if (Number(e.target.value) === control) {
                        this.state.options[key2].value = 0;
                        this.setState({});
                      }
                    });
                  }
                }
              }}
            >
              {option.options.map((opt, id) => {
                return <FormControlLabel key={id} value={id} control={<Radio />} label={opt} />;
              })}
            </RadioGroup>
          </MKBox>
        )
      );
    }
    return options;
  }
  checkRowOOR() {
    return (
      this.state.addedSRow + 1 > this.state.numRow || this.state.addedGRow + 1 > this.state.numRow
    );
  }

  checkColOOR() {
    return (
      this.state.addedSCol + 1 > this.state.numCol || this.state.addedGCol + 1 > this.state.numCol
    );
  }

  render() {
    console.log(this.state.options);
    return (
      <BaseLayout title="Classic MAPF">
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
                {this.populateDescription()}
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
        <Grid container className="body" px={4} sx={{ WebkitUserDrag: "none" }}>
          {/* 2d map */}
          <Grid
            item
            container
            xs={12}
            md={8}
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ WebkitUserDrag: "none" }}
          >
            <Grid container id="map" sx={{ WebkitUserDrag: "none" }}>
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
                    sx={{ WebkitWebkitUserDrag: "none" }}
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
                          sx={{ WebkitUserDrag: "none" }}
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
            style={{
              display: "inline-block",
            }}
          >
            <div>
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
                  replay={() => this.playAnimation()}
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
                                py={2}
                                px={2}
                              >
                                <MKTypography variant="h4">CBS improvement techniques</MKTypography>
                              </MKBox>
                              <Divider dark="true" sx={{ my: 0 }} />
                              {this.populateOptions()}
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
                            }}
                            onBlur={(e) => this.changeMapCol(e)}
                            value={this.state.tempCol ? this.state.tempCol : ""}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <UploadMap
                      adjustMap={(height, width, map) => this.adjustMap(height, width, map)}
                    />
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
                    <Grid
                      container
                      item
                      xs={12}
                      lg={10}
                      sx={{ mx: "auto" }}
                      justifyContent="center"
                      spacing={1}
                    >
                      <Grid item xs={12} md={10} mb={2}>
                        <MKTypography variant="body2" textAlign="center">
                          To add an agent, first click the add button, then click the start location
                          followed by the goal location on the map. To remove an agent, click the
                          remove button followed by the agent.
                        </MKTypography>
                      </Grid>
                      <Grid item xs={12} md={6} mb={1}>
                        <MKButton
                          variant="gradient"
                          color="info"
                          startIcon={<AddIcon />}
                          fullWidth
                          onClick={() => {
                            this.handleAddAgentByClick();
                          }}
                        >
                          add agent
                        </MKButton>
                      </Grid>
                      <Grid item xs={12} md={6} mb={1}>
                        <MKButton
                          variant="gradient"
                          color="error"
                          startIcon={<DeleteIcon />}
                          fullWidth
                          onClick={() => {
                            this.removeAgent();
                          }}
                        >
                          remove agent
                        </MKButton>
                      </Grid>
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
export default MAPFVisualizer;
