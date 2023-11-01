import React from 'react';
import { Typography } from "@mui/material";

const CustomPageHeader = (props: any) => {
  return (
    <Typography
      variant={props.size}
      gutterBottom
      style={{
        marginBottom: '1rem',
        fontWeight: 'bold',
        color: '#000000', // Adjust the color to your preference
        textTransform: 'uppercase'
      }}
    >
      {props.text}
    </Typography>
  );
};

export default CustomPageHeader;
