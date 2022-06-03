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

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function Team() {
  return (
    <MKBox
      component="section"
      variant="gradient"
      position="relative"
      py={6}
      px={{ xs: 2, lg: 0 }}
      mx={-2}
    >
      <Container>
        <Grid container>
          <Grid item xs={12} md={12} sx={{ mb: 6 }}>
            <MKTypography variant="h2" textAlign="center" my={2}>
              Single-point MAPF
            </MKTypography>
            <MKTypography variant="h4">CBSH2-RTC:</MKTypography>
            <MKTypography variant="body1" my={2}>
              Pairwise Symmetry Reasoning for Multi-Agent Path Finding Search. <br />
              Jiaoyang Li, Daniel Harabor, Peter J. Stuckey, Hang Ma, Graeme Gange and Sven Koenig.{" "}
              <br />
              <em>Artificial Intelligence (AIJ), vol 301, pages 103574, 2021.</em>
            </MKTypography>

            <MKTypography variant="h2" textAlign="center" my={2}>
              Large Agent MAPF
            </MKTypography>
            <MKTypography variant="h4">Mutex Propagation with MC-CBS</MKTypography>
            <MKTypography variant="body1" my={2}>
              Mutex Propagation in Multi-Agent Path Finding for Large Agents. <br />
              Han Zhang, Yutong Li, Jiaoyang Li, T. K. Satish Kumar and Sven Koenig. <br />
              <em> International Symposium on Combinatorial Search (SoCS), 2022. </em>
            </MKTypography>
            <MKTypography variant="h4">MC-CBS</MKTypography>
            <MKTypography variant="body1" my={2}>
              Multi-Agent Path Finding for Large Agents. <br />
              Jiaoyang Li, Pavel Surynek, Ariel Felner, Hang Ma, T. K. Satish Kumar and Sven Koenig.{" "}
              <br />
              <em>AAAI Conference on Artificial Intelligence (AAAI), pages 7627-7634, 2019.</em>
            </MKTypography>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Team;
