import React, { useState, useEffect } from 'react';
import { Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.pageYOffset > 300) { // Adjust this value to control when the button appears
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, display: isVisible ? 'block' : 'none' }}>
      <Fab color="primary" size="medium" aria-label="scroll back to top" onClick={scrollToTop}>
        <KeyboardArrowUpIcon sx={{color: "common.white"}} />
      </Fab>
    </div>
  );
};

export default BackToTop;
