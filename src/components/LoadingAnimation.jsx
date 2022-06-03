import MKTypography from "components/MKTypography";
import CircularProgress from "@mui/material/CircularProgress";
import MKBox from "components/MKBox";
import { Grid, Container } from "@mui/material";

export default function LoadingAnimation() {
  return (
    <MKBox>
      <MKBox mt={"40%"} mb={"10%"} textAlign="center">
        <CircularProgress />
      </MKBox>
      <MKBox
        textAlign="center"
        style={{
          marginBottom: "auto",
        }}
      >
        <MKTypography variant="h5">Fetching data from backend ...</MKTypography>
      </MKBox>
    </MKBox>
  );
}
