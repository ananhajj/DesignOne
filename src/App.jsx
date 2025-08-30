import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
 
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Cases from './pages/Cases';
import Media from './pages/Media';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import AdminLoginButton from './auth/AdminLoginButton';

import Header from './components/Header';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Disclaimer from './pages/Disclaimer';
import Ethics from './pages/Ethics';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';

function App() {


  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen text-[#0F172A] font-sans">
        <Header />
     

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/media" element={<Media />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/ethics" element={<Ethics />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
        </main>

        <Footer />
        <AdminLoginButton />
      </div>
    </Router>
  );
}

export default App;