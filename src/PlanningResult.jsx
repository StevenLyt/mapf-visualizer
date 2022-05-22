import { Component } from "react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Button from "@mui/material/Button";
import Typography from "./components/Typography";
import Container from "@mui/material/Container";
import { Coronavirus } from "@mui/icons-material";
import Lottie from "react-lottie";
import SuccessLogo from "./asset/lotties/success.json";

export default class PlanningResult extends Component {
  decodeLocation(loc) {
    return {
      r: Math.floor(loc / this.props.numCol),
      c: loc % this.props.numCol,
    };
  }

  render() {
    const { algorithm, status, planningTime, paths, startNew } = this.props;
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
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 2,
            color: isSuccessful ? "success.main" : "error.main",
          }}
        >
          {isSuccessful
            ? "Optimal solution found!"
            : status === "Nosolutions"
            ? "No solution found!"
            : "Time out!"}
        </Typography>

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

        <Typography variant="h5">{"Algorithm: " + algorithm}</Typography>
        <Typography variant="h5">
          {"Execution time: " + planningTime}
        </Typography>
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
                  <Typography variant="h5">
                    {"Agent " + (agentId + 1) + ": " + p}
                  </Typography>
                );
              })
            : ""}
        </div>
        <Button
          variant="contained"
          color="info"
          startIcon={<RestartAltIcon />}
          onClick={() => startNew()}
          sx={{
            mt: 7,
          }}
        >
          Start over
        </Button>
      </Container>
    );
  }
}
