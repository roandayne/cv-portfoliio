import { Box, Icon, Typography } from "@mui/material";
import React from "react";

const Detail = ({
  icon,
  text,
  description,
  description2,
  children,
  color = "common.white",
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", color: color }}>
      <Box display="flex" alignItems="center" color={color}>
        <Icon component={icon} sx={{ marginRight: "8px" }} />
        <Box>
          <Typography
            color={color}
            variant={children ? "h6" : "body1"}
            display="flex"
            alignItems="center"
          >
            {text}
          </Typography>
          {description && (
            <Typography variant="body1" color={color}>
              {description}
            </Typography>
          )}
          {description2 && (
            <Typography variant="body1" color={color}>
              {description2}
            </Typography>
          )}
        </Box>
      </Box>
      {children}
    </Box>
  );
};

export default Detail;
