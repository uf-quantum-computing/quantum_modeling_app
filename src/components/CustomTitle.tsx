import React from "react";
import { Card } from "@mui/material";

const card_style: React.CSSProperties = {
  backgroundColor: "#063970",
  boxShadow: "0 0 5px -1px rgba(0,0,0,0.2)",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
  color: "#FFFFFF",
  fontWeight: "bolder",
  textAlign: "center",
  margin: 0,
  fontSize: 24,
};

interface CustomTitleProps {
  pageName: string;
}

const CustomTitle: React.FC<CustomTitleProps> = ({ pageName }) => {
  return (
    <>
      <Card style={card_style}>
        {pageName} Model Generator
      </Card>
      <p
        style={{
          color: "#000000",
          textAlign: "center",
          fontSize: 16,
          margin: 0,
          padding: 8,
        }}
      >
        Select the values for the model and click 'Generate Model' when you're
        ready!
      </p>
    </>
  );
};

export default CustomTitle;
