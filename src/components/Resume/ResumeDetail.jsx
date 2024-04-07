import { Box, Typography } from "@mui/material";
import React from "react";

const ResumeDetail = ({ title, children, color = "common.white" }) => {
  return (
    <Box
      sx={{
        padding: "0 20px",
        width: "100%",
      }}
    >
      <Typography variant="h4" color={color} sx={{ paddingBottom: "40px" }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {children}
      </Box>
    </Box>
  );
};

export default ResumeDetail;
