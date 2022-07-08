import { Component } from "react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { ToggleButton, ToggleButtonGroup, Grid, Card } from "@mui/material";
import MKTypography from "components/MKTypography";
import Container from "@mui/material/Container";
import Lottie from "react-lottie";
import Success from "assets/lotties/success.json";
import Failure from "assets/lotties/failure.json";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

import MKButton from "components/MKButton";

export default class PlanningResult extends Component {
  decodeLocation(loc) {
    return {
      r: Math.floor(loc / this.props.numCol),
      c: loc % this.props.numCol,
    };
  }

  render() {
    const {
      algorithm,
      status,
      planningTime,
      paths,
      startNew,
      replay,
      isDisabled,
      speed,
      setSpeed,
      agents,
    } = this.props;
    var isSuccessful = status >= 0;
    var isMemExceeded = status == -5;
    return (
      <Container
        sx={{
          mt: 5,
          mb: 5,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "normal",
        }}
      >
        <MKTypography variant="h2" align="center" color={isSuccessful ? "success" : "error"}>
          {isSuccessful
            ? "Optimal solution found!"
            : status == -1
            ? "Time out!"
            : isMemExceeded
            ? "Memory exceeded"
            : "No solution found!"}
        </MKTypography>
        <Lottie
          options={{
            loop: false,
            autoplay: true,
            animationData: isSuccessful ? Success : Failure,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          height={150}
          width={150}
          style={{ pointerEvents: "none" }}
        />
        {isMemExceeded ? (
          <MKTypography variant="h5">
            To prevent the server from collapsing, each process is limited to use no more than 4GB
            of memory, which should be sufficient for most cases. But if you see this message, it
            means the MAPF instance you entered tried to use more than the 4GB limit.
          </MKTypography>
        ) : (
          <div>
            <MKTypography variant="h5">
              <b>{"Algorithm: " + algorithm} </b>
            </MKTypography>
            <MKTypography variant="h5">
              <b>{"Execution time: " + planningTime + " s"}</b>
            </MKTypography>
            <div>
              {isSuccessful
                ? paths.map((path, agentId) => {
                    path = path.map((loc) => {
                      var coordinate = this.decodeLocation(loc);
                      return `(${coordinate.r},${coordinate.c})`;
                    });
                    var p = path.join("->");
                    var color = agents[agentId].color;
                    return (
                      <div key={agentId}>
                        <MKTypography variant="h5" key={agentId + "f"} sx={{ color: color }}>
                          <b>
                            <i>{"Agent " + (agentId + 1) + ": "}</i>
                          </b>
                        </MKTypography>
                        <MKTypography variant="body1" key={agentId + "s"}>
                          {p}
                        </MKTypography>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        )}
        {isSuccessful ? (
          <Grid item xs={12} sx={{ mt: 5 }}>
            <ToggleButtonGroup
              color="primary"
              value={speed}
              exclusive
              fullWidth
              onChange={(_, speed) => setSpeed(speed)}
            >
              <ToggleButton value="Slow"><b>Slow</b></ToggleButton>
              <ToggleButton value="Medium"><b>Medium</b></ToggleButton>
              <ToggleButton value="Fast"><b>Fast</b></ToggleButton>
            </ToggleButtonGroup>
            <MKButton
              variant="gradient"
              color="info"
              startIcon={<PlayCircleOutlineIcon />}
              onClick={() => replay()}
              disabled={isSuccessful && isDisabled}
              fullWidth
              sx={{
                mt: 2,
              }}
            >
              Replay
            </MKButton>
          </Grid>
        ) : (
          ""
        )}
        <MKButton
          variant="gradient"
          color="secondary"
          startIcon={<RestartAltIcon />}
          onClick={() => startNew()}
          disabled={isSuccessful && isDisabled}
          sx={{
            mt: 2,
          }}
        >
          Start new
        </MKButton>
      </Container>
    );
  }
}
