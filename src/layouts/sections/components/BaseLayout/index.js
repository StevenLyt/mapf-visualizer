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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import CenteredFooter from "examples/Footers/CenteredFooter";

// Routes
import routes from "routes";

function BaseLayout({ breadcrumb, title, children }) {
  return (
    <MKBox display="flex" flexDirection="column" minHeight="100vh">
      <MKBox shadow="sm" py={0.25}>
        <DefaultNavbar routes={routes} transparent relative />
      </MKBox>
      {/* 
      <Container sx={{ mt: 6 }}>
        <MKBox width={{ xs: "100%", md: "50%", lg: "25%" }} mb={3}>
          <Breadcrumbs routes={breadcrumb} />
        </MKBox>
        <Grid
          container
          item
          xs={"auto"}
          flexDirection="column"
          justifyContent="center"
          mx="auto"
        ></Grid>
      </Container> */}
      {/* <MKTypography variant="h3" mb={1}></MKTypography> */}
      {children}
      <MKBox mt="auto">
        <CenteredFooter />
      </MKBox>
    </MKBox>
  );
}

// Typechecking props for the BaseLayout
BaseLayout.propTypes = {
  breadcrumb: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default BaseLayout;
