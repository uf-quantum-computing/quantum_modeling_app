import React from "react";
import { Link } from "react-router-dom";
import { Button, Stack } from "@mui/material";

// styles
const stack_style = {
  marginTop: "5%",
  marginBottom: "5%",
};
const button_style = {
  minWidth: "100%",
};

const VerticalMenu = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "5%", margin: "5%" }}>
      {/* ==============  Menu ============== */}
      <h2 style={{ color: "white" }}>Menu</h2>
      <Stack spacing={2} style={stack_style}>
        <Link to="/tunneling" style={{ textDecoration: "none" }}>
          <Button variant="outlined" style={button_style}>
            Tunneling
          </Button>
        </Link>
        <Link to="/wavefunction" style={{ textDecoration: "none" }}>
          <Button variant="outlined" style={button_style}>
            Wavefunction
          </Button>
        </Link>
        <Link to="/interference" style={{ textDecoration: "none" }}>
          <Button variant="outlined" style={button_style}>
            interference
          </Button>
        </Link>
      </Stack>
    </div>
  );
};

export default VerticalMenu;
