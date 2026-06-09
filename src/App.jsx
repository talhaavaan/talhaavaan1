import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Cursor from './components/Cursor';
import Hero from './components/Hero';
import Trust from './components/Trust';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Showreel from './components/Showreel';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Software from './components/Software';
import Why from './components/Why';
import Contact from './components/Contact';
import Footer from './components/Footer';

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  useScrollReveal();

  return (
    <>
      <LoadingScreen onDone={() => setLoaded(true)} />
      {loaded && <Cursor />}
      <Hero />
      <Trust />
      <About />
      <Services />
      <Portfolio />
      <Showreel />
      <Process />
      <Testimonials />
      <Software />
      <Why />
      <Contact />
      <Footer />
    </>
  );
}
