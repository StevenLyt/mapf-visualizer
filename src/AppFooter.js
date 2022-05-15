import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Typography from "./components/Typography";
import TextField from "./components/TextField";

function Copyright() {
  return (
    <React.Fragment>
      {"© "}
      <Link
        color="inherit"
        href="https://stevenlyt.github.io"
        underline="hover"
      >
        Yutong Li
      </Link>{" "}
      {new Date().getFullYear()}
      {". Powered by React & MUI Design."}
    </React.Fragment>
  );
}

const iconStyle = {
  width: 48,
  height: 48,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "warning.main",
  mr: 1,
  "&:hover": {
    backgroundColor: "warning.dark",
  },
};

export default function AppFooter() {
  return (
    <Typography
      component="footer"
      sx={{ display: "flex", backgroundColor: "#ddd", mt: 7}}
    >
      <Container sx={{ my: 4, display: "flex" }}>
        <Grid container spacing={5}>
          <Grid item xs={6} sm={40} md={30}>
            <Grid
              container
              direction="column"
              justifyContent="flex-end"
              spacing={2}
              sx={{ height: 30 }}
            >
              <Grid item>
                <Copyright />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}
