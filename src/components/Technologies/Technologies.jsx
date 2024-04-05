import { Avatar, Box } from "@mui/material";
import React from "react";
import reactImage from "/images/reactjs.png";
import laravelImage from "/images/laravel.995x1024.png";
import railsImage from "/images/ror.png";
import vueImage from "/images/vuejs.png";
import goImage from "/images/pngwing.com.png";

const Technologies = () => {
  return (
    <Box sx={{ display: "flex", gap: "10px", width: "100%" }}>
      <Avatar
        src={reactImage}
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "background.paper",
          padding: "10px",
        }}
      />
      <Avatar
        src={laravelImage}
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "background.paper",
          padding: "10px",
        }}
      />
      <Avatar
        src={railsImage}
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "background.paper",
          padding: "10px",
        }}
      />
      <Avatar
        src={vueImage}
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "background.paper",
          padding: "10px",
        }}
      />
      <Avatar
        src={goImage}
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "background.paper",
          padding: "10px",
          "& > img": {
            objectFit: "contain",
          },
        }}
      />
    </Box>
  );
};

export default Technologies;
