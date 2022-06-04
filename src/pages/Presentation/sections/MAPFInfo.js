import { Grid, Container, Link } from "@mui/material";
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import demo from "assets/images/mapf-demo.gif";

export default function MAPFInfo() {
  return (
    <MKBox component="section" sx={{ display: "flex", overflow: "hidden" }}>
      <Container
        sx={{
          mt: 10,
          mb: 10,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MKTypography variant="h2" fontWeight="bold" sx={{ mb: 10 }}>
          Multi-Agent Path Finding (MAPF)
        </MKTypography>
        <Grid container spacing={12}>
          <Grid item xs={12} md={4}>
            <MKBox
              component="img"
              src={demo}
              sx={{
                pointerEvents: "none",
                width: "100%",
                height: "auto",
              }}
            />
          </Grid>
          <Grid item xs={12} md={8} alignItems="center" justifyContent="center">
            <MKTypography variant="body1" sx={{ mb: 4 }}>
              In the multi-agent path finding (MAPF) problem, we are given a two-dimensional graph
              (think it as a maze) and a set of objects/agents. Each agent has a start position and
              goal position on the graph. The actions an agent can take is either moving to a
              neighboring location or waiting in its current location.
            </MKTypography>
            <MKTypography variant="body1" sx={{ mb: 4 }}>
              Our task is to find a set of optimal conflict-free paths. That is, every agent can
              move to its goal without conflicting with other agents while minimizing a cumulative
              cost function. The common cost function is the sum of every individual agent's time
              cost. For this website, we primarily use grid-based MAPF, in which each agent's
              position is an integer two-dimensional coordinate. For more complete information,
              please visit{" "}
              <Link href="http://mapf.info" color="info" underline="none" target="_blank">
                this MAPF info website
              </Link>
              .
            </MKTypography>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}
