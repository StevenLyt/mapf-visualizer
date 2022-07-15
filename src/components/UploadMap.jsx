import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import MKBox from "components/MKBox";
import { Grid, Menu, MenuItem, Icon, Slide, Modal, Divider } from "@mui/material";
import { maps } from "components/maps";
import { Component } from "react";

export default class UploadMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: null,
      isDialogOpen: false,
    };
  }
  openDropdown(event) {
    this.setState({ isDropdownOpen: event.currentTarget });
  }

  closeDropdown(map) {
    this.setState({ isDropdownOpen: null });
    map = require("../assets/maps/" + map);
    fetch(map)
      .then((r) => r.text())
      .then((text) => this.parseMap(text));
  }

  uploadMap(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (event) => {
      this.parseMap(event.target.result);
    };
  }

  parseMap(text) {
    if (!this.verifyMap(text)) {
      this.setState({ isDialogOpen: true });
      return;
    }

    var lines = text.trim().split(/\r?\n/);
    var height = parseInt(lines[1].split(" ")[1]);
    var width = parseInt(lines[2].split(" ")[1]);
    var map = Array(height)
      .fill()
      .map(() =>
        new Array(width).fill().map(() => ({
          isWall: false,
          isStart: false,
          isGoal: false,
          agent: -1,
          color: "",
        }))
      );
    lines.slice(4).forEach((line, i) => {
      [...line].forEach((char, j) => {
        if (char === "@" || char === "T") {
          map[i][j].isWall = true;
        }
      });
    });
    this.props.adjustMap(height, width, map);
  }

  verifyMap(text) {
    try {
      const lines = text.trim().split(/\r?\n/);
      if (lines[0].split(" ")[0] !== "type") return false;
      if (lines[1].split(" ")[0] !== "height") return false;
      const height = parseInt(lines[1].split(" ")[1]);
      if (lines[2].split(" ")[0] !== "width") return false;
      const width = parseInt(lines[2].split(" ")[1]);
      if (lines[3].trim() !== "map") return false;
      if (height !== lines.length - 4) return false;
      for (let i = 4; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line.length !== width) return false;
        for (let char of line) {
          if (char !== "." && char !== "@" && char !== "T") return false;
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  render() {
    return (
      <>
        <MKBox component="section">
          <Modal
            open={this.state.isDialogOpen}
            onClose={() => {
              this.setState({ isDialogOpen: false });
            }}
            sx={{ display: "grid", placeItems: "center" }}
          >
            <Slide direction="down" in={this.state.isDialogOpen} timeout={500}>
              <MKBox
                position="relative"
                width="fit-content"
                display="flex"
                flexDirection="column"
                borderRadius="xl"
                variant="gradient"
                shadow="sm"
              >
                <MKBox p={3} textAlign="center">
                  <MKTypography variant="h4" mt={1} mb={1}>
                    Map Format Error
                  </MKTypography>
                  <MKTypography variant="body2">
                    Please ensure the map file is in the correct format by referring to this{" "}
                    <a href="/guide/map" target="_blank">
                      guide
                    </a>
                    .
                  </MKTypography>
                </MKBox>
                <Divider light sx={{ my: 0 }} />
                <MKBox display="flex" justifyContent="right" py={1} px={1.5}>
                  <MKButton onClick={() => this.setState({ isDialogOpen: false })}>
                    ok, got it
                  </MKButton>
                </MKBox>
              </MKBox>
            </Slide>
          </Modal>
        </MKBox>
        <Grid
          container
          item
          justifyContent="center"
          xs={10}
          lg={7}
          mx="auto"
          mt={3}
          textAlign="center"
        >
          <MKTypography variant="h3" mb={1}>
            Load map
          </MKTypography>
        </Grid>
        <Grid container item xs={12} lg={10} sx={{ mx: "auto" }} justifyContent="center">
          <Grid item xs={12} md={10} mb={2}>
            <MKTypography variant="body2" textAlign="center">
              This part is optional. You can load a benchmark map or upload your own map.
              Specification about map file format can be found{" "}
              <a href="/guide/map" target="_blank">
                here
              </a>
              .
            </MKTypography>
          </Grid>
          <Grid item xs={11} md={10} mb={1}>
            <MKButton
              variant="gradient"
              fullWidth
              color="warning"
              onClick={(e) => this.openDropdown(e)}
            >
              Choose a map<Icon>expand_more</Icon>
            </MKButton>
            <Menu
              anchorEl={this.state.isDropdownOpen}
              open={Boolean(this.state.isDropdownOpen)}
              onClose={() => this.setState({ isDropdownOpen: null })}
            >
              {maps.map((map, index) => (
                <MenuItem key={index} onClick={() => this.closeDropdown(map)}>
                  {map}
                </MenuItem>
              ))}
            </Menu>
          </Grid>
          <Grid item xs={1} md={2} pl={1} mb={1}>
            <input
              type="file"
              style={{ display: "none" }}
              ref={(ref) => (this.upload = ref)}
              onChange={(e) => this.uploadMap(e)}
            />
            <MKButton
              variant="gradient"
              fullWidth
              color="warning"
              onClick={(e) => {
                this.upload.click();
              }}
            >
              <Icon>upload</Icon>
            </MKButton>
          </Grid>
        </Grid>
      </>
    );
  }
}
