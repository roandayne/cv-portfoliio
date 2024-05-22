import { Box, Typography } from '@mui/material';
import React from 'react';
import LoomEmbed from './LoomEmbed';

const SelfIntro = ({ introRef, isPortrait }) => {
  return (
    <Box
      ref={introRef}
      sx={{
        display: 'flex',
        backgroundColor: 'common.white',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 0px',
        gap: '20px',
      }}
    >
      <Typography color="primary" variant="h3">
        Know More About Me!
      </Typography>
      <Box sx={{ width: '80vw' }}>
        <LoomEmbed />
      </Box>
    </Box>
  );
};

export default SelfIntro;
