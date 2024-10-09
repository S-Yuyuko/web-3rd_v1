"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface AboutSectionProps {
  title: string;
  content: string;
  icon: JSX.Element;
  bgColor: string;
  textColor: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ title, content, icon, bgColor, textColor }) => {
  const [isContentVisible, setContentVisible] = useState(false);
  const [isTitleVisible, setTitleVisible] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.1 });

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  const toggleContent = useCallback(() => {
    if (isTitleVisible) {
      setTitleVisible(false);
      setTimeout(() => {
        setContentVisible(true);
      }, 300);
    } else {
      setContentVisible(false);
      setTimeout(() => {
        setTitleVisible(true);
      }, 300);
    }
  }, [isTitleVisible]);

  const createStars = useCallback(() => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      const randomX = Math.random() * 100;
      const randomY = Math.random() * 100;
      stars.push(
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{ left: `${randomX}%`, top: `${randomY}%`, animation: 'twinkle 2s infinite' }}
        >
          <div className="absolute inset-0 w-full h-full bg-transparent">
            <div className="line"></div>
          </div>
        </div>
      );
    }
    return stars;
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`h-screen flex flex-col justify-center items-center cursor-pointer relative ${bgColor}`}
      onClick={toggleContent}
    >
      <div className="absolute inset-0 pointer-events-none">
        {createStars()}
      </div>
      <div className={`transition-opacity duration-500 ease-in-out ${isVisible && isTitleVisible ? 'opacity-100' : 'opacity-0'}`}>
        {isTitleVisible && (
          <h1 className={`text-5xl font-bold ${textColor} mb-4 flex items-center`}>
            {icon}
            <span className="ml-2">{title}</span>
          </h1>
        )}
      </div>
      <div className={`transition-opacity duration-500 ease-in-out ${isVisible && isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
        {isContentVisible && (
          <p className={`text-3xl ${textColor} whitespace-pre-line break-words`}>
            {content}
          </p>
        )}
      </div>
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        .line {
          position: absolute;
          width: 2px;
          height: 15px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 5px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -100%);
          animation: glow 1.5s infinite alternate;
        }

        @keyframes glow {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.5);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutSection;
