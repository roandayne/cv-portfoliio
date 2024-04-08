import { Avatar, Box } from '@mui/material';
import React from 'react';
import laravelImage from '/images/laravel.995x1024.png';
import goImage from '/images/pngwing.com.png';
import reactImage from '/images/reactjs.png';
import railsImage from '/images/ror.png';
import vueImage from '/images/vuejs.png';

const Technologies = ({ isPortrait }) => {
  return (
    <Box sx={{ display: 'flex', gap: '10px', width: '100%' }}>
      <Avatar
        src={reactImage}
        sx={{
          width: { xs: isPortrait ? 50 : 80, sm: 80 },
          height: { xs: isPortrait ? 50 : 80, sm: 80 },
          borderRadius: '50%',
          backgroundColor: 'background.paper',
          padding: '10px',
        }}
      />
      <Avatar
        src={laravelImage}
        sx={{
          width: { xs: isPortrait ? 50 : 80, sm: 80 },
          height: { xs: isPortrait ? 50 : 80, sm: 80 },
          borderRadius: '50%',
          backgroundColor: 'background.paper',
          padding: '10px',
        }}
      />
      <Avatar
        src={railsImage}
        sx={{
          width: { xs: isPortrait ? 50 : 80, sm: 80 },
          height: { xs: isPortrait ? 50 : 80, sm: 80 },
          borderRadius: '50%',
          backgroundColor: 'background.paper',
          padding: '10px',
        }}
      />
      <Avatar
        src={vueImage}
        sx={{
          width: { xs: isPortrait ? 50 : 80, sm: 80 },
          height: { xs: isPortrait ? 50 : 80, sm: 80 },
          borderRadius: '50%',
          backgroundColor: 'background.paper',
          padding: '10px',
        }}
      />
      <Avatar
        src={goImage}
        sx={{
          width: { xs: isPortrait ? 50 : 80, sm: 80 },
          height: { xs: isPortrait ? 50 : 80, sm: 80 },
          borderRadius: '50%',
          backgroundColor: 'background.paper',
          padding: '10px',
          '& > img': {
            objectFit: 'contain',
          },
        }}
      />
    </Box>
  );
};

export default Technologies;
