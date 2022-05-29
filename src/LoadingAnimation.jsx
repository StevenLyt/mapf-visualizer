import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingAnimation() {
  return (
    <div>
      <div
        style={{
          display: "table",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "40%",
          marginBottom: "auto",
        }}
      >
        <CircularProgress />
      </div>
      <div
        style={{
          display: "table",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "5%",
          marginBottom: "auto",
        }}
      >
        <Typography>Fetching data from backend ...</Typography>
      </div>
    </div>
  );
}
