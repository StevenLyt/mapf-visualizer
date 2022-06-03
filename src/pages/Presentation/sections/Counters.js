/*
=========================================================
* Material Kit 2 React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
// Material Kit 2 React examples
import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";

function Counters() {
  return (
    <MKBox component="section" py={3}>
      <MKBox component="section" sx={{ display: "flex", overflow: "hidden" }}>
        <Container
          sx={{
            mt: 7,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <MKTypography variant="h2" sx={{ mb: 1 }}>
            MAPF Variants
          </MKTypography>
        </Container>
      </MKBox>
      <Container>
        <Grid container item xs={12} lg={12} sx={{ mx: "auto" }}>
          <Grid item xs={12} md={4}>
            <DefaultCounterCard
              title="Classic MAPF"
              path="/classic-visualizer"
              description="Agents only occupies a single point"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, mx: 0 }} />
            <DefaultCounterCard
              title="MAPF with Large Agents"
              path="/la-visualizer"
              description="Agents may have a two-dimensional shape"
            />
            <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, ml: 0 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <DefaultCounterCard
              title="Robust MAPF"
              path="/robust-visualizer"
              description="Agent may have an action delay"
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Counters;
