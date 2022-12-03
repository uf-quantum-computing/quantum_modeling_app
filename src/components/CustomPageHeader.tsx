import React from "react";

import { Typography } from "@mui/material";
// styles

// ======== CustomPageHeader =========
const CustomPageHeader = (props: any) => {
  return (
    <Typography
      variant={props.size}
      gutterBottom
      style={{ marginTop: "5%", marginBottom: "5%" }}
    >
      {props.text}
    </Typography>
  );
};

export default CustomPageHeader;
