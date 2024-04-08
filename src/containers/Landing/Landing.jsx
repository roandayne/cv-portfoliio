import { Box, Button, Typography, useTheme } from '@mui/material';
import Technologies from '../../components/Technologies/Technologies';
import resumeImage from '/images/resume.png';

const Landing = ({ handleScroll, isPortrait }) => {
  const theme = useTheme();

  return (
    <Box
      id="landing"
      sx={{
        marginTop: { sm: '100px', md: '126px' },
        overflow: 'hidden',
        width: '100vw',
        backgroundColor: 'secondary.main',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
          paddingLeft: { sm: '100px', lg: '150px' },
          padding: { xs: isPortrait ? '30px' : 0 },
          backgroundImage: { sm: `url(${resumeImage})` },
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'bottom right -100px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '80px',
            width: { xs: '100%', sm: '50vw', lg: '40vw' },
            gap: '30px',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <Typography
              color="primary"
              variant="h1"
              sx={{
                textAlign: 'left',
                fontSize: { md: '90px' },
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              Hi! I am
            </Typography>
            <Typography
              color="primary"
              variant="h1"
              sx={{
                textAlign: 'left',
                fontSize: { md: '90px' },
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              Roan Dino.
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
            }}
          >
            <Typography variant="body1" sx={{ fontSize: '24px' }}>
              Harnessing 4+ years in IT as a fullstack developer, QA, project manager.
            </Typography>
            <Technologies isPortrait={isPortrait} />
            <Box
              sx={{
                display: 'flex',
                gap: '20px',
                paddingBottom: '50px',
              }}
            >
              <Button
                color="secondary"
                sx={{ backgroundColor: 'primary.main', padding: '20px 40px' }}
                onClick={handleScroll}
              >
                Hire Me
              </Button>
              <Button color="primary" onClick={handleScroll}>
                Know more
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Landing;
