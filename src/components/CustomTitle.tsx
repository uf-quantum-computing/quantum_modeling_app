import React from "react";
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
      <Card style={card_style}>
        <p style={{ textAlign: "center" }}>
          {" "}
          <h2
            style={{
              color: "#FFFFFF",
              textAlign: "center",
              fontWeight: "bolder",
            }}
          >
            Quantum Modeling App
          </h2>
        </p>
      </Card>
    </div>
  );
};

export default CustomTitle;
