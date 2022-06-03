// @mui icons

import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LinkIcon from "@mui/icons-material/Link";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
// Material Kit 2 React components
import MKTypography from "components/MKTypography";

const date = new Date().getFullYear();

export default {
  brand: {
    name: "MAPF Visualizer",
    route: "/",
  },
  socials: [
    {
      icon: <GitHubIcon />,
      link: "https://github.com/stevenlyt",
    },
    {
      icon: <LinkIcon />,
      link: "https://yutongli.me",
    },
    {
      icon: <LinkedInIcon />,
      link: "https://linkedin.com/in/lyt1106",
    },
  ],
  menus: [
    {
      name: "Author",
      items: [
        { name: "about me", href: "https://yutongli.me" },
        { name: "contact", href: "mailto:yli81711@usc.edu" },
      ],
    },
    {
      name: "resources",
      items: [
        { name: "MAPF information", href: "http://mapf.info" },
        { name: "Benchmarks", href: "https://movingai.com/benchmarks/mapf/index.html" },
      ],
    },
    {
      name: "Powered by",
      items: [
        { name: "Material Kit 2", href: "https://yutongli.me" },
        { name: "MUI", href: "mailto:yli81711@usc.edu" },
      ],
    },
  ],
  copyright: (
    <MKTypography variant="button" fontWeight="regular">
      All rights reserved. Copyright &copy; {date} by{" "}
      <MKTypography
        component="a"
        href="https://yutongli.me"
        target="_blank"
        rel="noreferrer"
        variant="button"
        fontWeight="regular"
      >
        Yutong Li
      </MKTypography>
      {" with "} <FavoriteRoundedIcon />.
    </MKTypography>
  ),
};
