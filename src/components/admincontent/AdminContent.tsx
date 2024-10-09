"use client";

import { useState } from 'react';
import { FaHome, FaTasks, FaInfoCircle, FaPhone, FaUserShield, FaPen, FaImage, FaProjectDiagram, FaBriefcase } from 'react-icons/fa';
import HomeSection from './contentsection/HomeSection';
import ExperiencesSection from './contentsection/ExperiencesSection';
import AboutSection from './contentsection/AboutSection';
import ContactSection from './contentsection/ContactSection';
import AdminsSection from './contentsection/AdminsSection';

const AdminContent = () => {
  const [activeSection, setActiveSection] = useState<'home' | 'experiences' | 'about' | 'contact' | 'admins' | null>(null);
  const [activeSubSection, setActiveSubSection] = useState<string | null>(null);
  const [openSubCatalog, setOpenSubCatalog] = useState<string | null>(null);

  const handleCatalogClick = (section: 'home' | 'experiences' | 'about' | 'contact' | 'admins') => {
    setActiveSection(section);
    if (openSubCatalog === section) {
      setOpenSubCatalog(null);
    } else {
      setOpenSubCatalog(section);
      setActiveSubSection(null);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection activeSubSection={activeSubSection || 'null'} />;
      case 'experiences':
        return <ExperiencesSection activeSubSection={activeSubSection || 'null'} />;
      case 'about':
        return <AboutSection />;
      case 'contact':
        return <ContactSection />;
      case 'admins':
        return <AdminsSection />;
      default:
        return (
          <div>
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <p>Select a section from the catalog to get started.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex p-4 bg-white dark:bg-black">
      {/* Left-hand catalog */}
      <div className="w-64 bg-white p-6 dark:bg-gray-900 mr-6 rounded-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Catalog</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => handleCatalogClick('home')}
              className={`w-full text-left flex items-center space-x-2 ${activeSection === 'home' ? 'font-bold text-blue-500' : ''}`}
            >
              <FaHome className="text-lg" /> {/* Home Icon */}
              <span>Home</span>
            </button>
            {openSubCatalog === 'home' && (
              <ul className="ml-4 mt-2 space-y-2">
                <li>
                  <button
                    onClick={() => setActiveSubSection('homeWords')}
                    className={`w-full text-left flex items-center space-x-2 ${activeSubSection === 'homeWords' ? 'text-blue-400' : ''}`}
                  >
                    <FaPen className="text-sm" /> {/* Home Words Icon */}
                    <span>Home Words</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSubSection('slidePicture')}
                    className={`w-full text-left flex items-center space-x-2 ${activeSubSection === 'slidePicture' ? 'text-blue-400' : ''}`}
                  >
                    <FaImage className="text-sm" /> {/* Slider Picture Icon */}
                    <span>Slide Picture</span>
                  </button>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              onClick={() => handleCatalogClick('experiences')}
              className={`w-full text-left flex items-center space-x-2 ${activeSection === 'experiences' ? 'font-bold text-blue-500' : ''}`}
            >
              <FaTasks className="text-lg" /> {/* Experiences Icon */}
              <span>Experiences</span>
            </button>
            {openSubCatalog === 'experiences' && (
              <ul className="ml-4 mt-2 space-y-2">
                <li>
                  <button
                    onClick={() => setActiveSubSection('experienceWords')}
                    className={`w-full text-left flex items-center space-x-2 ${activeSubSection === 'experienceWords' ? 'text-blue-400' : ''}`}
                  >
                    <FaPen className="text-sm" /> {/* Experiences Words Icon */}
                    <span>Experiences Words</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSubSection('projectExperiences')}
                    className={`w-full text-left flex items-center space-x-2 ${activeSubSection === 'projectExperiences' ? 'text-blue-400' : ''}`}
                  >
                    <FaProjectDiagram className="text-sm" /> {/* Project Experiences Icon */}
                    <span>Project Experiences</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSubSection('professionalExperiences')}
                    className={`w-full text-left flex items-center space-x-2 ${activeSubSection === 'professionalExperiences' ? 'text-blue-400' : ''}`}
                  >
                    <FaBriefcase className="text-sm" /> {/* Professional Experiences Icon */}
                    <span>Professional Experiences</span>
                  </button>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              onClick={() => handleCatalogClick('about')}
              className={`w-full text-left flex items-center space-x-2 ${activeSection === 'about' ? 'font-bold text-blue-500' : ''}`}
            >
              <FaInfoCircle className="text-lg" /> {/* About Icon */}
              <span>About</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => handleCatalogClick('contact')}
              className={`w-full text-left flex items-center space-x-2 ${activeSection === 'contact' ? 'font-bold text-blue-500' : ''}`}
            >
              <FaPhone className="text-lg" /> {/* Contact Icon */}
              <span>Contact</span>
            </button>
          </li>

          {/* Admins Section */}
          <li>
            <button
              onClick={() => handleCatalogClick('admins')}
              className={`w-full text-left flex items-center space-x-2 ${activeSection === 'admins' ? 'font-bold text-blue-500' : ''}`}
            >
              <FaUserShield className="text-lg" /> {/* Admins Icon */}
              <span>Admins</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Right-hand content */}
      <div className="flex-grow p-6 bg-white dark:bg-gray-800 ml-6 rounded-md shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminContent;
