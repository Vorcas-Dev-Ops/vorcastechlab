import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { motion } from 'framer-motion';


import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load non-critical sections
import About from './components/About';
import Services from './components/Services';
import TechStack from './components/TechStack';
import Contact from './components/Contact';
import Projects from './components/Projects';

// Lazy load non-critical pages
const Team = React.lazy(() => import('./components/Team'));
const Testimonials = React.lazy(() => import('./components/Testimonials'));
const ProjectDetails = React.lazy(() => import('./components/ProjectDetails'));
const Career = React.lazy(() => import('./pages/Career'));
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const NotFound = React.lazy(() => import('./components/NotFound'));
// Scroll Management Component
const ScrollHandler = ({ aboutBoxRef, aboutSectionRef, aboutBgTextRef, teamGridRef, teamBgTextRef }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let lenisRafId = null;
    const raf = (time) => {
      lenis.raf(time);
      lenisRafId = requestAnimationFrame(raf);
    };
    lenisRafId = requestAnimationFrame(raf);

    // 2. Scroll-Linked Animations Loop
    const handleScroll = () => {
      // Rotating 3D Box (Only if refs exist on current page)
      if (aboutBoxRef?.current && aboutSectionRef?.current) {
        const rect = aboutSectionRef.current.getBoundingClientRect();
        const sectionHeight = aboutSectionRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollOffset = Math.max(0, -rect.top);
        const scrollRange = sectionHeight - windowHeight;

        // Use a small buffer (first 13% of scroll) where Face 01 stays perfectly flat
        let progress = 0;
        const buffer = 0.22;

        const rawProgress = Math.min(1, scrollOffset / scrollRange);
        if (rawProgress > buffer) {
          progress = (rawProgress - buffer) / (1 - buffer);
        }

        // Map progress (0 to 1) to 270 degrees of rotation (3 flips)
        const rotation = progress * 270;
        aboutBoxRef.current.style.transform = `rotateX(${rotation}deg)`;

        // Background Text Parallax & Opacity
        if (aboutBgTextRef?.current) {
          const bgTextProgress = Math.min(1, scrollOffset / scrollRange);
          const scale = 1 + bgTextProgress * 0.2;
          const opacity = 1 - bgTextProgress * 0.8; // Fades out as you go deep
          const blur = bgTextProgress * 10;
          aboutBgTextRef.current.style.transform = `scale(${scale})`;
          aboutBgTextRef.current.style.opacity = `${opacity}`;
          aboutBgTextRef.current.style.filter = `blur(${blur}px)`;
        }
      }
    };

    // Set initial state
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    // 3. Global Entrance Reveal Animations
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const refreshReveals = () => {
      document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-left, .reveal-right, .reveal-opacity')
        .forEach(el => revealObserver.observe(el));
    };

    // Initial call
    refreshReveals();

    // 4. Team Section Dimmer
    let teamObserver;
    if (teamGridRef?.current && teamBgTextRef?.current) {
      teamObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              teamBgTextRef.current.classList.add('opacity-10');
            } else if (entry.boundingClientRect.top > 0) {
              teamBgTextRef.current.classList.remove('opacity-10');
            }
          });
        },
        { rootMargin: '-20% 0px 0px 0px' }
      );
      teamObserver.observe(teamGridRef.current);
    }

    // Scroll to top on navigation Change
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealObserver.disconnect();
      if (teamObserver) teamObserver.disconnect();
      if (lenisRafId) {
        cancelAnimationFrame(lenisRafId);
      }
      lenis.destroy();
    };
  }, [pathname]); // Re-run on route change

  return null;
};

import { HelmetProvider } from 'react-helmet-async';
import SEO from './components/SEO';

const AppContent = () => {

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Refs for scroll-linked animations
  const aboutBoxRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const aboutBgTextRef = useRef(null);
  const teamGridRef = useRef(null);
  const teamBgTextRef = useRef(null);

  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    const checkScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  return (
    <div className="text-text-primary min-h-screen selection:bg-orange-500 selection:text-white relative">
      <SEO />
      <ScrollHandler
        aboutBoxRef={aboutBoxRef}
        aboutSectionRef={aboutSectionRef}
        aboutBgTextRef={aboutBgTextRef}
        teamGridRef={teamGridRef}
        teamBgTextRef={teamBgTextRef}
      />

      {!isAdminPage && (
        <Navbar
          isScrolled={isScrolled}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}

      <main className="relative z-20 bg-black mb-0 md:mb-[50vh]" style={{ overflowX: 'clip' }}>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Services />
              <About aboutBoxRef={aboutBoxRef} aboutSectionRef={aboutSectionRef} aboutBgTextRef={aboutBgTextRef} />
              <Projects />
              <TechStack />
              <Contact />
            </>
          } />
          <Route path="/about" element={<About aboutBoxRef={aboutBoxRef} aboutSectionRef={aboutSectionRef} aboutBgTextRef={aboutBgTextRef} />} />
          <Route path="/services" element={<Services />} />
          <Route path="/techstack" element={<TechStack />} />
          <Route path="/team" element={<React.Suspense fallback={<div className="h-screen" />}><Team teamGridRef={teamGridRef} teamBgTextRef={teamBgTextRef} /></React.Suspense>} />
          <Route path="/thoughts" element={<React.Suspense fallback={<div className="h-screen" />}><Testimonials /></React.Suspense>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<React.Suspense fallback={<div className="h-screen" />}><ProjectDetails /></React.Suspense>} />
          <Route path="/career" element={<React.Suspense fallback={<div className="h-screen" />}><Career /></React.Suspense>} />
          <Route path="/admin/login" element={<React.Suspense fallback={<div className="h-screen" />}><AdminLogin /></React.Suspense>} />
          <Route path="/admin/dashboard" element={<React.Suspense fallback={<div className="h-screen" />}><AdminDashboard /></React.Suspense>} />
          <Route path="*" element={<React.Suspense fallback={<div className="h-screen" />}><NotFound /></React.Suspense>} />
        </Routes>
      </main>

      {!isAdminPage && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}

export default App;

