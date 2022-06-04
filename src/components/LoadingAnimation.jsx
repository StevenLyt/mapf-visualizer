import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import Lottie from "react-lottie";
import Planning from "assets/lotties/planning.json";

export default function LoadingAnimation() {
  return (
    <MKBox>
      <MKBox mt={"40%"} justifyContent="center" alignItems="center">
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: Planning,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          height={150}
          width={150}
          style={{ marginBottom: 80, pointerEvents: "none" }}
        />
      </MKBox>
      <MKBox
        textAlign="center"
        style={{
          marginBottom: "auto",
        }}
      >
        <MKTypography variant="h5">Planning and fetching data ...</MKTypography>
      </MKBox>
    </MKBox>
  );
}
