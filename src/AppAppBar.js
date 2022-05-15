import * as React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import withRoot from "./withRoot";
import GitHubIcon from "@mui/icons-material/GitHub";
import Typography from "./components/Typography";

const rightLink = {
  fontSize: 16,
  color: "common.white",
  ml: 3,
  textTransform: "none",
};

function AppAppBar() {
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ flex: 1 }} />
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            href="todo"
            sx={{ fontSize: 24 }}
          >
            MAPF Visualizer
          </Link>

          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <Link
              variant="h6"
              underline="none"
              href="https://Stevenlyt.github.io"
              sx={{ ...rightLink }}
            >
              {"More about MAPF"}
            </Link>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              href="https://github.com/Stevenlyt/MAPF-Visualizer"
              sx={rightLink}
            >
              <GitHubIcon />
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
}

export default AppAppBar;
