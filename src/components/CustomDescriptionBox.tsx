import React from "react";
import { Card, CardContent } from "@mui/material";

// ========== styles ==========
const card_style = {
  backgroundColor: "#F2F2F2",
  marginTop: "2%",
  marginBottom: "2%",
  boxShadow: "0 0 5px -1px rgba(0,0,0,0.2)",
};

// ========== CustomDescriptionBox ==========
const CustomDescriptionBox = (props: any) => {
  return (
    <div>
      <Card sx={{ minWidth: 400 }} style={card_style}>
        <CardContent>
          <p style={{ textAlign: "center" }}>{props.msg}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomDescriptionBox;
