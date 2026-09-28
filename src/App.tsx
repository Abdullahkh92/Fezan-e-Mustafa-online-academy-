/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CoursesSection } from './components/CoursesSection';
import { OnlineClassesSection } from './components/OnlineClassesSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { AdmissionTrialSection } from './components/AdmissionTrialSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CourseDetailModal } from './components/CourseDetailModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { CourseDetail } from './types/academy';

export default function App() {
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<CourseDetail | null>(null);
  const [preSelectedCourse, setPreSelectedCourse] = useState<string>('');
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);

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
        onOpenAdmin={() => setAdminModalOpen(true)}
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

        {/* 7. Contact Us */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setAdminModalOpen(true)}
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

      {/* Academy Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </div>
  );
}
