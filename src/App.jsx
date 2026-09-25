import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import FocusAreas from './components/FocusAreas';
import Programs from './components/Programs';
import Structure from './components/Structure';
import GetInvolved from './components/GetInvolved';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Healthcare from './pages/Healthcare';
import Inquiry from './pages/Inquiry';
import Donate from './pages/Donate';
import FloatingContact from './components/FloatingContact';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <FocusAreas />
      <Programs />
      <Structure />
      <Testimonials />
      <GetInvolved />
      <Contact />
    </>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/healthcare" element={<Healthcare />} />
            <Route path="/inquiry" element={<Inquiry />} />
            <Route path="/donate" element={<Donate />} />
          </Routes>
        </main>
        <Footer />
        <FloatingContact />
      </div>
    </Router>
  );
}

export default App;
