import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab } from '@mui/material';
import React, { useEffect, useState } from 'react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
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
        <KeyboardArrowUpIcon sx={{ color: 'common.white' }} />
      </Fab>
    </div>
  );
};

export default BackToTop;
