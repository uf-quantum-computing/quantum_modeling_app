import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

// ========== styles ==========
const cardStyle = {
  backgroundColor: "#FFFFFF",
  marginTop: "2%",
  marginBottom: "2%",
  padding: "2%",
  boxShadow: "0 0 5px -1px rgba(0,0,0,0.2)",
  borderRadius: "10px",
};

// ========== CustomDescriptionBox ==========
const CustomDescriptionBox = ({ title, msg, imageUrl }: { title?: string; msg: string; imageUrl?: string }) => {
  return (
    <Card style={cardStyle}>
      <CardContent>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box display="flex" flexDirection="column">
            {title && (
              <Typography variant="h4" component="div" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                {title}
              </Typography>
            )}
            <Typography component="div" whiteSpace="pre-line" sx={{ textAlign: "left", flex: 1, fontSize: 18 }}>
              {msg}
            </Typography>
          </Box>
          {imageUrl && (
            <Box
              component="img"
              src={imageUrl}
              alt="Description related image"
              sx={{
                maxWidth: '30%', // Adjust based on your needs
                maxHeight: '100%', // Adjust based on your needs
                marginLeft: 15, // Adds some space between the image and the text
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomDescriptionBox;