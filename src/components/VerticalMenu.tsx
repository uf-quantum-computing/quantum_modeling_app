import React from "react";
import { Link } from "react-router-dom";
import { Button, Stack } from "@mui/material";
// styles
const stack_style = {
  marginTop: "5%",
  marginBottom: "5%",
};

const VerticalMenu = () => {
  return (
    <div>
      {/* ==============  Menu ============== */}
      <h3 style={{ color: "white" }}>Menu</h3>
      <Stack spacing={2} style={stack_style}>
        <Link to="/tunneling" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Tunneling</Button>
        </Link>
        <Link to="/wavefunction" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Wave Function</Button>
        </Link>
      </Stack>
    </div>
  );
};

export default VerticalMenu;
