import { Box, Icon, Typography } from "@mui/material";
import React from "react";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import Detail from "./Detail";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const ContactInfo = ({ title }) => {
  return (
    <Box
      sx={{
        padding: "0 20px",
        width: "100%",
      }}
    >
      <Typography
        variant="h4"
        color="common.white"
        sx={{ paddingBottom: "40px" }}
      >
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Detail icon={PhoneIphoneIcon} text="+63 917 148 9734" />
        <Detail icon={EmailIcon} text="roandaynedenaerys@gmail.com" />
        <Detail
          icon={LinkedInIcon}
          text="www.linkedin.com/in/roan-dayne-dino-471888bb"
        />
        <Detail icon={LocationOnIcon} text="Tagaytay City, Philippines" />
      </Box>
    </Box>
  );
};

export default ContactInfo;
