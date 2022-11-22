import React from "react";
import { Link } from "react-router-dom";
import { Button, Stack, Card } from "@mui/material";

// styles
const stack_style = {
  marginTop: "5%",
  marginBottom: "5%",
};
const button_style = {
  minWidth: "100%",
};
const card_style = {
  backgroundColor: "rgba(52, 52, 52, 0)",
  border: "1px solid #FFFFFF",
  boxShadow: "0 0 5px -1px rgba(0,0,0,0.2)",
};

const VerticalMenu = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50%" }}>
      {/* ==============  Menu ============== */}

      <Stack spacing={2} style={stack_style}>
        <Card style={card_style}>
          <h2
            style={{
              color: "white",
              paddingTop: "3%",
              paddingBottom: "5%",
              margin: 0,
            }}
          >
            Menu
          </h2>
        </Card>
        <Link to="/tunneling" style={{ textDecoration: "none" }}>
          <Button variant="contained" style={button_style}>
            Tunneling
          </Button>
        </Link>
        <Link to="/wavefunction" style={{ textDecoration: "none" }}>
          <Button variant="contained" style={button_style}>
            Wavefunction
          </Button>
        </Link>
        <Link to="/interference" style={{ textDecoration: "none" }}>
          <Button variant="contained" style={button_style}>
            interference
          </Button>
        </Link>
      </Stack>
    </div>
  );
};

export default VerticalMenu;
