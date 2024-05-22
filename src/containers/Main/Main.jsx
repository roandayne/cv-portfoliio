import React, { useEffect, useRef, useState } from 'react';
import BackToTop from '../../components/BackToTop/BackToTop';
import Header from '../../components/Header/Header';
import SelfIntro from '../../components/SelfIntro/SelfIntro';
import Landing from '../Landing/Landing';
import Resume from '../Resume/Resume';

const Main = () => {
  const resumeRef = useRef(null);
  const introRef = useRef(null);
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

  const handleResumeScroll = (event) => {
    resumeRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleIntroScroll = (event) => {
    introRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Header handleScroll={handleResumeScroll} isPortrait={isPortrait}>
      <Landing handleResumeScroll={handleResumeScroll} handleIntroScroll={handleIntroScroll} isPortrait={isPortrait} />
      <Resume resumeRef={resumeRef} isPortrait={isPortrait} />
      <SelfIntro introRef={introRef} isPortrait={isPortrait} />
      <BackToTop />
    </Header>
  );
};

export default Main;
