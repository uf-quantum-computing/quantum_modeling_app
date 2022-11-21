import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@mui/material";

const card_style = {
  backgroundColor: "rgba(52, 52, 52, 0)",
  border: "1px solid #FFFFFF",
  margin: "2%",
  boxShadow: "0 0 5px -1px rgba(0,0,0,0.2)",
  padding: "2%",
};
// ==========================================
// ==============  CustomTitle ==============
// ==========================================
const CustomTitle = () => {
  return (
    <div>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Card style={card_style}>
          <p style={{ textAlign: "center" }}>
            <h2
              style={{
                color: "#FFFFFF",
                fontWeight: "bolder",
                paddingTop: "3%",
                paddingBottom: "3%",
                margin: 0,
              }}
            >
              Quantum Modeling App
            </h2>
          </p>
        </Card>
      </Link>
    </div>
  );
};

export default CustomTitle;
