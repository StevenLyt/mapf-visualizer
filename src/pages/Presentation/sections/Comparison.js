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
import Stack from "@mui/material/Stack";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKBadge from "components/MKBadge";
import MKTypography from "components/MKTypography";
import { fa1, fa2, fa3, fa4 } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Comparison() {
  return (
    <MKBox component="section" py={{ xs: 3, md: 9 }}>
      <MKBox component="section" my={6} py={0}>
        <Container>
          <Grid
            container
            item
            xs={12}
            lg={6}
            flexDirection="column"
            alignItems="center"
            sx={{ textAlign: "center", my: 6, mx: "auto", px: 0.75 }}
          >
            <MKBadge
              variant="contained"
              color="info"
              badgeContent="Pretty and Animated"
              container
              sx={{ mb: 2 }}
            />
            <MKTypography variant="h2" fontWeight="bold">
              Enjoy the beauty of algorithms
            </MKTypography>
            <MKTypography variant="body1" color="text">
              We have created this animated tool to help you visualize various MAPF algorithms with
              ease.
            </MKTypography>
          </Grid>
        </Container>
      </MKBox>
      <Container>
        <Grid container alignItems="center">
          <Grid item xs={12} lg={6} pr={2}>
            <MKTypography variant="h3" my={1}>
              Traditional ways of running MAPF
            </MKTypography>
            <MKTypography variant="body2" color="text" mb={2}>
              Running a MAPF solver could be pretty complicated and the experience for first-timers
              could be frustrating.
            </MKTypography>
            {/* <MKTypography
              component="a"
              href="#"
              variant="body2"
              color="info"
              fontWeight="regular"
              sx={{
                width: "max-content",
                display: "flex",
                alignItems: "center",

                "& .material-icons-round": {
                  fontSize: "1.125rem",
                  transform: "translateX(3px)",
                  transition: "transform 0.2s cubic-bezier(0.34, 1.61, 0.7, 1.3)",
                },

                "&:hover .material-icons-round, &:focus .material-icons-round": {
                  transform: "translateX(6px)",
                },
              }}
            >
              More
              <Icon sx={{ fontWeight: "bold" }}>arrow_forward</Icon>
            </MKTypography> */}
          </Grid>
          <Grid item xs={12} lg={6} sx={{ ml: { xs: -2, lg: 0 }, mt: { xs: 6, lg: 0 } }}>
            <Stack>
              <MKBox display="flex" alignItems="center" p={2}>
                <MKBox
                  width="3rem"
                  height="3rem"
                  variant="gradient"
                  bgColor="warning"
                  color="white"
                  coloredShadow="info"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="xl"
                >
                  <FontAwesomeIcon icon={fa1} />
                </MKBox>
                <MKTypography variant="body2" color="text" pl={2}>
                  Browse online to find the correct algorithm package
                </MKTypography>
              </MKBox>
              <MKBox display="flex" alignItems="center" p={2}>
                <MKBox
                  width="3rem"
                  height="3rem"
                  variant="gradient"
                  bgColor="warning"
                  color="white"
                  coloredShadow="info"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="xl"
                >
                  <FontAwesomeIcon icon={fa2} />
                </MKBox>
                <MKTypography variant="body2" color="text" pl={2}>
                  Compile the code, usually C++, into executables
                </MKTypography>
              </MKBox>
              <MKBox display="flex" alignItems="center" p={2}>
                <MKBox
                  width="3rem"
                  height="3rem"
                  variant="gradient"
                  bgColor="warning"
                  color="white"
                  coloredShadow="info"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="xl"
                >
                  <FontAwesomeIcon icon={fa3} />
                </MKBox>
                <MKTypography variant="body2" color="text" pl={2}>
                  Put the map and instance into two separate files with contents
                  <br /> formatted in terms of certain rules
                </MKTypography>
              </MKBox>
              <MKBox display="flex" alignItems="center" p={2}>
                <MKBox
                  width="3rem"
                  height="3rem"
                  variant="gradient"
                  bgColor="warning"
                  color="white"
                  coloredShadow="info"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="xl"
                >
                  <FontAwesomeIcon icon={fa4} />
                </MKBox>
                <MKTypography variant="body2" color="text" pl={2}>
                  Run the executable with a complicated command
                </MKTypography>
              </MKBox>
            </Stack>
          </Grid>
        </Grid>
        <Grid container alignItems="center">
          <Grid item xs={12} lg={6} sx={{ ml: { xs: -2, lg: "auto" }, mt: { xs: 6, lg: 0 } }}>
            <Stack>
              <MKBox display="flex" alignItems="center" p={2}>
                <MKBox
                  width="3rem"
                  height="3rem"
                  variant="gradient"
                  bgColor="success"
                  color="white"
                  coloredShadow="info"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="xl"
                >
                  <FontAwesomeIcon icon={fa1} />
                </MKBox>
                <MKTypography variant="body2" color="text" pl={2}>
                  Select a algorithm you are interested in
                </MKTypography>
              </MKBox>
              <MKBox display="flex" alignItems="center" p={2}>
                <MKBox
                  width="3rem"
                  height="3rem"
                  variant="gradient"
                  bgColor="success"
                  color="white"
                  coloredShadow="info"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="xl"
                >
                  <FontAwesomeIcon icon={fa2} />
                </MKBox>
                <MKTypography variant="body2" color="text" pl={2}>
                  Design your own map by dragging your mouse to add walls
                </MKTypography>
              </MKBox>
              <MKBox display="flex" alignItems="center" p={2}>
                <MKBox
                  width="3rem"
                  height="3rem"
                  variant="gradient"
                  bgColor="success"
                  color="white"
                  coloredShadow="info"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="xl"
                >
                  <FontAwesomeIcon icon={fa3} />
                </MKBox>
                <MKTypography variant="body2" color="text" pl={2}>
                  Add agents by entering their start and goal location on the right-hand side panel
                </MKTypography>
              </MKBox>
              <MKBox display="flex" alignItems="center" p={2}>
                <MKBox
                  width="3rem"
                  height="3rem"
                  variant="gradient"
                  bgColor="success"
                  color="white"
                  coloredShadow="info"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="xl"
                >
                  <FontAwesomeIcon icon={fa4} />
                </MKBox>
                <MKTypography variant="body2" color="text" pl={2}>
                  Press the plan button and get your animated planning result instantly
                </MKTypography>
              </MKBox>
            </Stack>
          </Grid>
          <Grid item xs={12} lg={6}>
            <MKTypography variant="h3" my={1}>
              The new streamlined approach
            </MKTypography>
            <MKTypography variant="body2" color="text" mb={2}>
              This website offers a much more intuitive experience. Even users without prior
              knowledge about MAPF can play around with the algorithm. Enjoy!
            </MKTypography>
            {/* <MKTypography
              component="a"
              href="#"
              variant="body2"
              color="info"
              fontWeight="regular"
              sx={{
                width: "max-content",
                display: "flex",
                alignItems: "center",

                "& .material-icons-round": {
                  fontSize: "1.125rem",
                  transform: "translateX(3px)",
                  transition: "transform 0.2s cubic-bezier(0.34, 1.61, 0.7, 1.3)",
                },

                "&:hover .material-icons-round, &:focus .material-icons-round": {
                  transform: "translateX(6px)",
                },
              }}
            >
              More
              <Icon sx={{ fontWeight: "bold" }}>arrow_forward</Icon>
            </MKTypography> */}
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Comparison;
