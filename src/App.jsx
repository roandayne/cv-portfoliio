import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import About from './pages/About';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import useMeta from './useMeta';
import useMotion from './useMotion';

/** Restores scroll position on route change, and honours a target hash. */
function useRouteScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}

const App = () => {
  useMeta();
  useRouteScroll();
  useMotion();

  return (
    <>
      <a className="u-skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
