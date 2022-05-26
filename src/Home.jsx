import * as React from "react";
import Button from "./components/Button";
import Typography from "./components/Typography";
import HomeLayout from "./HomeLayout";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Container, Link } from "@mui/material";

const item = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  px: 5,
};

const number = {
  fontSize: 24,
  fontFamily: "default",
  color: "secondary.main",
  fontWeight: "medium",
};

const image = {
  height: 55,
  my: 4,
};
const backgroundImage = "./asset/bg";
// "https://images.unsplash.com/photo-1534854638093-bada1813ca19?auto=format&fit=crop&w=1400&q=80";

export default function Home() {
  return (
    <div>
      <HomeLayout
        sxBackground={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: "#7fc7d9", // Average color of the background image.
          backgroundPosition: "center",
        }}
      >
        {/* Increase the network loading priority of the background image. */}
        <img
          style={{ display: "none" }}
          src={backgroundImage}
          alt="increase priority"
        />
        <Typography color="inherit" align="center" variant="h2" marked="center">
          Path Finding with Multiple Agents
        </Typography>
        <Typography
          color="inherit"
          align="center"
          variant="h5"
          sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
        >
          Use this visualization tool to help understand path finding
          algorithms.
        </Typography>
        <Grid container spacing={-20}>
          <Grid item xs={12} md={6}>
            <Box sx={item}>
              <Button
                color="secondary"
                variant="contained"
                size="large"
                component="a"
                href="/la-visualizer"
                sx={{ minWidth: 200 }}
              >
                Try with benchmarks
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={item}>
              <Button
                color="secondary"
                variant="contained"
                size="large"
                component="a"
                href="/la-visualizer"
                sx={{ minWidth: 200 }}
              >
                Start new instance
              </Button>
            </Box>
          </Grid>
        </Grid>
      </HomeLayout>
      <Box
        component="section"
        sx={{ display: "flex", bgcolor: "#eee", overflow: "hidden" }}
      >
        <Container
          sx={{
            mt: 10,
            mb: 15,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            marked="center"
            component="h2"
            sx={{ mb: 10 }}
          >
            Multi-Agent Path Finding (MAPF)
          </Typography>
          <Grid container spacing={50}>
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src={require("./asset/mapf-demo.gif")}
                sx={{
                  pointerEvents: "none",
                  position: "absolute",
                  width: 400,
                  height: 400,
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ mb: 4 }}>
                In the multi-agent path finding (MAPF) problem, we are given a
                graph and a set of objects/agents. Each agent has a start
                position and goal position in the graph. At each time step an
                agent can either move to a neighboring location or can wait in
                its current location. The task is to find a set of optimal
                conflict-free paths. That is, every agent can move to its goal
                without conflicting with other agents (i.e., without being in
                the same location at the same time) while minimizing a
                cumulative cost function. The common cost function is the sum
                over all agents of the number of time steps required to reach
                the goal location. FOr this website, we primarily use grid-based
                MAPF, in which each agent's position is an integer
                two-dimensional coordinate. For more complete information,
                please visit{" "}
                <Link href="http://mapf.info" underline="none" target="_blank">
                  this MAPF info website
                </Link>
                .
              </Typography>
            </Grid>
          </Grid>
          {/* <Button
            color="secondary"
            size="large"
            variant="contained"
            component="a"
            href="/premium-themes/onepirate/sign-up/"
            sx={{ mt: 8 }}
          >
            Get started
          </Button> */}
        </Container>
      </Box>

      <Box
        component="section"
        sx={{ display: "flex", bgcolor: "primary.light", overflow: "hidden" }}
      >
        <Container
          sx={{
            mt: 10,
            mb: 15,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src="/static/themes/onepirate/productCurvyLines.png"
            alt="curvy lines"
            sx={{
              pointerEvents: "none",
              position: "absolute",
              top: -180,
              opacity: 0.7,
            }}
          />
          <Typography
            variant="h4"
            marked="center"
            component="h2"
            sx={{ mb: 14 }}
          >
            MAPF variants
          </Typography>
          <div>
            <Grid container spacing={20}>
              <Grid item xs={12} md={4}>
                <Box sx={item}>
                  <Box sx={number}>1.</Box>

                  <Typography variant="h5" align="center">
                    Classic MAPF
                  </Typography>
                  <Button
                    color="secondary"
                    size="medium"
                    variant="contained"
                    component="a"
                    sx={{ mt: 8 }}
                  >
                    Get started
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={item}>
                  <Box sx={number}>2.</Box>
                  <Typography variant="h5" align="center">
                    MAPF with Large Agents
                  </Typography>
                  <Button
                    color="secondary"
                    size="medium"
                    variant="contained"
                    component="a"
                    href="/la-visualizer"
                    sx={{ mt: 8 }}
                  >
                    Get started
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={item}>
                  <Box sx={number}>3.</Box>
                  <Typography variant="h5" align="center">
                    Robust MAPF
                  </Typography>
                  <Button
                    color="secondary"
                    size="medium"
                    variant="contained"
                    component="a"
                    sx={{ mt: 8 }}
                  >
                    Get started
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </div>
        </Container>
      </Box>
    </div>
  );
}
