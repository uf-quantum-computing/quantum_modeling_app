import * as React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function Dashboard() {
  const card_style = {
    backgroundColor: "rgba(52, 52, 52, 0)",
    border: "1px solid #FFFFFF",
    boxShadow: "0 0 5px -1px rgba(0,0,0,0.2)",
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50%" }}>
      <Card style={card_style}>
        <Button
          id="fade-button"
          aria-controls={open ? "fade-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          style={{
            color: "white",
            fontWeight: "bolder",
            textTransform: "none",
            fontSize: 20,
            paddingTop: "3%",
            paddingBottom: "5%",
            margin: 0,
          }}
        >
          Dashboard
        </Button>
      </Card>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem component={Link} to="/">
          {" "}
          Home{" "}
        </MenuItem>
        <MenuItem component={Link} to="/tunneling">
          {" "}
          Tunneling{" "}
        </MenuItem>
        <MenuItem component={Link} to="/wavefunction">
          {" "}
          Wavefunction{" "}
        </MenuItem>
        <MenuItem component={Link} to="/interference">
          {" "}
          Interference{" "}
        </MenuItem>
      </Menu>
    </div>
  );
}
