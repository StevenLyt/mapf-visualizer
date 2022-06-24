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
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";

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
            <MKBox p={2} textAlign="center" lineHeight={1}>
              <MKTypography variant="h5" mt={2} mb={1}>
                Classic MAPF
              </MKTypography>
              <MKTypography variant="body2" color="text">
                Agents only occupy a single point
              </MKTypography>
              <MKButton
                color="info"
                size="medium"
                variant="outlined"
                href="/classic-visualizer/CBSH2-RTC"
                component="a"
                sx={{ mt: 5 }}
              >
                Get started
              </MKButton>
            </MKBox>
          </Grid>
          <Grid item xs={12} md={4}>
            <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, mx: 0 }} />
            <MKBox p={2} textAlign="center" lineHeight={1}>
              <MKTypography variant="h5" mt={2} mb={1}>
                MAPF with Large Agents
              </MKTypography>
              <MKTypography variant="body2" color="text">
                Agents may have a two-dimensional height and width
              </MKTypography>
              <MKButton
                color="info"
                size="medium"
                variant="outlined"
                href="/la-visualizer"
                component="a"
                sx={{ mt: 5 }}
              >
                Get started
              </MKButton>
            </MKBox>
            <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, ml: 0 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <MKBox p={2} textAlign="center" lineHeight={1}>
              <MKTypography variant="h5" mt={2} mb={1}>
                Robust MAPF
              </MKTypography>
              <MKTypography variant="body2" color="text">
                Agents may have an action delay
              </MKTypography>
              <MKButton
                color="secondary"
                size="medium"
                variant="outlined"
                href="/robust-visualizer"
                component="a"
                sx={{
                  mt: 5,
                  pointerEvents: "none",
                }}
              >
                Coming soon
              </MKButton>
            </MKBox>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Counters;
