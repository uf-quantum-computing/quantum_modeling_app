import React from "react";
import { Link } from "react-router-dom";
import { Button, Stack } from "@mui/material";
// styles
const CustomMenu = () => {
  return (
    <div>
      {/* ==============  Menu ============== */}
      <Stack direction="row" spacing={2}>
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

export default CustomMenu;
