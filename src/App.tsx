/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CoursesSection } from './components/CoursesSection';
import { OnlineClassesSection } from './components/OnlineClassesSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { AdmissionTrialSection } from './components/AdmissionTrialSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CourseDetailModal } from './components/CourseDetailModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { CourseDetail } from './types/academy';
import { trackPageView } from './utils/visitorTracker';

export default function App() {
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<CourseDetail | null>(null);
  const [preSelectedCourse, setPreSelectedCourse] = useState<string>('');
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);

  // Initialize privacy-friendly visitor analytics & handle /admin routing
  useEffect(() => {
    // Record page visit
    trackPageView();

    const handleRouteChange = () => {
      trackPageView();
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path === '/login' || hash === '#admin' || hash === '#login') {
        setAdminModalOpen(true);
      }
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const handleOpenAdmin = () => {
    setAdminModalOpen(true);
    if (window.location.pathname !== '/admin') {
      window.history.pushState(null, '', '/admin');
    }
  };

  const handleCloseAdmin = () => {
    setAdminModalOpen(false);
    if (window.location.pathname === '/admin' || window.location.pathname === '/login') {
      window.history.pushState(null, '', '/');
    }
  };

  const handleStartLearning = () => {
    const el = document.getElementById('admission');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEnrollCourse = (courseTitle: string) => {
    setPreSelectedCourse(courseTitle);
    const el = document.getElementById('admission');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#03151E] text-slate-100 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#FFF8E7]">
      {/* 3-Zone Top Bar Navigation */}
      <Navbar
        onOpenTrial={handleStartLearning}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          onStartLearning={handleStartLearning}
          onContactClick={handleContactClick}
        />

        {/* 2. About Academy */}
        <AboutSection />

        {/* 3. Courses */}
        <CoursesSection
          onSelectCourse={(course) => setSelectedCourseForModal(course)}
          onEnrollCourse={handleEnrollCourse}
        />

        {/* 4. Online Classes */}
        <OnlineClassesSection />

        {/* 5. Why Choose Us */}
        <WhyChooseUsSection />

        {/* 6. Admission / Free Trial */}
        <AdmissionTrialSection
          preSelectedCourse={preSelectedCourse}
        />

        {/* 7. Frequently Asked Questions (SEO & Organic User Guidance) */}
        <FAQSection />

        {/* 8. Contact Us */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={handleOpenAdmin}
        onOpenTrial={handleStartLearning}
      />

      {/* Floating WhatsApp Quick Button */}
      <FloatingWhatsApp />

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={selectedCourseForModal}
        onClose={() => setSelectedCourseForModal(null)}
        onEnroll={(title) => handleEnrollCourse(title)}
      />

      {/* Academy Admin Dashboard Modal / Secure Login Screen */}
      <AdminDashboardModal
        isOpen={adminModalOpen}
        onClose={handleCloseAdmin}
      />
    </div>
  );
}
