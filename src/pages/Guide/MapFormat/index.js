// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKAlert from "components/MKAlert";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";
import example from "assets/images/example.png";

function MapFormat() {
  return (
    <>
      <DefaultNavbar routes={routes} transparent light />
      <MKBox
        minHeight="35vh"
        width="100%"
        bgColor="dark"
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container>
          <Grid
            container
            item
            xs={12}
            lg={8}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            sx={{ mx: "auto", textAlign: "center" }}
          >
            <MKTypography
              variant="h1"
              color="white"
              sx={({ breakpoints, typography: { size } }) => ({
                [breakpoints.down("md")]: {
                  fontSize: size["3xl"],
                },
              })}
            >
              Map file format
            </MKTypography>
          </Grid>
        </Container>
      </MKBox>
      <Card
        sx={{
          p: 2,
          mx: { xs: 2, lg: 3 },
          mt: -8,
          mb: 4,
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
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
              <Grid item xs={12} md={12}>
                <MKTypography variant="h4">Map format</MKTypography>
                <MKTypography variant="body1" my={2}>
                  For convenience, we adopt Nathan Sturtevant's MAPF map format, which is widely
                  used by researchers in this field.
                </MKTypography>
                <MKTypography variant="body1" my={2}>
                  The map file need to start with lines:
                </MKTypography>
                <MKTypography variant="body1" my={2}>
                  <code>
                    <pre>{"type octile\nheight y\nwidth x\nmap"}</pre>
                  </code>
                </MKTypography>
                <MKTypography variant="body1" my={2}>
                  where <code>x</code> is the width (number of columns) of the map, <code>y</code>{" "}
                  is the height (number of rows) of the map.
                </MKTypography>
                <MKTypography variant="body1" my={2}>
                  The following lines are the map data. Each line represents a row of the map, and
                  each character corresponds to a grid.
                  <br />
                  The character <code>.</code> represents a free grid, and the character{" "}
                  <code>@</code> represents a wall.
                </MKTypography>
                <MKTypography variant="body1" my={2}>
                  Here's an example:
                </MKTypography>
              </Grid>

              <Grid item xs={12} md={6} sx={{ mb: 2 }}>
                <MKTypography variant="body1" my={2}>
                  <MKBox
                    component="img"
                    src={example}
                    sx={{
                      pointerEvents: "none",
                      width: "50%",
                      height: "auto",
                    }}
                  />
                </MKTypography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ mb: 2 }}>
                <MKTypography variant="body1" my={2}>
                  <code>
                    <pre>
                      {
                        "type octile\nheight 4\nwidth 8\nmap\n.@@@@@@.\n..@...@.\n@...@...\n@@@@@@@."
                      }
                    </pre>
                  </code>
                </MKTypography>
              </Grid>
              <Grid item xs={12}>
                <MKTypography variant="body1" my={2}>
                  <i>
                    <b>
                      Note: for performance reason, please make sure the map size is not too large
                      (smaller than 35 by 35). Support of larger maps will be added in the following
                      version.
                    </b>
                  </i>
                </MKTypography>
              </Grid>
            </Grid>
          </Container>
        </MKBox>
      </Card>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default MapFormat;
