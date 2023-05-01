import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

// ========== styles ==========
const card_style = {
  backgroundColor: "#FFFFFF",
  marginTop: "2%",
  marginBottom: "2%",
  boxShadow: "0 0 5px -1px rgba(0,0,0,0.2)",
  borderRadius: "10px",
};

// ========== CustomDescriptionBox ==========
const CustomDescriptionBox = (props: any) => {
  return (
    <div>
      <Card style={card_style}>
        <CardContent>
        <Typography whiteSpace="pre-line">
          <p style={{ textAlign: "center", margin: 0 }}>{props.msg}</p>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomDescriptionBox;
