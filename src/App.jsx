import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import FocusAreas from './components/FocusAreas';
import Programs from './components/Programs';
import UpcomingEvents from './components/UpcomingEvents';
import Structure from './components/Structure';
import GetInvolved from './components/GetInvolved';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Healthcare from './pages/Healthcare';
import Inquiry from './pages/Inquiry';
import Donate from './pages/Donate';
import FloatingContact from './components/FloatingContact';

// Admin System Imports
import { AuthProvider } from './admin/context/AuthContext';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import Volunteers from './admin/pages/Volunteers';
import Enquiries from './admin/pages/Enquiries';
import Members from './admin/pages/Members';
import ProgramsAdmin from './admin/pages/Programs';
import EventsAdmin from './admin/pages/Events';
import Donations from './admin/pages/Donations';
import Expenses from './admin/pages/Expenses';
import WebContent from './admin/pages/WebContent';
import Gallery from './admin/pages/Gallery';
import Team from './admin/pages/Team';
import Reports from './admin/pages/Reports';
import AdminUsers from './admin/pages/AdminUsers';
import ActivityLogs from './admin/pages/ActivityLogs';

import './App.css';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <FocusAreas />
      <Programs />
      <UpcomingEvents />
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
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Management System (Protected Layout with Nested Subroutes) */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="volunteers" element={<Volunteers />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="members" element={<Members />} />
            <Route path="programs" element={<ProgramsAdmin />} />
            <Route path="events" element={<EventsAdmin />} />
            
            {/* Restricted Financial & System Management Routes */}
            <Route path="donations" element={
              <ProtectedRoute allowedRoles={['Super Admin', 'Admin']}>
                <Donations />
              </ProtectedRoute>
            } />
            <Route path="expenses" element={
              <ProtectedRoute allowedRoles={['Super Admin', 'Admin']}>
                <Expenses />
              </ProtectedRoute>
            } />
            <Route path="content" element={
              <ProtectedRoute allowedRoles={['Super Admin', 'Admin']}>
                <WebContent />
              </ProtectedRoute>
            } />
            <Route path="gallery" element={<Gallery />} />
            <Route path="team" element={<Team />} />
            <Route path="reports" element={
              <ProtectedRoute allowedRoles={['Super Admin', 'Admin']}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute allowedRoles={['Super Admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="activity-logs" element={
              <ProtectedRoute allowedRoles={['Super Admin', 'Admin']}>
                <ActivityLogs />
              </ProtectedRoute>
            } />
          </Route>

          {/* Public Site Routes */}
          <Route path="/*" element={
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
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
