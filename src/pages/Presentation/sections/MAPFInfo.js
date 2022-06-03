import { Grid, Container, Link } from "@mui/material";
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import demo from "assets/images/mapf-demo.gif";

export default function MAPFInfo() {
  return (
    <MKBox component="section" sx={{ display: "flex", bgcolor: "secondary", overflow: "hidden" }}>
      <Container
        sx={{
          mt: 10,
          mb: 10,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
                position: "absolute",
                width: 400,
                height: 400,
              }}
            />
          </Grid>
          <Grid
            item
            container
            xs={12}
            md={8}
    
          >
            <MKTypography variant="body1" color="text" sx={{ mb: 4 }}>
              In the multi-agent path finding (MAPF) problem, we are given a graph and a set of
              objects/agents. Each agent has a start position and goal position in the graph. At
              each time step an agent can either move to a neighboring location or can wait in its
              current location.
            </MKTypography>

            <MKTypography variant="body1" color="text" sx={{ mb: 4 }}>
              The task is to find a set of optimal conflict-free paths. That is, every agent can
              move to its goal without conflicting with other agents (i.e., without being in the
              same location at the same time) while minimizing a cumulative cost function. The
              common cost function is the sum over all agents of the number of time steps required
              to reach the goal location. FOr this website, we primarily use grid-based MAPF, in
              which each agent's position is an integer two-dimensional coordinate. For more
              complete information, please visit{" "}
              <Link href="http://mapf.info" underline="none" target="_blank">
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
