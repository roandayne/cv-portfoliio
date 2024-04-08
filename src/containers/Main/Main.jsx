import React, { useEffect, useRef, useState } from 'react';
import BackToTop from '../../components/BackToTop/BackToTop';
import Header from '../../components/Header/Header';
import Landing from '../Landing/Landing';
import Resume from '../Resume/Resume';

const Main = () => {
  const resumeRef = useRef(null);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleScroll = (event) => {
    resumeRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Header handleScroll={handleScroll} isPortrait={isPortrait}>
      <Landing handleScroll={handleScroll} isPortrait={isPortrait} />
      <Resume resumeRef={resumeRef} isPortrait={isPortrait} />
      <BackToTop />
    </Header>
  );
};

export default Main;
