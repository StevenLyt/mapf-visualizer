import { Component } from "react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Button from "@mui/material/Button";
import MKTypography from "components/MKTypography";
import Container from "@mui/material/Container";
import Lottie from "react-lottie";
import Success from "assets/lotties/success.json";
import Failure from "assets/lotties/failure.json";

import MKButton from "components/MKButton";

export default class PlanningResult extends Component {
  decodeLocation(loc) {
    return {
      r: Math.floor(loc / this.props.numCol),
      c: loc % this.props.numCol,
    };
  }

  render() {
    const { algorithm, status, planningTime, paths, startNew, replay, isDisabled } = this.props;
    var isSuccessful = status >= 0;
    var isMemExceeded = status == -5;
    console.log(status);
    console.log(status == -1);
    return (
      <Container
        sx={{
          mt: 5,
          mb: 10,
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
          style={{ marginBottom: 80, pointerEvents: "none" }}
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
            <div className="path-detail">
              {isSuccessful
                ? paths.map((path, agentId) => {
                    console.log(path);
                    path = path.map((loc) => {
                      var coordinate = this.decodeLocation(loc);
                      return `(${coordinate.r},${coordinate.c})`;
                    });
                    var p = path.join("->");
                    return (
                      <MKTypography variant="h5" key={agentId}>
                        <b>
                          <i>{"Agent " + (agentId + 1) + ": "}</i>
                        </b>
                        {p}
                      </MKTypography>
                    );
                  })
                : ""}
            </div>
          </div>
        )}
        {isSuccessful ? (
          <MKButton
            variant="gradient"
            color="info"
            startIcon={<PlayCircleOutlineIcon />}
            onClick={() => replay()}
            disabled={isSuccessful && isDisabled}
            sx={{
              mt: 7,
            }}
          >
            Replay
          </MKButton>
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
          Start over
        </MKButton>
      </Container>
    );
  }
}
