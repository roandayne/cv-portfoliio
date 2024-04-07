import React, { useRef } from 'react'
import BackToTop from '../../components/BackToTop/BackToTop'
import Header from '../../components/Header/Header'
import Landing from '../Landing/Landing'
import Resume from '../Resume/Resume'

const Main = () => {
  const resumeRef = useRef(null);

  const handleScroll = (event) => {
    resumeRef.current.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <Header handleScroll={handleScroll}>
      <Landing handleScroll={handleScroll} />
      <Resume resumeRef={resumeRef}  />
      <BackToTop />
    </Header>
  )
}

export default Main