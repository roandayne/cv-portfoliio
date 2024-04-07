import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import FlagIcon from "@mui/icons-material/Flag";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SchoolIcon from "@mui/icons-material/School";
import CircleIcon from "@mui/icons-material/Circle";
import DownloadIcon from "@mui/icons-material/Download";

import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import Detail from "../../components/Resume/Detail";
import ResumeDetail from "../../components/Resume/ResumeDetail";
import { EXPERIENCES } from "../../data/WorkExperience";

const Resume = () => {
  const handleDownload = () => {
    const pdfFilePath = "/resume-dino.pdf";
    const anchorElement = document.createElement("a");
    anchorElement.href = pdfFilePath;
    anchorElement.download = "resume-dino.pdf";
    anchorElement.click();
  };

  return (
    <Box
      sx={{
        paddingLeft: { sm: "100px", lg: "150px" },
        width: "100vw",
        display: "flex",
      }}
    >
      <Box
        sx={{
          width: "40vw",
          backgroundColor: "primary.main",
          padding: "80px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "80px",
        }}
      >
        <ResumeDetail title="Contact">
          <Detail icon={PhoneIphoneIcon} text="+63 917 148 9734" />
          <Detail icon={EmailIcon} text="roandaynedenaerys@gmail.com" />
          <Detail
            icon={LinkedInIcon}
            text="www.linkedin.com/in/roan-dayne-dino-471888bb"
          />
          <Detail icon={LocationOnIcon} text="Tagaytay City, Philippines" />
        </ResumeDetail>
        <ResumeDetail title="Education">
          <Detail
            icon={SchoolIcon}
            text="University of the Philippines Los Banos"
            description="BS Industrial Engineering | 2010-2017"
          />
          <Detail
            icon={SchoolIcon}
            text="Zuitt Coding Bootcamp"
            description="Laravel/PHP | 2019"
          />
        </ResumeDetail>
        <ResumeDetail title="Language">
          <Detail icon={FlagIcon} text="Tagalog" />
          <Detail icon={FlagIcon} text="English" />
        </ResumeDetail>
        <ResumeDetail title="Skills">
          <Detail icon={CircleIcon} text="Ruby on Rails" />
          <Detail icon={CircleIcon} text="Laravel" />
          <Detail icon={CircleIcon} text="Go" />
          <Detail icon={CircleIcon} text="React JS" />
          <Detail icon={CircleIcon} text="React Native" />
          <Detail icon={CircleIcon} text="Vue JS" />
          <Detail icon={CircleIcon} text="Typescript" />
        </ResumeDetail>
        <Button
          variant="contained"
          color="secondary"
          sx={{ paddingTop: "20px", paddingBottom: "20px" }}
          onClick={handleDownload}
        >
          <DownloadIcon />
          Download Resume
        </Button>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            width: "100%",
            backgroundColor: "secondary.main",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "100px",
            marginBottom: "50px",
          }}
        >
          <Box>
            <Typography variant="h3" color="primary">
              Fullstack Developer
            </Typography>
            <Typography variant="h3" color="primary">
              Project Manager
            </Typography>
            <Typography variant="h3" color="primary">
              QA
            </Typography>
          </Box>

          <Typography variant="body2" color="primary">
            Four years in IT with experience in Golang, Laravel/PHP, VueJS,
            ReactJS, React Native, Typescript, and Ruby on Rails. Skilled in
            development, QA, and project management, with a focus on Agile
            methodologies.
          </Typography>
        </Box>
        <Box sx={{ paddingBottom: "50px" }}>
          <ResumeDetail color="primary.main" title="Work Experience">
            {EXPERIENCES.map((experience, index) => {
              return (
                <Detail
                  key={index}
                  color="primary.main"
                  icon={BusinessIcon}
                  text={experience.jobTitle}
                  description={experience.company}
                  description2={experience.year}
                >
                  <List>
                    {experience.descriptions.map((description, ind) => {
                      return (
                        <ListItem key={ind}>
                          <ListItemIcon
                            sx={{
                              justifyContent: "flex-end",
                              paddingRight: "10px",
                              color: "primary.main",
                            }}
                          >
                            <CircleIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>{description.text}</ListItemText>
                        </ListItem>
                      );
                    })}
                  </List>
                </Detail>
              );
            })}
          </ResumeDetail>
        </Box>
      </Box>
    </Box>
  );
};

export default Resume;
