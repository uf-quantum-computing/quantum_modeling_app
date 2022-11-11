import React from "react";
import { Link } from "react-router-dom";
import { Button, Stack } from "@mui/material";
// styles
const stack_style = {
  marginTop: "5%",
  marginBottom: "5%",
};
const custom_divider = (
  <div style={{ textAlign: "center" }}>
    <hr
      style={{
        color: "#444444",
        height: "0.1px",
        width: "100%",
      }}
    />
  </div>
);

const VerticalMenu = () => {
  return (
    <div>
      {/* ==============  Menu ============== */}

      {custom_divider}

      <h3 style={{ color: "white" }}>Menu</h3>

      <Stack spacing={2} style={stack_style}>
        {/* <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Home</Button>
        </Link>
        <Link to="/home2" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Home2</Button>
        </Link> */}
        <Link to="/tunneling" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Tunneling</Button>
        </Link>
        {/* <Link to="/interference" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Interference</Button>
        </Link> */}
        {/* <Link to="/spin" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Spin</Button>
        </Link> */}
        <Link to="/wavefunction" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Wave Function</Button>
        </Link>
        {/* <Link to="/potential-barriers" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Potential Barriers/Wells</Button>
        </Link> */}
      </Stack>
    </div>
  );
};

export default VerticalMenu;
