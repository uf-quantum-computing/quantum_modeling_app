import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

// ========== styles ==========
const cardStyle = {
  backgroundColor: "#FFFFFF",
  marginTop: "2%",
  marginBottom: "2%",
  boxShadow: "0 0 5px -1px rgba(0,0,0,0.2)",
  borderRadius: "10px",
};

// ========== CustomDescriptionBox ==========
const CustomDescriptionBox = ({ msg, imageUrl }: { msg: string; imageUrl?: string }) => {
  return (
    <Card style={cardStyle}>
      <CardContent>
        <Box display="flex" flexDirection="row" alignItems="center">
          {imageUrl && (
            <Box
              component="img"
              src={imageUrl}
              alt="Description related image"
              sx={{
                maxWidth: '50%', // Adjust based on your needs
                maxHeight: 300, // Adjust based on your needs
                marginRight: 2, // Adds some space between the image and the text
              }}
            />
          )}
          <Typography component="div" whiteSpace="pre-line" sx={{ textAlign: "center", flex: 1 }}>
            {msg}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomDescriptionBox;
