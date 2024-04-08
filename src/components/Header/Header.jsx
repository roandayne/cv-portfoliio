import { useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { handleDownload } from '../../containers/Resume/Resume';

const drawerWidth = 240;
const navItems = ['Resume', 'Contact'];

const Header = ({ children, window, handleScroll }) => {
  const isXs = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleNavItemClick = (item) => {
    if (item === 'Resume') {
      handleDownload();
    } else {
      handleScroll();
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100vw' }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          backgroundColor: 'secondary.main',
          padding: { sm: '24px 100px', lg: '24px 150px' },
        }}
      >
        <Toolbar
          sx={{
            '&.MuiToolbar-root': {
              padding: '0',
            },
            alignItems: 'center',
          }}
        >
          {isXs ? (
            <Button fullWidth color="primary" onClick={handleDownload} sx={{ display: 'flex' }}>
              Download Resume
            </Button>
          ) : (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                padding: '0',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="h2"
                color="primary"
                sx={{
                  textAlign: 'left',
                  flexGrow: 1,
                  display: { xs: 'none', sm: 'block' },
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                Roan
              </Typography>
              <Box
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  gap: { xs: '20px', sm: '30px' },
                }}
              >
                {navItems.map((item) => (
                  <Button
                    color="primary"
                    key={item}
                    onClick={() => handleNavItemClick(item)}
                    sx={
                      item === 'Contact'
                        ? {
                            border: (theme) => `4px solid ${theme.palette.primary.main}`,
                            padding: '10px 20px',
                            animation: 'pulse 1s infinite',
                            '@keyframes pulse': {
                              '0%': {
                                transform: 'scale(1)',
                              },
                              '50%': {
                                transform: 'scale(1.1)',
                              },
                              '100%': {
                                transform: 'scale(1)',
                              },
                            },
                          }
                        : {}
                    }
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Box component="main">{children}</Box>
    </Box>
  );
};

export default Header;
