import { Box, Button, Typography } from "@mui/material";
import React from "react";
import Technologies from "../../components/Technologies/Technologies";
import resumeImage from "/images/resume.png";

const circle = {
  position: "absolute",
  width: 200,
  height: 200,
  borderRadius: "50%",
  mixBlendMode: "multiply",
  filter: "blur(80px)",
  zIndex: 1,
};

const circle1 = {
  position: "relative",
  bottom: -150,
  left: 40,
  background: "radial-gradient(circle, #FF5733, #FFC300)",
};

const circle2 = {
  bottom: 100,
  right: 30,
  background: "radial-gradient(circle, #900C3F, #FF5733)",
};

const Landing = () => {
  return (
    <Box
      sx={{
        backgroundColor: "secondary.main",
        width: "100vw",
        height: "calc(100vh - 88px)",
        padding: "0",
        gap: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        color="primary"
        variant="h1"
        sx={{ paddingTop: "100px", textAlign: "center", fontSize: "150px" }}
      >
        Hi! I'm Roan Dino.
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "80px",

          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            width: "50vw",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "80px",
            padding: "100px 100px 50px 150px",
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, fontSize: "24px" }}
          >
            Harnessing 4+ years in IT as a fullstack developer, QA, project
            manager.
          </Typography>
          <Technologies />
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Button
              color="secondary"
              sx={{ backgroundColor: "primary.main", padding: "20px 60px" }}
            >
              Hire Me
            </Button>
            <Button color="primary">Know more</Button>
          </Box>
        </Box>
        <Box sx={{ width: "50vw", height: "100%" }}>
          <Box
            sx={{
              ...circle,
              ...circle1,
            }}
          />
          <Box
            sx={{
              ...circle,
              ...circle2,
            }}
          />
          <img
            src={resumeImage}
            style={{
              height: "624px",
              position: "absolute",
              bottom: 0,
              zIndex: 10,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Landing;
