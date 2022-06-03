import { Component } from "react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Button from "@mui/material/Button";
import MKTypography from "components/MKTypography";
import Container from "@mui/material/Container";
import Lottie from "react-lottie";
import SuccessLogo from "assets/lotties/success.json";
import MKButton from "components/MKButton";

export default class PlanningResult extends Component {
  decodeLocation(loc) {
    return {
      r: Math.floor(loc / this.props.numCol),
      c: loc % this.props.numCol,
    };
  }

  render() {
    const { algorithm, status, planningTime, paths, startNew, isDisabled } = this.props;
    var isSuccessful = status === "Optimal";
    console.log(status);
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
        <MKTypography
          variant="h2"
          align="center"
          color={isSuccessful ? "success" : "error"}
          sx={{
            mb: 2,
          }}
        >
          {isSuccessful
            ? "Optimal solution found!"
            : status === "Nosolutions"
            ? "No solution found!"
            : "Time out!"}
        </MKTypography>

        {isSuccessful ? (
          <Lottie
            options={{
              loop: false,
              autoplay: true,
              animationData: SuccessLogo,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={100}
            width={100}
            style={{ marginBottom: 80, pointerEvents: "none" }}
          />
        ) : (
          ""
        )}

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
        <MKButton
          variant="gradient"
          color="secondary"
          startIcon={<RestartAltIcon />}
          onClick={() => startNew()}
          disabled={isSuccessful && isDisabled}
          sx={{
            mt: 7,
          }}
        >
          Start over
        </MKButton>
      </Container>
    );
  }
}
