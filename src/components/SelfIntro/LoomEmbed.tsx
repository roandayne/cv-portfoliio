import React from 'react';
import { Box } from '@mui/material';

const LoomEmbed = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        paddingBottom: '44.99999999999999%',
        height: 0,
      }}
    >
      <iframe
        src="https://www.loom.com/embed/fcf3fde5715e4fecb2f6fd0f3678b02d?sid=67390c69-9f36-4dfc-a70c-fdd987cb56bc"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '8px',
        }}
      ></iframe>
    </Box>
  );
};

export default LoomEmbed;
